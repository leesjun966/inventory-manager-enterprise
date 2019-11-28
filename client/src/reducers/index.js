import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import dataReducer from "./datasReducer";
import qrReducer from "./qrReducer";
import labelReducer from "./labelsReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  datas: dataReducer,
  form: formReducer,
  qr: qrReducer,
  labels: labelReducer
});
