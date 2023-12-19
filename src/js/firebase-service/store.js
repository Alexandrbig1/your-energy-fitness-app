//M. Startsev

import firebase from 'firebase/compat/app';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '.';

export const store = {
  fs: firebase.firestore(),
  getCurrentUserID: async function () {
    return new Promise((resolve, reject) => {
      db.auth().onAuthStateChanged(user => {
        if (user) {
          resolve(user.uid);
        } else {
          reject('User not authenticated');
        }
      });
    });
  },
  addData: async function (key, value) {
    const userID = await this.getCurrentUserID();

    this.fs
      .collection('users')
      .doc(userID)
      .set(
        {
          [key]: value,
        },
        { merge: true }
      )
      .then(() => {
        // console.log('Document successfully written!');
        return true;
      })
      .catch(error => {
        console.error('Error writing document: ', error);
        return false;
      });
  },

  removeData: async function (key) {
    const userID = await this.getCurrentUserID();

    this.fs
      .collection('users')
      .doc(userID)
      .update(
        {
          [key]: firebase.firestore.FieldValue.delete(),
        },
        { merge: true }
      )
      .then(() => {
        // console.log('Document successfully removed!');
        return true;
      })
      .catch(error => {
        console.error('Error writing document: ', error);
        return false;
      });
  },

  getData: async function () {
    const userID = await this.getCurrentUserID();

    const dataRef = doc(this.fs, 'users', userID);
    const dataSnapshot = await getDoc(dataRef);
    if (dataSnapshot.exists()) {
      return dataSnapshot.data();
    } else {
      console.error('No such document');
    }
  },
};
