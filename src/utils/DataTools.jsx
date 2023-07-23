export const fetchWeeklyWeather = async () => {
  try {
    const response = await fetch("http://api.weatherapi.com/v1/forecast.json?key=df0973195a8141f99d8195727231207&q=worcester%20uk&days=7&aqi=no&alerts=no");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
};

export const getTables = async () => {
  try {
    const query = await fetch(`http://localhost:3000/grabTableLayout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        v: import.meta.env.VITE_G,
        fromvenueid: 101010,
      }),
    });
    const response = await query.json();
    console.log("Receied table layout.", new Date().toUTCString());
    return response;
  } catch (error) {
    console.log(error.message);
  }
};
export const getVenues = async () => {
  try {
    const query = await fetch(`http://localhost:3000/grabVenues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        v: import.meta.env.VITE_G,
      }),
    });
    const response = await query.json();
    console.log("Receied venue data.", new Date().toUTCString());
    return response;
  } catch (error) {
    console.log(error.message);
  }
};

export const getMenu = async () => {
  try {
    const query = await fetch(`http://localhost:3000/grabProducts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        v: import.meta.env.VITE_G,
      }),
    });
    const response = await query.json();
    console.log("Receied menu data.", new Date().toUTCString());
    return response;
  } catch (error) {
    console.log(error.message);
  }
};

export const fetchHoliday = async () => {
  try {
    const response = await fetch("https://www.gov.uk/bank-holidays.json");
    const data = (await response.json())["england-and-wales"].events;
    let todaysDate = new Date();

    let formattedDate = todaysDate.toISOString().split("T")[0];
    const event = data.find((event) => event.date === formattedDate);

    let currentDate = new Date();
    let holidays = [];
    for (let i = 0; i < 7; i++) {
      let formattedDate = currentDate.toISOString().split("T")[0];
      const event = data.find((event) => event.date === formattedDate);
      holidays.push([formattedDate, event]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return holidays;
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
};

// export const fetchForecastWeek = async () => {
//   if (localStorage.getItem("forecast7") === "true") return;
//   localStorage.setItem("forecast7", true);

//   for (let n = 1; n < 8; n++) {
//     let dayt = (new Date().getDay() + n) % 7;

//     setTimeout(async () => {
//       let tempz = {
//         cloudy: weeklyWeather.forecast.forecastday[`${n - 1}`].hour[12].cloud,
//         humidity: weeklyWeather.forecast.forecastday[`${n - 1}`].hour[12].humidity,
//         windspeed: weeklyWeather.forecast.forecastday[`${n - 1}`].hour[12].wind_mph,
//         temp: weeklyWeather.forecast.forecastday[`${n - 1}`].hour[12].temp_c,
//         daytype: dayt,
//         isholiday: weeklyholiday[`${n - 1}`]?.title ? 1 : 0,
//       };
//       console.log(`calling api with this data:`, tempz);
//       try {
//         const response = await fetch(`${import.meta.env.VITE_API}forecast-quick`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Access-Control-Allow-Credentials": true,
//           },
//           body: JSON.stringify({
//             cloudy: weeklyWeather.forecast.forecastday[n - 1].hour[12].cloud,
//             humidity: weeklyWeather.forecast.forecastday[n - 1].hour[12].humidity,
//             windspeed: weeklyWeather.forecast.forecastday[n - 1].hour[12].wind_mph,
//             temp: weeklyWeather.forecast.forecastday[n - 1].hour[12].temp_c,
//             daytype: dayt,
//             isholiday: holiday[1]?.title ? 1 : 0,
//           }),
//         });
//         const data = await response.json();

//         const currentDate = new Date();
//         currentDate.setDate(currentDate.getDate() + n);
//         const year = currentDate.getFullYear();
//         const month = String(currentDate.getMonth() + 1).padStart(2, "0");
//         const day = String(currentDate.getDate()).padStart(2, "0");

//         setWeeklyForecast((prevState) => ({
//           ...prevState,
//           [n]: { date: `${year}-${month}-${day}`, average: data.average },
//         }));


//       } catch (error) {
//         console.error("Error fetching weather:", error);
//       }
//     }, 1111);
//   }
// };