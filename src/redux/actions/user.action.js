import axios from 'axios'
import _isEmpty from 'lodash/isEmpty'
import _get from 'lodash/get'

import firebase from '../../libs/firebase'

export const CLEAR_AUTH = 'CLEAR_AUTH'
export const CHECK_LOGIN = 'CHECK_LOGIN'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAIL = 'LOGIN_FAIL'
export const SET_LOADING = 'SET_LOADING'
export const SET_SNACK_BAR = 'SET_SNACK_BAR'
export const SET_NAVBAR_HEADER = 'SET_NAVBAR_HEADER'
export const SET_FORGOT_LOADING = 'SET_FORGOT_LOADING'
export const SET_USER_DATA = 'SET_USER_DATA'
export const TOGGLE_NOTI = 'TOGGLE_NOTI'

export function clearAuth() {
  return {
    type: CLEAR_AUTH,
  }
}

export function toggleQueryNoti(toggleNoti) {
  return {
    type: TOGGLE_NOTI,
    payload: {
      toggleNoti,
    },
  }
}

export function loginSuccess(userData, userId, userToken) {
  return {
    type: LOGIN_SUCCESS,
    payload: {
      userData,
      userId,
      userToken,
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

export function setLoading() {
  return {
    type: SET_LOADING,
  }
}

export function setSnackBar(severity, open, message, time) {
  return {
    type: SET_SNACK_BAR,
    payload: {
      severity,
      open,
      message,
      time,
    },
  }
}

export function setNavbarHeader(text) {
  return {
    type: SET_NAVBAR_HEADER,
    payload: {
      text,
    },
  }
}

export function forgotLoading(status) {
  return {
    type: SET_FORGOT_LOADING,
    payload: {
      status,
    },
  }
}

export function updateLastLogin(token) {
  return async () => {
    try {
      await axios.get(`${process.env.REACT_APP_API_URL}/common/auth/update/lastlogin`,
        {
          headers: {
            'Content-Type': 'Application/json',
            Authorization: token,
          },
        })
    } catch (error) {
      console.log(error.response)
    }
  }
}

export function checkLogin(username, password) {
  return async (dispatch) => {
    try {
      const signIn = await firebase.auth().signInWithEmailAndPassword(username, password)
      const token = await firebase.auth().currentUser.getIdToken(true)
      const userFromFirestore = await firebase.firestore().collection('users').doc(signIn.user.uid).get()
      const firestoreUser = userFromFirestore.data()
      if (!_isEmpty(firestoreUser)
        && (firestoreUser.type === 'admin' || firestoreUser.type === 'superAdmin' || (firestoreUser.type === 'technician' && firestoreUser.role === 'head'))
        && !firestoreUser.isDisable
        && firestoreUser.status === 'active') {
        dispatch(updateLastLogin(token))
        dispatch(loginSuccess(signIn.user, signIn.user.uid, token))
      } else {
        await firebase.auth().signOut()
        dispatch(setSnackBar('error', true, 'doesn\'t have permission'))
      }
    } catch (error) {
      dispatch(loginFail(error.message))
      dispatch(setSnackBar('error', true, error.message))
    }
  }
}

export function updateUserData(name, image, permission, userType, technicianType, supplierId, headName) {
  return {
    type: SET_USER_DATA,
    payload: {
      name,
      image,
      permission,
      userType,
      technicianType,
      supplierId,
      headName,
    },
  }
}

export function initAuthListener() {
  return async (dispatch) => {
    try {
      dispatch(setLoading())
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          try {
            const token = await firebase.auth().currentUser.getIdToken(true)
            const header = { headers: { Authorization: token } }
            const userData = await axios.get(`${process.env.REACT_APP_API_URL}/common/auth/getFirestore/uid/${_get(user, 'uid')}`, header)
            const firestoreUser = _get(userData, 'data.user')
            const userPermission = _get(firestoreUser, 'groupId.groupData.features')
            // console.log(userPermission, 'userPermission')
            // console.log(firestoreUser, 'firestoreUser')
            if (!_isEmpty(firestoreUser)
              && ((firestoreUser.type === 'admin') || firestoreUser.type === 'superAdmin' || (firestoreUser.type === 'technician' && firestoreUser.role === 'head'))
              && !firestoreUser.isDisable
              && firestoreUser.status === 'active'
            ) {
              dispatch(loginSuccess(user, _get(user, 'uid'), token))
              dispatch(updateUserData(_get(firestoreUser, 'name') || '', _get(firestoreUser, 'image') || '', userPermission, firestoreUser.type, firestoreUser.technicianType, _get(firestoreUser.supplierId, '_path.segments[1]'), _get(firestoreUser, 'headName')))
            } else {
              dispatch(loginFail('Not found user login fail'))
            }
          } catch (error) {
            // error
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

export function sendEmailForgotPassword(email, type, userType = '', isShow = true) {
  return async (dispatch) => {
    try {
      dispatch(forgotLoading(true))
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/common/auth/resetPassword/${userType || 'admin'}/${email}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        })
      if (response.status === 200 && isShow) {
        if (type === 'invitation') {
          dispatch(setSnackBar('success', true, 'Send invitation to email success', 3000))
        } else {
          window.location = '/checkemail'
        }
      }
    } catch (error) {
      console.log(error.response)
      dispatch(setSnackBar('error', true, _get(error, 'response.data.message')))
    }
    setTimeout(() => {
      dispatch(forgotLoading(false))
    }, 1000)
  }
}

export function resetPassword(actionCode, newPassword, setLoad) {
  return async (dispatch) => {
    try {
      setLoad(true)
      await firebase.auth().confirmPasswordReset(actionCode, newPassword)
      dispatch(setSnackBar('success', true, 'Reset password success'))
      setTimeout(() => {
        window.location = '/'
      }, 2500)
    } catch (error) {
      console.log(error)
      dispatch(setSnackBar('error', true, _get(error, 'message')))
      setLoad(false)
    }
  }
}
