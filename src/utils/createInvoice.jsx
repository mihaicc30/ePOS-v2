export const createInvoice = async (total, user, venueNtable) => {
  const items = total.computedBasket;

  let receipt = {
    table: venueNtable.table,
    pubName: venueNtable.venue.name,
    address: venueNtable.venue.address,
    phone: venueNtable.venue.phone,
    website: venueNtable.venue.website,
    items: items,
    vat: ((parseFloat(total.totalPrice) * 20.00) / 100.00).toFixed(2),
    totalAmount: parseFloat(total.totalPrice),
    paymentMethod: "Credit Card",
    cardNumber: "**** **** **** 1234",
    email: user,
  };

  receipt = {
    ...receipt,
    items: receipt.items.map(({ name, qty, price }) => ({ name, qty, price })),
  };

  try {
    await fetch(`${import.meta.env.VITE_API}addreceipt`, {
      method: "POST",
      headers: {
        
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        v: import.meta.env.VITE_G,
        receipt: receipt,
      }),
    }).then(async(results)=> console.log(await results.json()))
  } catch (error) {
    alert(error.message);
  }
};
