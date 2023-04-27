import { intervalIterate } from '../../utils/animations.js';

export default function About() {
	const p = document.getElementById('about-p');
	intervalIterate(10, 100, i => {
		const opacity = (1 + i) / 100;
		p.style.opacity = opacity;
	});
}
