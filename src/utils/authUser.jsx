export const authUser = (foundPin) => {
    console.log("🚀 ~ file: authUser.jsx:2 ~ authUser ~ foundPin:", foundPin)
    localStorage.setItem("displayName", foundPin.displayName);
    localStorage.setItem("email", foundPin.email);
    localStorage.setItem("venueID", foundPin.venueID);
    localStorage.setItem("lefty", foundPin.lefty);
    localStorage.setItem("darkMode", foundPin.darkMode);
    localStorage.setItem("autoStore", foundPin.autoStore);
};

export const getUser = (setUser) => {
    setUser({ email:localStorage.getItem('email'), displayName:localStorage.getItem('displayName') });
}
export const setVenue = (setVenueNtable, foundPin) => {
    setVenueNtable((prevValues) => ({ ...prevValues, venue: foundPin.venueID }));
};
export const getVenue = (setVenueNtable) => {
    setVenueNtable((prevValues) => ({ ...prevValues, venue: parseInt(localStorage.getItem('venueID')) }));
};