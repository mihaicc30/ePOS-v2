export const isConsecutive = (arr) => {
	const sortedArr = arr.sort((a, b) => a - b); // Sort the array in ascending order
	for (let i = 0; i < sortedArr.length - 1; i++) {
		if (sortedArr[i] + 1 !== sortedArr[i + 1]) {
			return false; // Numbers are not consecutive
		}
	}
	return true; // Numbers are consecutive
};

export const calculateTotalPrice = (basketItems) => {
	const totalPrice = basketItems.reduce(
		(total, item) => total + parseFloat(item.price * item.qty),
		0,
	);
	return totalPrice.toFixed(2);
};

export const getVenueById = (venues, id) => {
	if(!venues || !id) return null
	return venues.find((venue) => venue.id === id) || null;
};
