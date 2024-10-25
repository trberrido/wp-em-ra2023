/*

This file is about navigation and global behavior of the website.

type: module

*/

import { init as initMenu } from './modules/menu.js';
import hashHandle from './modules/hash.js';
import { init as tilesInit, opening as tilesOpening } from './modules/tiles.js';
import topScreen from './modules/top-screen.js';

// entry point, we'll call from here all the other js functions
document.addEventListener('DOMContentLoaded', () => {

	console.log('If you can fill the unforgiving minute \/ With sixty seconds\' worth of distance run');

	/*
	 * when images for bg and tiles are loaded
	 * 1/ logo apparition animation
	 * 2/ then tiles appation animation
	 */

	const requiredAssets = {
		items: [
			ra23.templateUri + '/assets/images/background.jpg'
		].concat(ra23.tilesData.map(tile => tile.image)),
		loaded: 0
	};

	requiredAssets.items.forEach(src => {
		const img = new Image();
		img.onload = () => {
			requiredAssets.loaded += 1;
			if (requiredAssets.loaded === requiredAssets.items.length) {

				// menu interaction
				initMenu();

				// hashchange handles all the navigations
				window.addEventListener('hashchange', hashHandle);

				// if the hash is set, load the corresponding page
				if (window.location.hash && window.location.hash !== '#home')
					hashHandle();

				// start the opening logo animation
				document.body.classList.add('bg--loaded');

				// load the tiles and their interactions
				tilesInit();
				setTimeout(() => {
					tilesOpening();
				}, 3000);

				document.querySelector('.footer__button-top').addEventListener('click', topScreen);

			}
		};
		img.src = src;
	});


	// are the fonts loaded ?
	// document.fonts.ready.then(() => document.body.classList.add('loaded') );

});