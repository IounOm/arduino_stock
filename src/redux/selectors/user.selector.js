import _get from 'lodash/get'

export const getUser = (state) => state.user

export const getIsAuth = (state) => !!getUser(state).authToken
