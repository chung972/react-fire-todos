import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";


firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: "",
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
});

// APIs and config variables
const provider = new firebase.auth.GoogleAuthProvider();
const database = firebase.database();
const auth = firebase.auth();

// functions
function login(){
    return auth.signInWithPopup(provider);
}

function logout(){
    return auth.signOut();
}

function createTodo(ref, todo) {
    return database.ref(ref).push(todo);
}

function removeTodo (ref, id){
    return database.ref(`${ref}/${id}`).remove();
}

export {
    login,
    logout,
    auth,
    createTodo,
    removeTodo,
    database
}