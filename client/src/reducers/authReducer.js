import { SET_CURRENT_USER, USER_LOADING } from "../actions/constants";
import isEmpty from "is-empty";

/**
 * To update the state of user information from the token
 */
const INITIAL_STATE = {
  isAuthenticated: false,
  user: {},
  adminLevel: {},
  loading: false
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        adminLevel: action.payload.adm_level,
        user: action.payload.username
      };
    case USER_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
