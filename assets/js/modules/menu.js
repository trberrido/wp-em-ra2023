import topScreen from './top-screen.js';

const open = () => {

	topScreen();

	const menu = document.querySelector('.menu__container');

	// open the container
	menu.classList.remove('menu__container--closed');
	menu.classList.add('menu__container--open');

	// animated apparitions
	menu.querySelectorAll('.masked').forEach((masked, index) => {
		setTimeout(() => {
			masked.classList.add('animated-unmask');
		}, 175 + (100 * index) );
	});

}

const close = () => {

	const menu = document.querySelector('.menu__container');

	// close container
	menu.classList.remove('menu__container--open');
	menu.classList.add('menu__container--closed');

	// remove appareance related classes
	menu.querySelectorAll('.masked').forEach(masked => masked.classList.remove('animated-unmask'));

}

const init = () => {

	// open menu event
	document.querySelector('.button-menu-open').addEventListener('click', open);

	// close menu events
	document.querySelector('.button-menu-close').addEventListener('click', close);
	document.querySelectorAll('.menu__link').forEach(link => link.addEventListener('click', close));

	// no event on menu items: all the events are handled by the hashchange event

}

export { open, close, init };