import { activateLinks, createLinkEvents, loadHTML, loadCSS } from './view-loader.js';
import About from '/views/about/about.js';
import Contact from '/views/contact/contact.js';

const routes = {
	'/about': {
		name: 'about',
		template: '/views/about/about.html',
		styles: '/views/about/about.css',
		initializer: About
	},
	'/contact': {
		name: 'contact',
		template: '/views/contact/contact.html',
		styles: '/views/contact/contact.css',
		initializer: Contact
	}
}

// Convert each hardcoded route to a RegExp
const regexRoutes = Array.from(Object.keys(routes).map(path => {
	const regex = '^' + path.replace(/\//g, '\\/').replace(/:\w+/g, '(.+)') + '$';
	return { path, regex };
}));

function getView(pathname) {
	let i = 0;
	do {
		const { path, regex } = regexRoutes[i];
		const match = pathname.match(regex);
		if (match) return routes[path];
		i++;
	} while (i < regexRoutes.length);
	return null;
}

let root;
async function handleLocation() {
	const pathname = window.location.pathname;
	const view = getView(pathname);
	if (view) {
		await loadCSS(view.styles, view.name);
		const viewContainer = await loadHTML(view.template, root, view.name);
		activateLinks(viewContainer);
		view.initializer();
	} else {
		root.innerHTML = '';
	}
}

const prefetched = new Set();
async function preLoad(url) {
	const path = url.pathname;
	if (routes[path] && !prefetched.has(path)) {
		const link = document.createElement('link');
		link.rel = 'prefetch';
		link.href = routes[url.pathname].template;
		link.as = 'document';
		// link.onload = () => console.log('prefetched', routes[url.pathname].name);
		document.head.appendChild(link);
		prefetched.add(path);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	root = document.getElementById('root');
	window.onpopstate = handleLocation;
	createLinkEvents(handleLocation, preLoad);
	activateLinks(document.body);
	handleLocation();
});
