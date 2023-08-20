export const createInvoice = async (data) => {
  try {
    await fetch(`${import.meta.env.VITE_API}addreceipt`, {
      method: "POST",
      headers: {
        
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        v: import.meta.env.VITE_G,
        from: "Customer-App",
       data
      }),
    }).then(async(results)=> console.log(await results.json()))
  } catch (error) {
    alert(error.message);
  }
};
