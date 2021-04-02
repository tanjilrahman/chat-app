import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyCk7OhYwgUhqs5EkKnSh9qlqC_ahd392GI",
    authDomain: "chat-app-579c7.firebaseapp.com",
    projectId: "chat-app-579c7",
    storageBucket: "chat-app-579c7.appspot.com",
    messagingSenderId: "1075395027452",
    appId: "1:1075395027452:web:ad010c93a50cb5fea99279"
  };

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
