import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import userReducer from './reducers/user.reducer'
import paramsReducer from './reducers/params.reducer'

const reducers = combineReducers({
  user: userReducer,
  params: paramsReducer,
})

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk)),
)

export default store
