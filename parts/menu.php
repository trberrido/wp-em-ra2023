<button class="button menu__button-open button-menu-open">Sommaire</button>

<?php

// get menu items data
$pages = get_field( 'ra23__pages' );

// put data ?>

<div class="menu__container menu__container--closed">
	<nav class="menu__nav">
		<a class="button menu__link-main-site" href="<?php echo get_site_url(); ?>">Revenir au site Ecomaison.com</a>
		<ul class="menu__list">
				<li class="menu__item">
					<span class="masked">
						<a
							data-page-index="-1"
							href="#home"
							class="menu__link menu__link-home">
								<img alt="Rapport d'activité Écomaison" src="<?php echo get_template_directory_uri(); ?>/assets/images/menu logo.jpg" />
						</a>
					</span>
				</li>
			<?php
			$index = 0;
			foreach ( $pages as $page ) : ?>
				<li class="menu__item">
					<span class="masked">
						<a
							data-page-index="<?php echo $index; ?>"
							href="#<?php echo sanitize_title_with_dashes( $page['ra23__page__title'] ); ?>"
							class="menu__link">
								<?php echo $page['ra23__page__title']; ?>
						</a>
					</span>
				</li>
			<?php
			$index += 1;
			endforeach; ?>
		</ul>
		<button class="button button-close button-menu-close">Fermer le sommaire</button>
	</nav>
</div>