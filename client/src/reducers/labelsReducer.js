import { FETCH_LABELS } from "../actions/constants";

/**
 * To update the state of label informations
 */
export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_LABELS:
      return action.payload;
    default:
      return state;
  }
};
