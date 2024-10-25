const shuffle = (array) => {
	return array
		.map(value => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value)
}

// duplicate the items in an array
const duplicate = (array, times, round) => {
	let largerArray = [...array];
	let index = 0;
	while (index < times) {
		largerArray = largerArray.concat(array);
		index++;
	}
	// if array.length is not a multiples of round, remove the excessive items
	if (round && largerArray.length % round) {
		largerArray.splice(-1 * (largerArray.length % round));
	}
	return largerArray;
}

const randShift = () => {
	const tileSize = 1.5;
    return Math.random() * (tileSize * .5) - (tileSize * .5);
};

export { shuffle, duplicate, randShift }