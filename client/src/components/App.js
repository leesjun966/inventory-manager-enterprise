import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "../utils/setAuthToken";

import { setCurrentUser, signOut } from "../actions";
import { Provider } from "react-redux";
import store from "../store";

import LoginForm from "./auth/LoginForm";
import PrivateRoute from "./Route/PrivateRoute";
import Homepage from "./layout/HomePage";
import EmployeeCreate from "./layout/employee/EmployeeCreate";
import EmployeeEdit from "./layout/employee/EmployeeEdit";
import ItemSelect from "./layout/inventory/ItemSelect";

import InventoryLogs from "./layout/inventory/InventoryLogs";
import history from "./Route/History";
import InventoryEdit from "./layout/inventory/InventoryEdit";
import ProductionEdit from "./layout/inventory/ProductionEdit";
import WarehouseEdit from "./layout/inventory/WarehouseEdit";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Signout user
    store.dispatch(signOut());
    // Redirect to login
    window.location.href = "./";
  }
}

/**
 * To handle all the different routes that the components are rendered
 */
class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <Route exact path="/" component={LoginForm} />

            <PrivateRoute exact path="/dashboard" component={Homepage} />

            <PrivateRoute
              exact
              path="/dashboard/Log"
              component={InventoryLogs}
            />
            <PrivateRoute
              exact
              path="/dashboard/edit/Inventory/:id"
              component={InventoryEdit}
            />
            <PrivateRoute
              exact
              path="/dashboard/edit/Employee/:id"
              component={EmployeeEdit}
            />
            <PrivateRoute
              exact
              path="/dashboard/edit/Production/:id"
              component={ProductionEdit}
            />
            <PrivateRoute
              exact
              path="/dashboard/edit/Warehouse/:id"
              component={WarehouseEdit}
            />

            <PrivateRoute
              exact
              path="/dashboard/employee/new"
              component={EmployeeCreate}
            />

            <PrivateRoute
              exact
              path="/dashboard/:term/:id"
              component={ItemSelect}
            />

            <PrivateRoute path="*" component={() => "404 NOT FOUND"} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
