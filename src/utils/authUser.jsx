export const authUser = (foundPin) => {
    localStorage.setItem("displayName", foundPin.displayName);
    localStorage.setItem("email", foundPin.email);
    localStorage.setItem("venueID", foundPin.venueID);
    localStorage.setItem("lefty", foundPin.lefty);
    localStorage.setItem("darkMode", foundPin.darkMode);
    localStorage.setItem("autoStore", foundPin.autoStore);
    localStorage.setItem("isAdmin", foundPin.isAdmin);
};

export const getUser = (setUser) => {
    if(localStorage.getItem('email')) {
        setUser({ email:localStorage.getItem('email'), displayName:localStorage.getItem('displayName') });
        return
    } else {
        return false
    }
}
export const setVenue = (setVenueNtable, foundPin) => {
    setVenueNtable((prevValues) => ({ ...prevValues, venue: foundPin.venueID }));
};
export const getVenue = (setVenueNtable) => {
    setVenueNtable((prevValues) => ({ ...prevValues, venue: parseInt(localStorage.getItem('venueID')) }));
};