<?php defined('ABSPATH') or die();

add_filter('show_admin_bar', '__return_false');

function console() {

	$fn_argv = func_get_args();

	echo '<pre style="position: static; max-width: 50rem; z-index: 999; background-color:#ececec; color: black; padding: 1rem; border: 1px solid #666666; font-size: .8rem; border-radius: .5rem;">';
	foreach ( $fn_argv as $fn_arg ) {
		var_dump( $fn_arg );
		echo '-----------<br>';
	}
	echo '</pre>';

}