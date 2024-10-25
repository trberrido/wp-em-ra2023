import highlightsFading from "./highlight.js";
import {close as closeMenu} from "./menu.js";
import topScreen from "./top-screen.js";

const hashHandle = () => {

	topScreen();

	const link = document.querySelector('.menu__link[href="' + window.location.hash + '"]');
	if (!link)
		return;

	// go back home
	if (parseInt(link.dataset.pageIndex) < 0){
		// go back home:
		// set the title in it's final state directly
		document.querySelector('.site-title__container').classList.add('site-title__container--already-open');

		// reset the content pages
		document.querySelector('.content').classList.remove('content--fadein');
		document.querySelector('.content .content__landing-zone').innerHTML = '';

		closeMenu();

	// default behavior: fetch content
	} else {

		// launch transition animation
		const leavesContainer = document.querySelector('.transition-leaves__container');
		leavesContainer.classList.add('transition-leaves__container--transiting')
		const leaves = document.querySelectorAll('.transition-leaf');
		leaves.forEach((leaf, index) => {
			setTimeout(() => {
				leaf.classList.add('transition-leaf--ascending');
			}, 250 + (100 * index) );
		});

		// fetching data
		// note: { ra23 } is defined by `ra23__enqueue_scripts()` in `inc/enqueue.php`
		const url = ra23.permalink + '?action=ra23getpage&postid=' + ra23.postId + '&pageid=' + link.dataset.pageIndex;
		fetch(url)
			.then(response => response.text())
			.then(data => {

				// fadeOut leaves, then reset all leaves position
				setTimeout(() => {
					document.querySelector('.content .content__landing-zone').innerHTML = data;
					highlightsFading();
					document.querySelector('.content').classList.add('content--fadein');
					leavesContainer.classList.add('transition-leaves__container--fadeout');
				}, 500 + (100 * leaves.length) );
				setTimeout(() => {
					leaves.forEach(leaf => leaf.classList.remove('transition-leaf--ascending'));
					leavesContainer.classList.remove('transition-leaves__container--fadeout', 'transition-leaves__container--transiting');
				}, 1500 + (100 * leaves.length) );

			});

	}

};

export default hashHandle;