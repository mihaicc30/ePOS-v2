export const calculateTotalPrice = (basketItems) => {
  const totalPrice = basketItems.reduce((total, item) => total + parseFloat(item.price * item.qty), 0);
  return totalPrice.toFixed(2);
};

export const getVenueById = (venues, id) => {
  if (!venues || !id) return null;
  return venues.find((venue) => venue.id === id) || null;
};

export const handlePrinting = async (data) => {
  let { basketItems, tableNumber, venue, user } = data;

  let tempBasket = basketItems.filter((item) => item.printed === false);
  let areAllPrinted = basketItems.some((item) => item.printed == false);

  const updatedBasketItems = basketItems.map((item) => {
    if (!item.printed) {
      return {
        ...item,
        printed: true,
        datePrinted: new Date().toISOString("en-GB"),
        printedBy: localStorage.getItem("displayName"),
      };
    }
    return item;
  });
  basketItems = updatedBasketItems;

  let barBasket = basketItems.filter((item) => item.subcategory_course < 1);

  let course1 = basketItems.filter((item) => item.subcategory_course == 1);
  let course2 = basketItems.filter((item) => item.subcategory_course == 2);
  let course3 = basketItems.filter((item) => item.subcategory_course == 3);

  let kitchenBasket = [];

  if (course1.length > 0)
    kitchenBasket.push({
      name: "Line",
      refID: crypto.randomUUID(),
      dateString: new Date().toLocaleString("en-GB"),
      date: new Date().toISOString("en-GB"),
      price: 0,
      qty: 1,
      printed: true,
      datePrinted: new Date().toISOString("en-GB"),
      printedBy: "Customer-App",
    });
  course1.forEach((item) => {
    kitchenBasket.push(item);
  });
  if (course2.length > 0)
    kitchenBasket.push({
      name: "Line",
      refID: crypto.randomUUID(),
      dateString: new Date().toLocaleString("en-GB"),
      date: new Date().toISOString("en-GB"),
      price: 0,
      qty: 1,
      printed: true,
      datePrinted: new Date().toISOString("en-GB"),
      printedBy: "Customer-App",
    });
  course2.forEach((item) => {
    kitchenBasket.push(item);
  });
  if (course3.length > 0)
    kitchenBasket.push({
      name: "Line",
      refID: crypto.randomUUID(),
      dateString: new Date().toLocaleString("en-GB"),
      date: new Date().toISOString("en-GB"),
      price: 0,
      qty: 1,
      printed: true,
      datePrinted: new Date().toISOString("en-GB"),
      printedBy: "Customer-App",
    });
  course3.forEach((item) => {
    kitchenBasket.push(item);
  });

  let barData = {
    orderType: "bar",
    venueID: venue,
    table: tableNumber,
    displayName: localStorage.getItem("displayName"),
    email: localStorage.getItem("email"),
    items: barBasket,
  };
  let kitchenData = {
    orderType: "kitchen",
    venueID: venue,
    table: tableNumber,
    displayName: localStorage.getItem("displayName"),
    email: localStorage.getItem("email"),
    items: kitchenBasket,
  };

  
 if(barBasket.length> 0) await addOrder(barData);
 if(kitchenBasket.length> 0)await addOrder(kitchenData);
};

export const addOrder = async (data) => {
  try {
    const query = await fetch(`${import.meta.env.VITE_API}addOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        v: import.meta.env.VITE_G,
        data,
      }),
    });
    const response = await query.json();
    return response;
  } catch (error) {
    alert(error.message);
  }
};
