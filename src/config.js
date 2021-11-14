import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

const firebaseConfig = firebase.initializeApp({
  apiKey: 'AIzaSyAKWQVaKER0akX8jX-Mvn6rpe1IVz4BWkk',
  authDomain: 'arduinostock.firebaseapp.com',
  projectId: 'arduinostock',
  storageBucket: 'arduinostock.appspot.com',
  messagingSenderId: '282421671901',
  appId: '1:282421671901:web:d4c1386f778b4055dfe834',
  measurementId: 'G-V2HEDJ4TH8',
})

export default firebaseConfig
