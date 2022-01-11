import {
  PARAMS_SET,
  PARAMS_CLEAR,
} from '../actions/params.action'

const paramsReducer = (state = {}, action) => {
  switch (action.type) {
    case PARAMS_SET:
      return {
        ...state,
        [action.paramName]: action.payload,
      }
    case PARAMS_CLEAR:
      // eslint-disable-next-line no-case-declarations
      const newState = { ...state }
      delete newState[action.paramName]
      return newState
    default:
      return state
  }
}

export default paramsReducer
