import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';
import { shuffle, duplicate, randShift } from './tiles-utils.js';

// anime.js documentation : https://animejs.com/documentation/
import anime from './anime.es.js';

/*
* configures tiles options
*/

// the tiles are displayed in a grid, so we need to know how many columns we want
// the row will be deduced from the number of columns and the number of tiles
// we use a maxColumns to debug: if we have less tiles than maxColumns,
// we will use the number of tiles
const maxColumns = 6;
// number of total tiles to display (not the number of unique tiles)
const tilesLength = 18;
// tiles are square, so the size is the same for width and height
// this size may have to be also set in modules/tiles-utils::randShift
const tileSize = 2.5;
const columnsLength = maxColumns > tilesLength ? tilesLength : maxColumns;
const rowsLength = Math.floor(tilesLength / columnsLength);
const gap = tileSize * 0.4;
const tiles = [];
const shiftPerRow = tileSize * 0;
const shiftPerColumn = tileSize * -1;
const group = {
	width: columnsLength * tileSize + ((columnsLength - 1) * gap),
	height: rowsLength * tileSize + ((rowsLength - 1) * gap)
}

group.min = {
	x: group.width / 2 * -1,
	y: group.height / 2 * -1
}

group.max = {
	x: group.width / 2,
	y: group.height / 2
}

const startCoord = {
	x: group.min.x,
	y: group.max.y,
	z: 0
}

// Configure THREE js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
camera.position.z = 2.5;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const canvas = renderer.domElement;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const velocity = {
	x: {
		value: 0,
		values: [0, 0, 0, 0, 0, 0, 0, 0, 0]
	},
	y: {
		value: 0,
		values: [0, 0, 0, 0, 0, 0, 0, 0, 0]
	}
};
const direction = {
	x: 0,
	y: 0
}

// dummy for debug
const createDummy = (w, h, x = 0, y = 0) => {
	const dumGeom = new THREE.PlaneGeometry( w, h );
	const dumMat = new THREE.MeshBasicMaterial( {color: 0x000000, opacity:.5, wireframe: true, side: THREE.DoubleSide} );
	const dumMesh = new THREE.Mesh( dumGeom, dumMat );
	dumMesh.position.x = x;
	dumMesh.position.y = y;
	dumMesh.position.z = 0.1;
	scene.add( dumMesh );
}

//createDummy(10, 9);
//createDummy(15, 15);

/* Put the tiles on screen */
const init = () => {

	shuffle(duplicate(ra23.tilesData, parseInt(tilesLength / ra23.tilesData.length), columnsLength)).forEach((tileData, index) => {

		// Load texture
		const loader = new THREE.TextureLoader();
		const texture = loader.load(tileData.image, () => {
			renderer.render(scene, camera);
		});
		texture.wrapS = THREE.RepeatWrapping;
		texture.repeat.x = -1;
		texture.colorSpace = THREE.SRGBColorSpace;
		// make 3 plane geometry
		const geometry = new THREE.PlaneGeometry(tileSize, tileSize);
		const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide});
		const tile = new THREE.Mesh(geometry, material);
		tile.material.transparent = true;
		tile.material.opacity = 0;
		const tileIndex = {
			x: index % columnsLength,
			y: Math.floor(index / columnsLength),
		}

		const gaps = {
			x: tileIndex.x * gap,
			y: tileIndex.y * gap
		}

		const localShift = {
			x: shiftPerRow * (rowsLength - 1 - tileIndex.y),
			y: shiftPerColumn * (columnsLength - 1 - tileIndex.x) * -1
		};

		tile.position.x = localShift.x + startCoord.x + tileSize / 2 + (tileIndex.x * tileSize) + gaps.x + randShift();
		tile.position.y = localShift.y + startCoord.y - tileSize / 2 - (tileIndex.y * tileSize) - gaps.y + randShift();

		tile.hash = tileData.hash;
		tile.originalScales = { x: tile.scale.x, y: tile.scale.y, z: tile.scale.z };
		tile.scale.x = 0;
		tile.scale.y = 0;
		scene.add(tile);
		tiles.push(tile);

	});

	window.addEventListener('resize', handleResize);

	animate();

}

/*
 * event functions
 */

const handleResize = () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

// drag and drop required variables
let isDragging = false;
let wasDragging = false;
let previousMousePosition = [
	{ x: 0, y: 0},
	{ x: 0, y: 0}
];

const sreenTouchStart = (event) => {
	isDragging = true;
	document.body.style.cursor = 'grabbing';
	velocity.x.value = 0;
	velocity.y.value = 0;
	// checking if mouse or touch
	previousMousePosition[0].x = event.type === 'mousedown' ? event.clientX : event.touches[0].clientX;
	previousMousePosition[0].y = event.type === 'mousedown' ? event.clientY : event.touches[0].clientY;
};

const screenTouchMove = (event) => {
	event.preventDefault();
	if (isDragging){
		previousMousePosition[1].x = previousMousePosition[0].x;
		previousMousePosition[1].y = previousMousePosition[0].y;
		wasDragging = true;
		// checking if mouse or touch
		const clientX = event.type === 'mousemove' ? event.clientX : event.touches[0].clientX;
		const clientY = event.type === 'mousemove' ? event.clientY : event.touches[0].clientY;
		const deltaMove = {
			x: clientX - previousMousePosition[0].x,
			y: clientY - previousMousePosition[0].y
		};
		previousMousePosition[0] = {
			x: clientX,
			y: clientY
		};
		tiles.forEach(tile => {
			tile.position.x += deltaMove.x * 0.01;
			tile.position.y -= deltaMove.y * 0.01;
		});
	}
};

const screenTouchEnd = (event) => {
	isDragging = false;
	if (wasDragging){
		direction.x = previousMousePosition[0].x  - previousMousePosition[1].x > 0 ? 1 : -1;
		direction.y = previousMousePosition[0].y  - previousMousePosition[1].y > 0 ? -1 : 1;
		velocity.x.value = Math.abs(previousMousePosition[0].x - previousMousePosition[1].x);
		velocity.y.value = Math.abs(previousMousePosition[0].y - previousMousePosition[1].y);
		document.body.style.cursor = 'auto';
		wasDragging = false;
	} else {
		onTileClick(event)
	}
};

/* Move the tiles in diagonal when the user scroll */
window.addEventListener('wheel', (event) => {
	velocity.x.value += 1;
	velocity.y.value += 1;
	if (event.wheelDelta > 0) {
		direction.x = 1;
		direction.y = -1;
	} else {
		direction.x = -1;
		direction.y = 1;
	}
}, {passive: false});

/* on click: the function is called on mouse up
 * bc we need to differentiate mouseup after drag and drop and mouseup after a basic click
 */

const onTileClick = event => {

	if (wasDragging) return;

	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObjects(tiles);

	if (intersects.length > 0) {
		window.location.hash = intersects[0].object.hash;
	}
}

const onTileMouseOver = (event) => {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObjects(tiles);

	if (intersects.length > 0 && isDragging === false) {
		document.body.style.cursor = 'pointer';
	} else if (isDragging === false) {
		document.body.style.cursor = 'auto';
	}
	tiles.forEach((tile, index) => {
		if (intersects.length > 0 && intersects[0].object === tile) {
			// Animate scale to grow using anime.js
			anime({
				targets: tile.scale,
				x: tile.originalScales.x * 1.25,
				y: tile.originalScales.y * 1.25,
				duration: 2000,
				easing: 'cubicBezier(0, .6, .2, 1)'
			});
		} else {
			// Animate scale to reset using anime.js
			anime({
				targets: tile.scale,
				x: tile.originalScales.x,
				y: tile.originalScales.y,
				duration: 2000,
				easing: 'cubicBezier(0, 0.6, 0.2, 1)'
			});
		}
	});
}

canvas.addEventListener('mouseleave', () => {
	// Remove every effect of mouse over: scale + mouse pointer
	document.body.style.cursor = 'auto';
	tiles.forEach((tile, index) => {
		anime({
			targets: tile.scale,
			x: tile.originalScales.x,
			y: tile.originalScales.y,
			duration: 2000,
			easing: 'cubicBezier(0, 0.6, 0.2, 1)'
		});

	});
});

/*
 * Animation functions
 */

/*
 * opening: when the app is starting,
 * we want the tiles to appear, coming from outside the screen to the center
 * Once it's over, we can add listeners and stuff
*/

const opening = () => {
	anime({
		targets: camera.position,
		z: 10,
		duration: 3000,
		easing: 'cubicBezier(.75, 0, .2, 1)'
	})
	tiles.forEach(tile => {
		anime({
			targets: tile.scale,
			x: tile.originalScales.x,
			y: tile.originalScales.y,
			duration: 3000,
			easing: 'cubicBezier(.75, 0, .2, 1)'
		});
		anime({
			targets: tile.material,
			opacity: 1,
			delay: 500,
			duration: 2000,
			easing: 'cubicBezier(.75, 0, .2, 1)'
		});
	});

	// add listeners after the opening
	setTimeout(() => {
		canvas.addEventListener('mousemove', onTileMouseOver);
		canvas.addEventListener('mousedown', sreenTouchStart);
		canvas.addEventListener('mouseup', screenTouchEnd);
		canvas.addEventListener('mousemove', screenTouchMove);
		canvas.addEventListener('touchstart', sreenTouchStart);
		canvas.addEventListener('touchend', screenTouchEnd);
		canvas.addEventListener('touchmove', screenTouchMove);
	}, 3000);

}

// lookat, so the tiles always keep oriented to a center point
// note: the point get closer with the velocity increasing to produce a bubble effect
const updateLookAt = () => {
	const targetPointOriginalZ = 50;
	const v = Math.abs(velocity.x.value + velocity.y.value) / 2;
	const targetPointNewZ = -1 * targetPointOriginalZ / (v + .5);
//	console.log(targetPointNewZ);
	const targetPoint = new THREE.Vector3(0, 0, targetPointNewZ);
	tiles.forEach(tile => {
		tile.lookAt(targetPoint);
	});
}

const updateTilesPositions = () => {
	if (isDragging) return;
	const zShift = Math.abs(velocity.x.value + velocity.y.value) * .1;
	tiles.forEach(tile => {
		tile.position.x += velocity.x.value * direction.x * .25;
		tile.position.y += velocity.y.value * direction.y * .25;
		tile.position.z = zShift;
	});
}

/* ensure the earth is round :
 * when a tiles is out of the screen, we move it to the opposite side
 */

const handleTilesOverflow = () => {

	const buffer = .5;
	tiles.forEach(tile => {

		// note about `const delta` : the accurate overflow
		// bc of the refreshing rate and stuff u no

		if (tile.position.x >= group.max.x + buffer) {
			const delta = tile.position.x - group.max.x;
			tile.position.x = group.min.x - gap + delta;
		}

		if (tile.position.x < group.min.x - buffer) {
			const delta = group.min.x - tile.position.x;
			tile.position.x = group.max.x + gap - delta ;
		}

		if (tile.position.y >= group.max.y + buffer) {
			const delta = tile.position.y - group.max.y;
			tile.position.y = group.min.y - gap + delta;
		}

		if (tile.position.y < group.min.y - buffer) {
			const delta = group.min.y - tile.position.y;
			tile.position.y = group.max.y + gap - delta;
		}

	});

};

const updateVelocity = () => {
	/*
	 * 1/ reduce the velocity towards 0
	 * 2/ prevent `speed jump` by averaging with the past values
	 */
	for (const axis in velocity) {
		velocity[axis].value *= 0.9;
		velocity[axis].values.push(velocity[axis].value);
		velocity[axis].values.shift();
		velocity[axis].value = velocity[axis].values.reduce((acc, value) => acc + value) / (velocity[axis].values.length * 1.5);
	}
}

// Animation loop
const animate = () => {

	requestAnimationFrame(animate);

	updateVelocity();
	updateTilesPositions()
	handleTilesOverflow();
	updateLookAt();

	renderer.render(scene, camera);
};

export { init, opening };