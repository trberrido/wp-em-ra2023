<?php defined('ABSPATH') or die();

function ra23__concatene_files( $sources, $destination ) {

	$content = '/*
 * !!! It is useless to edit this file,
 * as it\'s the result of a concatenation process.
 * You need to set WP_ALLOW_MULTISITE to development in order to edit any of the sources files.
 */';
	$destination_filename = substr( strrchr( $destination, '/' ), 1 );

	foreach ( glob( $sources ) as $source ) {

		$filename = substr( strrchr( $source, '/' ), 1 );

		if ( strcmp( $filename, $destination_filename ) !== 0 ) {
			$content .= "\r\n\r\n/* $filename */\r\n\r\n";
			$content .= file_get_contents( $source );
		}

	}

	return file_put_contents( $destination, $content );

}

/*
 * Workaround to add type="module" to script tags
 * AND still using wp_add_inline_script
 * otherwise `wp_enqueue_script_module` would be the way to go
*/
add_filter('script_loader_tag', 'make_scripts_modules' , 10, 3);
function make_scripts_modules( $tag, $handle, $src ) {

	$modules = [
		'ra23-main.js',
		'ra23-production-script.js'
	];

	if ( ! in_array( $handle, $modules ) ) {
		return $tag;
	}

	$parts = explode( '</script>', $tag ); // Break up our string

	foreach ( $parts as $key => $part ) {
		if ( false !== strpos( $part, $src ) ) { // Make sure we're only altering the tag for our module script.
			$parts[ $key ] = '<script type="module" src="' . esc_url( $src ) . '" id="' . esc_attr( $handle ) . '">';
		}
	}

	$tags = implode( '</script>', $parts ); // Bring everything back together

	return $tags;
}

// fetch tiles data
function ra23__get_tiles_data( $post_id ) {

	$tiles_data = array();

	$pages = get_field( 'ra23__pages', $post_id );
	array_map( function( $page ) use ( &$tiles_data ) {
		array_push( $tiles_data, array(
			'image'		=> $page['ra23__page__tile_image'],
			'hash'		=> '#' . sanitize_title_with_dashes( $page['ra23__page__title'] )
		) );
	}, $pages );

	return $tiles_data;

}

// Enqueuing scripts
add_action('wp_enqueue_scripts', 'ra23__enqueue_scripts');

function ra23__enqueue_scripts() {

	// the process is here similar to `ra23__enqueue_styles()`, check it for further explainations
	$data = array(
//		'ajaxUrl'			=> esc_url( admin_url( 'admin-ajax.php' ) ),
		'permalink'			=> get_permalink(),
		'postId'			=> get_the_ID(),
		'templateUri'		=> get_template_directory_uri(),
		'environnementType' => wp_get_environment_type(),
		'tilesData'			=> ra23__get_tiles_data( get_the_ID() ),
	);
	$data_inline = 'const ra23 = ' . wp_json_encode( $data, JSON_UNESCAPED_UNICODE );
	$production_script_filename = 'production-script.js';

	if ( wp_get_environment_type() === 'production' ) {

		$handle = 'ra23-' . $production_script_filename;
		wp_enqueue_script(
			$handle,
			get_stylesheet_directory_uri() . '/assets/js/' . $production_script_filename,
			array(),
			filemtime( get_stylesheet_directory() . '/assets/js/' . $production_script_filename ),
			true
		);
		wp_add_inline_script( $handle, $data_inline );

	} else {

		$handle = false;
		foreach ( glob( get_stylesheet_directory() . '/assets/js/*.js' ) as $file) {

			$filename = substr( strrchr( $file, '/' ), 1 );
			if ( $production_script_filename === $filename ){
				continue;
			}
			$handle = 'ra23-' . $filename;

			wp_enqueue_script( $handle, get_stylesheet_directory_uri() . '/assets/js/' . $filename, array(), false, true );

		}

		if ( $handle ) {
			wp_add_inline_script( $handle, $data_inline );
		}

	}

	if ( wp_get_environment_type() === 'development' || wp_get_environment_type() === 'local' ) {

		ra23__concatene_files( get_stylesheet_directory() . '/assets/js/*.js', get_stylesheet_directory() . '/assets/js/' . $production_script_filename );

	}

}

// Enqueuing styles
// Front && editor sides
add_action( 'enqueue_block_assets', 'ra23__enqueue_styles' );
function ra23__enqueue_styles() {

	$production_style_filename = 'production-style.css';

	// if prod
	//		load the file concatened in development
	// if staging
	//		load all the files individually
	// if dev
	//		load all the files individually
	//		concatenate all the files into a single file to be ready to use in production

	if ( wp_get_environment_type() === 'production' ) {

		wp_enqueue_style(
			'ra23-' . $production_style_filename,
			get_stylesheet_directory_uri() . '/assets/css/' . $production_style_filename,
			array(),
			filemtime( get_stylesheet_directory() . '/assets/css/' . $production_style_filename )
		);

	} else {

		foreach ( glob( get_stylesheet_directory() . '/assets/css/*.css' ) as $file) {

			$filename = substr( strrchr( $file, '/' ), 1 );
			if ( $production_style_filename === $filename ){
				continue;
			}
			wp_enqueue_style( 'ra23-' . $filename, get_stylesheet_directory_uri() . '/assets/css/' . $filename, array(), filemtime( $file ) );

		}

	}

	if ( wp_get_environment_type() === 'development' || wp_get_environment_type() === 'local' ) {

		ra23__concatene_files( get_stylesheet_directory() . '/assets/css/*.css', get_stylesheet_directory() . '/assets/css/' . $production_style_filename );

	}

}

// enqueue block styles to override existing blocks (core, woocommerce, ...)
add_action( 'init', 'ra23__blocks__enqueue_styles' );
function ra23__blocks__enqueue_styles() {
	foreach ( glob( get_stylesheet_directory() . '/assets/css/blocks-overriding/*', GLOB_ONLYDIR ) as $directory) {
		$namespace = substr( strrchr( $directory, '/' ), 1 );
		foreach ( glob( $directory . '/*.css' ) as $file) {
			$filename = pathinfo( $file, PATHINFO_FILENAME );

			// wp_enqueue_block_style ( block_name, [css_file_infos: path, version, etc] )
			wp_enqueue_block_style(
				$namespace . '/' . $filename,
				array(
					'handle'	=> 'ra23-override--' . $namespace . '-' . $filename,
					'src'		=> get_stylesheet_directory_uri() . '/assets/css/blocks-overriding/' . $namespace . '/' . $filename . '.css',
					'path'		=> get_stylesheet_directory() . '/assets/css/blocks-overriding/' . $namespace . '/' . $filename . '.css',
					'ver'		=> filemtime( get_stylesheet_directory() . '/assets/css/blocks-overriding/' . $namespace . '/' . $filename . '.css' )
				)
			);
		}

	}
}