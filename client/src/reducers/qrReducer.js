import { QR_DOWNLOAD } from "../actions/constants";

/**
 * To update the state of qr information of the selected item/user
 */
export default function(state = {}, action) {
  switch (action.type) {
    case QR_DOWNLOAD:
      return action.payload;
    default:
      return state;
  }
}
