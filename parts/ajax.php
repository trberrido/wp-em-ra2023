<?php defined('ABSPATH') or die();

/*

answer to fetch() called in assets/js/hash.js

the content is filled with the ACF structure below
video intro :media object
Pages [
	page title :string
	page class :string
	rows [
		row class :string
		row columns [
			column class :string
			blocks [
				editor :WYSIGYG
			]
		]

	]
]

if the user send a valid page id, the server will return the content of the page, otherwise a 404 error

*/

$error_404 = '
	<div class="ra22-404">
		<h1>Erreur 404</h1>
		<p>La page demandée n\'existe pas.</p>
	</div>
';

if ( ! isset( $_GET['postid'] ) || !isset( $_GET['pageid']) ) {
	echo $error_404;
	exit();
}

$post_id = intval( $_GET['postid'] );
$page_id = intval( $_GET['pageid'] );

$pages = get_field( 'ra23__pages', $post_id );
if ( ! $pages
	|| $page_id < 0
	|| count( $pages ) < $page_id
	|| empty( $pages[ $page_id ] )
) {
	echo $error_404;
	exit();
}

$page = $pages[ $page_id ];
$page_classes = 'ra23-page__container ' . $page['ra23__page__class'];
$content = '<div class="' . $page_classes . '">';
$content .= '<h1 class="page__title">' . $page['ra23__page__title'] . '</h1>';
foreach ( $page['ra23__rows'] as $row ) :
	$content .= '<div class="ra23-row ' . $row['ra23__row__class'] . '">';
	foreach ( $row['ra23__columns'] as $column ) :
		$content .= '<div class="ra23-column ' . $column['ra23__column__class'] . '">';
		foreach ( $column['ra23__blocks'] as $block ) :
			$content .= '<div class="ra23-content__item ' . $block['ra23__block__class'] . '">';
			if ( $block['ra23__content'] ) :
				$content .= $block['ra23__content'];
			endif;
			$content .= '</div>';
		endforeach;
		$content .= '</div>';
	endforeach;
	$content .= '</div>';
endforeach;

$next_id = $page_id + 1 > count( $pages ) - 1 ? 0 : $page_id + 1;
$previous_id = $page_id - 1 < 0 ? count( $pages ) - 1 : $page_id - 1;
$navigation = '
<nav class="content-nav">

	<a class="content-nav__link" href=#' . sanitize_title_with_dashes( $pages[ $previous_id ]['ra23__page__title'] ) . '> < Précédent</a>
	<a class="content-nav__link content-nav__link-close" href="#home">Fermer</a>
	<a class="content-nav__link" href=#' . sanitize_title_with_dashes( $pages[ $next_id ]['ra23__page__title'] ) . '>Suivant > </a>

</nav>
';

$content .= $navigation;

$content .= '</div>';

echo $content;

exit();