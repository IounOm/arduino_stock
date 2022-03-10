import {
  SET_LOADING,
  SAVE_PROJECT,
  CREATE_ID,
  SET_USER_DATA,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
} from '../actions/user.action'

const initialState = {
  isLogin: false,
  loading: true,
  userName: '',
  userEmail: '',
  userPassword: '',
  userImage: '',
  userNote: '',
  userContact: {
    website: '',
    facebook: '',
    twitter: '',
    git: '',
  },
  userId: '',
  userType: '',
  errorMessage: [],
  save: false,
  docId: '',
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOADING: {
      return {
        ...state,
        loading: true,
      }
    }
    case SAVE_PROJECT: {
      return {
        ...state,
        save: action.payload.save,
      }
    }
    case CREATE_ID: {
      return {
        ...state,
        docId: action.payload.save,
      }
    }
    case SET_USER_DATA: {
      return {
        ...state,
        userName: action.payload.name,
        userEmail: action.payload.email,
        userPassword: action.payload.password,
        userImage: action.payload.image,
        userNote: action.payload.note,
        userContact: action.payload.contact,
        userType: action.payload.type,
      }
    }
    case LOGIN_SUCCESS: {
      return {
        ...state,
        isLogin: true,
        loading: false,
        userId: action.payload.userId,
      }
    }
    case LOGIN_FAIL: {
      return {
        ...state,
        isLogin: false,
        loading: false,
        errorMessage: [...state.errorMessage, action.payload.errorMessage],
        userId: null,
      }
    }
    default: {
      return state
    }
  }
}

export default reducer
