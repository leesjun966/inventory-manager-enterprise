# inventory-manager-enterprise

## Installation

- Install the node modules: **npm install**

## Starting Up

- Start the server: **npm start**

## Login

username: jaydenlee
password: baby1234

## Directory Structure

The client directory is formatted as below

```bash
.
├── actions
  ├── constants.js
  └── index.js
├── apis
  └── rootURL.js
├── components
  ├── auth
    └── LoginForm.js
  ├── layout
    ├── employee
      ├── EmployeeCreate.js
      ├── EmployeeDelete.js
      ├── EmployeeEdit.js
      └── EmployeeForm.js
    ├── inventory
      ├── InventoryEdit.js
      ├── InventoryForm.js
      ├── InventoryLogs.js
      ├── InventoryNav.js
      ├── InventoryNavigation.js
      ├── ItemSelect.js
      ├── ProductionEdit.js
      ├── RenderTable.js
      └── WarehouseEdit.js
    ├── Footer.js
    ├── HeaderMenu.js
    ├── HomePage.js
    └── Spinner.js
  ├── Route
    ├── History.js
    └── PrivateRoute.js
  ├── App.js
  └── Modal.js
├── reducers
  ├── authReducer.js
  ├── datasReducer.js
  ├── errorReducer.js
  ├── index.js
  ├── labelsReducer.js
  └── qrReducer.js
├── utils
  └── setAuthToken.js
├── index.js
└── store.js

```

- actions: This directory is use for functions that handle all the action creators.
- apis: This directory is use for storing the root URL for calling apis.
- components: This directory is use for rendering pages that interact with user actions.
  - auth: Input user data to gain token.
  - layout: This directory is use for rendering pages that interact with user actions.
    - employee: This directory is use for rendering all the employee related pages
    - inventory: This directory is use for retrieving inventory datas from the backend and display as a table
  - Route: This directory is use for setting the private route for logged in user to access.
  - App.js: This is the place for routing pages.
- reducers: This directory is used for dispatching the actions and return the state.
- index.js: This is the client entry point.
- store.js: This is a redux middleware to communicate between action dispatch and reducer
- Each files within respective directories contain more detailed documentation on their specific role and functions.
