<?php

/*
	we are using multiple themes on the same site.
	The extension Multiple Themes works pretty well
	except for ajax call, so we have to handle them by ourselves :,(
*/

if ( isset( $_GET['action'] ) ) :

	get_template_part( 'parts/ajax' );

else : ?>

<!DOCTYPE html>

<html lang="fr">

	<?php get_template_part( 'parts/header' ); ?>

	<body>

		<?php // used for bottom anchor back to top thingy ?>
		<span id="top"></span>

		<?php get_template_part( 'parts/menu' ); ?>

		<div class="site-title__container">
			<h1 class="site-title">
				<img alt="Rapport annuel Écomaison 2023" src="<?php echo get_template_directory_uri(); ?>/assets/images/logo.png"/>
			</h1>
		</div>

		<?php // .content: where ajax-loaded content from pages will be put: ?>
		<div class="content">
			<div class="content__chevron"></div>
			<div class="content__logo-container content-header__logo-container">
				<a href="#home">
					<img alt="Revenir à l'accueil" src="<?php echo get_template_directory_uri(); ?>/assets/images/logo-color.webp"/>
					ecomaison
				</a>
			</div>
			<div class="content__landing-zone"></div>
			<?php get_template_part( 'parts/content-footer' ); ?>
		</div>

		<?php // used for animated transition when loading a content page ?>
		<div class="transition-leaves__container">
			<div class="transition-leaf"></div>
			<div class="transition-leaf"></div>
			<div class="transition-leaf"></div>
		</div>

		<?php get_template_part( 'parts/footer' ); ?>

	</body>

</html>

<?php endif;