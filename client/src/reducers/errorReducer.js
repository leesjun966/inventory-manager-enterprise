import { GET_ERRORS } from "../actions/constants";

const INITIAL_STATE = {};

/**
 * To update the state of error information when the user trying to log in
 */
export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_ERRORS:
      return action.payload.error;
    default:
      return state;
  }
}
