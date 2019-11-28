import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING,
  CREATE_EMPLOYEE,
  FETCH_LABELS,
  EDIT_DATA,
  FETCH_DATA,
  FETCH_DATAS,
  DELETE_USER,
  QR_DOWNLOAD
} from "./constants";
import jwt_decode from "jwt-decode";
import FileSaver from "file-saver";
import setAuthToken from "../utils/setAuthToken";
import rootURL from "../apis/rootURL";
import history from "../components/Route/History";

/**
 * Sign In action to send userData to backend server and request a token
 * @param {Object} userData {username, password}
 */
export const signIn = userData => dispatch => {
  rootURL
    .post("/authenticate", { userData })
    .then(res => {
      // Save to localStorage
      const token = res.data;
      // Set token to localStorage
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

/**
 * Store the information of the current user
 * @param {Object} decoded {retrieve all the values that has decoded from the token}
 */
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

/**
 * Sign out action, release the token and reset all the states
 */
export const signOut = () => dispatch => {
  const reset = { error: null };
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
  dispatch({
    type: GET_ERRORS,
    payload: reset
  });
};

/**
 * Adding an employee into the database
 * @param {Object} formValues {all the keys that needed to create an employee}
 * @param {Number} index to push the page to the employee table once the action has been done
 */
export const createEmployee = (formValues, index) => async dispatch => {
  const response = await rootURL.post("/admin/addUser", formValues);
  dispatch({ type: CREATE_EMPLOYEE, payload: response.data });
  history.push("/dashboard", index);
};

/**
 * To fetch the labels for rendering the title of the respective table
 * @param {String} term the value of which table to fetch
 * @param {String} baseURL the respective url to fetch from
 */
export const fetchLabels = (term, baseURL) => async dispatch => {
  const response = await rootURL.post(`${baseURL}`, term);

  dispatch({ type: FETCH_LABELS, payload: response.data.labels });
};

/**
 * To fetch a single data
 * @param {String} term the value of which table to fetch
 * @param {String} baseURL the respective url to fetch from
 */
export const fetchData = (term, baseURL) => async dispatch => {
  const response = await rootURL.post(`${baseURL}`, term);

  dispatch({ type: FETCH_DATA, payload: response.data.results });
};

/**
 * To fetch the datas for rendering the child(row) of the table
 * @param {String} term the value of which table to fetch
 * @param {String} baseURL the respective url to fetch from
 */
export const fetchDatas = (term, baseURL) => async dispatch => {
  const response = await rootURL.post(`${baseURL}`, term);

  dispatch({ type: FETCH_DATAS, payload: response.data.results });
};

/**
 * To edit the data either from employee or inventory
 * @param {String} value the value of which table to edit
 * @param {String} baseURL the url for editing the data
 * @param {Number} index to push the page to the respective table once the action has been done
 */
export const editData = (value, baseURL, index) => async dispatch => {
  const response = await rootURL.post(baseURL, value);
  dispatch({ type: EDIT_DATA, payload: response.data });
  history.push("/dashboard", index);
};

/**
 * To delete an employee/user from the database
 * @param {Number} id the id of the selected user
 * @param {Number} index to push the page to the respective table once the action has been done
 */
export const removeUser = (id, index) => async dispatch => {
  await rootURL.post("/admin/removeUser", id);

  dispatch({ type: DELETE_USER, payload: id });
  history.push("/dashboard", index);
};

/**
 * To download the QR image of a selected item/user
 * @param {String} baseURL the url to request for the qr
 * @param {Number} id the id of the selected item/user
 */
export const qrDownload = (baseURL, id) => async dispatch => {
  console.log(baseURL, id);
  const response = await rootURL.post(baseURL, id);

  dispatch({ type: QR_DOWNLOAD, payload: response.data.qrcode });
  FileSaver.saveAs(response.data.qrcode, "image.jpg");
};
