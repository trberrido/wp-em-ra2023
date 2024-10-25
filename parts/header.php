<head>
	<title><?php the_title(); ?></title>
	<meta name="viewport" content="width=device-width, maximum-scale=1.0, minimum-scale=1.0">
	<?php wp_head(); ?>
	<?php
		/*
		 * importmap is not supported by old safaris :/
		 * that's why the import THREE in tiles.js needs the URL
		 * but it's a good way to manage dependencies, i kept it as reference
		 */
	?>
	<script type="importmap">
	{
		"imports": {
		"three": "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js",
		"three/addons/": "https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/"
		}
	}
	</script>
</head>