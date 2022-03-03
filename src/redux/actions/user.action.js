import _isEmpty from 'lodash/isEmpty'
import _get from 'lodash/get'

import firebase from '../../config'

export const SET_LOADING = 'SET_LOADING'
export const SET_USER_DATA = 'SET_USER_DATA'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAIL = 'LOGIN_FAIL'

export function setLoading() {
  return {
    type: SET_LOADING,
  }
}

export function updateUserData(name, email, password, image, note, contact, type) {
  return {
    type: SET_USER_DATA,
    payload: {
      name,
      email,
      password,
      image,
      note,
      contact,
      type,
    },
  }
}

export function loginSuccess(userId) {
  return {
    type: LOGIN_SUCCESS,
    payload: {
      userId,
    },
  }
}

export function loginFail(errorMessage) {
  return {
    type: LOGIN_FAIL,
    payload: {
      errorMessage,
    },
  }
}

export function logout() {
  return async (dispatch) => {
    await firebase.auth().signOut()
    dispatch(loginFail())
  }
}

export function initAuthListener() {
  return async (dispatch) => {
    try {
      dispatch(setLoading())
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          try {
            // const token = await firebase.auth().currentUser.getIdToken(true)
            let firestoreUser = {}
            await firebase.firestore().collection('users').doc(_get(user, 'uid')).get()
              .then((snapshot) => {
                firestoreUser = snapshot.data()
              })
              .catch((e) => console.log(e))
            if (!_isEmpty(firestoreUser)) {
              dispatch(loginSuccess(_get(user, 'uid')))
              dispatch(updateUserData(_get(firestoreUser, 'name') || '', _get(firestoreUser, 'email') || '', _get(firestoreUser, 'password') || '', _get(firestoreUser, 'image') || '', _get(firestoreUser, 'note') || '', _get(firestoreUser, 'contact') || [], _get(firestoreUser, 'type') || ''))
            } else {
              dispatch(loginFail('Not found user login fail'))
            }
          } catch (error) {
            // error
            console.log(error)
          }
        } else {
          dispatch(loginFail('Not found user login fail'))
        }
      })
    } catch (error) {
      console.log(error.message, 'error from checkStillLogin')
    }
  }
}
