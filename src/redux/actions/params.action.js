export const PARAMS_SET = 'PARAMS_SET'
export const PARAMS_CLEAR = 'PARAMS_CLEAR'

export const setParams = (paramName, payload) => ({
  type: PARAMS_SET,
  paramName,
  payload,
})

export const clearParams = (paramName) => ({
  type: PARAMS_CLEAR,
  paramName,
})
