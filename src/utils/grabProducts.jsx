export const grabProducts = async (total, user, venueNtable) => {
  try {
    await fetch(`${import.meta.env.VITE_API}grabProducts`, {
      method: "POST",
      headers: {
        
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        v: import.meta.env.VITE_G,
      }),
    }).then(async (results) => {
      const resp = await results.json();
      return resp;
    });
  } catch (error) {
    alert(error.message);
  }
};
