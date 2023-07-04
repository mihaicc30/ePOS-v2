export const CheckAccess = async (path) => {
  const query = await fetch(`${import.meta.env.VITE_API}a${path}`, {
    method: "POST",
    headers: {
      "auth-token": localStorage.getItem("jwtToken"),
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      v: import.meta.env.VITE_G,
    }),
  });
  console.log("query.status", query.status);
  return query.status === 200;
};
