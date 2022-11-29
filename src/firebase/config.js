// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyBYHMMgzTe-MtqBA3YOTXcfRyv1rTHrMlk',
    authDomain: 'chat-app-3b95a.firebaseapp.com',
    projectId: 'chat-app-3b95a',
    storageBucket: 'chat-app-3b95a.appspot.com',
    messagingSenderId: '981472905609',
    appId: '1:981472905609:web:036aac843e738cfe60b958',
    measurementId: 'G-W8W7D9N8QV',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);
