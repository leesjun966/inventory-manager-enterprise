import axios from "axios";

/**
 * To handle the rootURL in a single page
 */
export default axios.create({
  baseURL: "http://0.0.0.0:8000",
  headers: {
    crossDomain: true, //For cors errors
    "Content-Type": "application/x-www-form-urlencoded"
  }
});
