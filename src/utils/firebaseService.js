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

function updateComplete(dbRef, id){
    let ref =  database.ref(`${dbRef}/${id}`);
    ref.once("value", snapshot => {
        let todo = snapshot.val();
        ref.update({
            completed: !todo.completed, 
            order: todo.order *= -1
            // because by default, firebase sorts by ASCENDING order; 
            // and since order is initialized as -1, by multiplying by
            // -1 here, we shoot that bad boy straight to the top of the list
            // (by making it the least value); something to note, though, is 
            // if ALL the checkboxes are marked, then the order key doesn't seem
            // to matter, and the TODOs are arranged by the order in which they were added
        });
    });
}

export {
    login,
    logout,
    auth,
    createTodo,
    removeTodo,
    updateComplete,
    database
}