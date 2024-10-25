<?php defined('ABSPATH') or die();

// Load all the required php files
add_action( 'after_setup_theme', 'ra23__get_inc_files' );
function ra23__get_inc_files() {
	foreach ( glob( get_stylesheet_directory() . '/inc/*.php' ) as $file ) {
		include_once $file;
	}
}