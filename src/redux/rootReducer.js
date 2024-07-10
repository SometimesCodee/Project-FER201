import { combineReducers } from 'redux'
import AdminReducer from './AdminReducer'

const rootReducer = combineReducers({
    admin : AdminReducer,
})

export default rootReducer