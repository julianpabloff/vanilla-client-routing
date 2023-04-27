let handleLinkClick, handleLinkHover;
export function createLinkEvents(onClick, onHover) {
	handleLinkClick = function(event) {
		event.preventDefault();
		const href = event.target.href;
		if (href != document.location.href) {
			window.history.pushState(null, null, href);
			onClick();
		}
	}
	handleLinkHover = function(event) {
		onHover(new URL(event.target.href));
	}
}
export function activateLinks(container) {
	const links = container.querySelectorAll('a');
	links.forEach(link => {
		if (
			link.href.includes(document.location.origin) &&
			!link.href.includes('#')
		) {
			link.addEventListener('click', handleLinkClick);
			link.addEventListener('pointerenter', handleLinkHover, { once: true });
		}
	});
}

const containerId = name => name + '-container';

export async function loadHTML(filepath, container, name) {
	const viewContainer = document.createElement('div');
	viewContainer.id = containerId(name);
	// const start = window.performance.now();
	const html = await fetch(filepath).then(data => data.text());
	// console.log('fetch took', window.performance.now() - start, 'ms');

	container.innerHTML = '';
	container.appendChild(viewContainer);
	viewContainer.innerHTML = html;

	return viewContainer;
}

export async function loadCSS(filepath, name) {
	const styleSheet = new CSSStyleSheet();
	const css = await fetch(filepath).then(data => data.text());
	styleSheet.replaceSync(css);

	// Specify CSS to component container
	const rules = styleSheet.cssRules;
	const selector = 'div#' + containerId(name) + ' ';

	function replaceCSSRule(styleSheet, rule, index) {
		if (rule.selectorText) {
			const specifiedRule = selector + rule.cssText;
			styleSheet.deleteRule(index);
			styleSheet.insertRule(specifiedRule, index);
		}
	}

	let i = 0;
	while (i < rules.length) {
		const rule = rules.item(i);
		if (rule instanceof CSSGroupingRule) { // for at-rules
			const subRules = rule.cssRules;
			let j = 0;
			while (j < subRules.length) {
				const subRule = subRules.item(j);
				replaceCSSRule(rule, subRule, j);
				j++;
			};
		} else replaceCSSRule(styleSheet, rule, i);
		i++;
	};

	document.adoptedStyleSheets.push(styleSheet);
}
