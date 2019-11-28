import _ from "lodash";
import {
  FETCH_DATAS,
  FETCH_DATA,
  DELETE_USER,
  EDIT_DATA,
  CREATE_EMPLOYEE
} from "../actions/constants";

/**
 * To update the state of datas information
 */
export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_DATAS:
      return {
        ..._.mapKeys(action.payload, "ID")
      };
    case FETCH_DATA:
      return { [action.payload.ID]: action.payload };
    case CREATE_EMPLOYEE:
      return { ...state, [action.payload.id]: action.payload };
    case EDIT_DATA:
      return { ...state, [action.payload.id]: action.payload };
    case DELETE_USER:
      return _.omit(state, action.payload);

    default:
      return state;
  }
};
