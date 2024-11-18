// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app"

import { getStorage } from "firebase/storage"

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  // apiKey: "AIzaSyBnWpcYv57m1_mMPEWPi5PrwyFknkhHcp8",

  // authDomain: "politicaobrera-187ea.firebaseapp.com",

  // databaseURL: "https://politicaobrera-187ea.firebaseio.com",

  // projectId: "politicaobrera-187ea",

  // storageBucket: "politicaobrera-187ea.appspot.com",

  // messagingSenderId: "471408022688",

  // appId: "1:471408022688:web:320271cd1c4549b10065c5",

  // measurementId: "G-VR20HEKMVJ"


  apiKey: "AIzaSyAdTKoSly9t7H9JwxRz4Hj-3azQEBfExBw",

  authDomain: "politicaobrera-187ea.firebaseapp.com",

  databaseURL: "https://politicaobrera-187ea.firebaseio.com",

  projectId: "politicaobrera-187ea",

  storageBucket: "politicaobrera-187ea.appspot.com",

  messagingSenderId: "471408022688",

  appId: "1:471408022688:web:e1e98ad6f395da8f0065c5",

  measurementId: "G-3EK5J6C0R0"


};

// Initialize Firebase

const app = initializeApp(firebaseConfig)

const storage = getStorage(app)

export default storage