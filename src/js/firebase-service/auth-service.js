import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCfFGZC07caKFCARPJmMU-qsuAW8jLIu3E',
  authDomain: 'project-fitness-07.firebaseapp.com',
  projectId: 'project-fitness-07',
  storageBucket: 'project-fitness-07.appspot.com',
  messagingSenderId: '607206642972',
  appId: '1:607206642972:web:ea1d5c525a976b668cd6d9',
};

export const db = firebase.initializeApp(firebaseConfig);

export async function createUser({ email, password, name }) {
  await db.auth().createUserWithEmailAndPassword(email, password);
  const user = await db.auth().currentUser;
  await user.updateProfile({
    displayName: name,
  });
}

export async function signIn({ email, password }) {
  try {
    await db.auth().signInWithEmailAndPassword(email, password);
  } catch (error) {
    console.log(error.message);
  }
}

export async function signOut() {
  await db.auth().signOut();
}
