import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';


let firebaseConfig = {
    apiKey: "AIzaSyD51BSkBkgKvaWXgTKXS2XvPZ-D4z620mg",
    authDomain: "sistema-de-chamadas.firebaseapp.com",
    projectId: "sistema-de-chamadas",
    storageBucket: "sistema-de-chamadas.appspot.com",
    messagingSenderId: "1048618671400",
    appId: "1:1048618671400:web:c7e483e60426b99b34841d",
    measurementId: "G-RR66VTVTY3"
  };

  if(!firebase.app.lenght){
    firebase.initializeApp(firebaseConfig);
  }

  export default firebase;
