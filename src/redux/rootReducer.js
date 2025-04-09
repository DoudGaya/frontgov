// ** Reducers Imports
import layout from "./layout"
import navbar from "./navbar"
import storage from "redux-persist/lib/storage"
import { persistReducer } from "redux-persist"
import { combineReducers } from "redux"
import { GeneralDetailsReducer, LoginDetailsReducer } from "./reducerDetail"

const rootReducer = combineReducers({
    layout,
    navbar,
    LoginDetails: LoginDetailsReducer,
    GeneralDetails: GeneralDetailsReducer
})

const persistConfig = {
    key: "e-track-application",
    storage
}

export default persistReducer(persistConfig, rootReducer)

