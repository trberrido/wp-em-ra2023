const topScreen = e => {
	// avoid triggering hashevent if just going back to top
	if (e && e.currentTarget.hash === '#top')
		e.preventDefault();
	window.scrollTo({ top: 0, behavior: 'smooth' });
};

export default topScreen;