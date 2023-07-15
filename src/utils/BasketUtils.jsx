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
  const totalPrice = basketItems.reduce((total, item) => total + parseFloat(item.price * item.qty), 0);
  return totalPrice.toFixed(2);
};

export const getVenueById = (venues, id) => {
  if (!venues || !id) return null;
  return venues.find((venue) => parseInt(venue.id) === parseInt(id)) || null;
};

export const calculateTotal = (basketItems, basketDiscount) => {
  const total = basketItems?.reduce((acc, item) => {
    return acc + item.price * item.qty;
  }, 0);
  const discountAmount = (total * basketDiscount) / 100;
  const discountedTotal = (total - discountAmount).toFixed(2);
  return discountedTotal;
};

export const calculateBasketQTY = (basketItems) => {
  let qty = basketItems?.reduce((total, item) => {
    return total + item.qty;
  }, 0);
  return qty;
};

export const processAllergenList = (AL) => {
  const allergens = Object.entries(AL)
    .filter(([allergen, value]) => value)
    .map(([allergen]) => allergen);

  return allergens.join(", ");
};


export const getStockColour = (stock) => {
  if(stock >= 1 && stock <= 4) {
    return "bg-red-400"
  } else if(stock >= 5 && stock <= 10) {
    return "bg-orange-400"
  } else if(stock >= 20) {
    return "text-transparent"
  }
}