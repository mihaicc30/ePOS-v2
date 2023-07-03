import {
	GoogleAuthProvider,
	getAuth,
	signInWithPopup,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	signOut,
	FacebookAuthProvider,
} from "firebase/auth";
import {
	getFirestore,
	collection,
	query,
	where,
	getDocs,
	addDoc,
	doc,
	updateDoc,
} from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: import.meta.env.VITE_API_KEY,
	authDomain: import.meta.env.VITE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_APP_ID,
	measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);


const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();


const signInWithFacebook = async () => {
	const res = await signInWithPopup(auth, facebookProvider);
	const user = res.user;

	console.log(user);
	const q = await getDocs(
		query(collection(db, "users"), where("uid", "==", user.uid)),
	);
	try {
		const credential = FacebookAuthProvider.credentialFromResult(res);
		const accessToken = credential.accessToken;
		// fetch facebook graph api to get user actual profile picture
		const response = await fetch(
			`https://graph.facebook.com/${res.user.providerData[0].uid}/picture?type=large&access_token=${accessToken}`,
		);
		const blob = await response.blob();
		user.photoURL = URL.createObjectURL(blob);

		if (q.docs.length < 1) {
			// Add user to Firestore if not already exists
			const newUserRef = await addDoc(collection(db, "users"), {
				uid: user.uid,
				name: user.displayName,
				email: user.email,
				photo: URL.createObjectURL(blob),
				rating: [],
				questionnaire: false,
				date: new Date(),
			});
			console.log(
				"User does not exists in Firestore. New user added with ID: ",
				newUserRef.id,
			);
		} else {
			console.log("User already exists in Firestore. No updates needed.");
		}
	} catch (error) {
		console.error(error);
		console.log(error.message);
	}
};

const signInWithGoogle = async () => {
	try {
		const res = await signInWithPopup(auth, googleProvider);
		const user = res.user;

		// Check if user exists in Firestore
		// const q = query(collection(db, "users"), where("uid", "==", user.uid));
		// const docs = await getDocs(q);
		// if (docs.docs.length < 1) {
		// 	// Add user to Firestore if not already exists
		// 	const newUserRef = await addDoc(collection(db, "users"), {
		// 		uid: user.uid,
		// 		name: user.displayName,
		// 		email: user.email,
		// 		photo: user.photoURL,
		// 		rating: [],
		// 		questionnaire: false,
		// 		date: new Date(),
		// 	});
		// 	console.log(
		// 		"User does not exists in Firestore. New user added with ID: ",
		// 		newUserRef.id,
		// 	);
		// } else {
		// 	console.log("User already exists in Firestore. No updates needed.");
		// }
		console.log("Popup is successfull. Proceeding...");
	} catch (error) {
		if (error == "FirebaseError: Firebase: Error (auth/popup-closed-by-user).")
			console.log("User closed login popup.");
	}
};

const logInWithEmailAndPassword = async (email, password) => {
	await signInWithEmailAndPassword(auth, email, password);
};

const registerWithEmailAndPassword = async (name, email, password) => {
	try {
		const q = query(collection(db, "users"), where("email", "==", email));
		const docs = await getDocs(q);

		if (docs.docs.length < 1) {
			const res = await createUserWithEmailAndPassword(auth, email, password);
			const user = res.user;
			return "Success";
		} else {
			// console.log("User already exists in Firestore");
			return "User already exists in Firestore";
		}
	} catch (err) {
		console.error(err);
		return err.message;
	}
};

const sendPasswordReset = async (email) => {
	try {
		await sendPasswordResetEmail(auth, email);
		alert("Password reset link sent!");
	} catch (err) {
		console.error(err);
		alert(err.message);
	}
};

const logout = () => {
	signOut(auth);
};


export {
	app,
	auth,
	db,
	signInWithPopup,
	signInWithGoogle,
	signInWithFacebook,
	logInWithEmailAndPassword,
	registerWithEmailAndPassword,
	sendPasswordReset,
	logout,
};
