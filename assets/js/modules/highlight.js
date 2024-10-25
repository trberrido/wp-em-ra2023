const highlightsFading = () => {

	const observer = new IntersectionObserver((entries)=>{
		entries.forEach((entry, index)=>{
			if(entry.isIntersecting){
				setTimeout(() => {
					entry.target.classList.add('--fadein');
					if (entry.target.closest('.highlight-green')){
						entry.target.closest('.highlight-green').classList.add('--fadein');
					}
					observer.unobserve(entry.target);
				}, 100 * index );
			}
		});
	});

	const highlights = document.querySelectorAll('.ra23-content__item');

	highlights.forEach(highlight => {
		observer.observe(highlight);
	});

}

export default highlightsFading;