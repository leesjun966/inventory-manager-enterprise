# Backend Server

## Installation
* Install the node modules: __npm install__

## Starting Up
* Start the server: __npm start__
* Start with nodemon for development: __npm test__

## Directory Structure
The backend directory is formatted as below
````bash
.
├── index.js
├── models
│   ├── inventory_model.js
│   ├── warehouse_model.js
│   ├── production_model.js
│   ├── user_model.js
│   ├── supplier_model.js
│   ├── requests_model.js
│   └── log_model.js
├── controllers
│   ├── admin_controller.js
│   ├── auth_controller.js
│   ├── crud_controller.js
│   ├── requests_controller.js
│   ├── crud_functions.js
│   ├── request_functions.js
│   └── log_functions.js
├── routes
│   ├── admin_route.js
│   ├── auth_route.js
│   ├── crud_route.js
│   └── request_route.js
└── utils
    ├── authentication.js
    ├── database.js
    ├── error_response.js
    └── utilities.js
````

* index:        This is the server entry point
* models:       This directory is used for structure of each table in database and their association.
* controllers:  This directory is used for functions that handle API Request, and Response.
    * admin_controller:         Handles (User) related API
    * auth_controller:          Handle authentication and token API
    * crud_controller:          Handle Inventory CRUD API
    * requests_controller:      Handle CRUD requests
    * crud_functions:           Contain CRUD functions that are used by crud_controller
    * request_functions:        Contain operations for requests
    * log_functions:            Contain functions for logging and tracking
* routes:       This directory is used for routing scrips for API calls.
* utils:        This directory contain auxilary utility functions.
    * authentication:           Contains auxilaly functions for authentication
    * database:                 Connection to database
    * error_response:           Used by API to send respond based on error type
    * utilities:                More auxilary functions
* Each files within respective directories contain more detailed documentation on their specific role and functions.

## Database
* Mysql
* Model and query using Sequelize package
* Documentation: https://sequelize.org/master/class/lib/model.js~Model.html
* Connection details:
    * Host: 167.99.69.157
    * Port: 3306
    * User: kj / eric
    * Password: lol12345
* Auto sync turned on at index.js
* Edit (force : false) to (force : true) to resent database
* Manually reconfigure auto increment starting value in sql workbench, under options
    * UserList: Set auto increment begin with 1001
    * Supplier: Set auto increment being with 2001

## QR Code Elements
Current composition of QR Code:-
* 8 char Material ID, begin with "A0000001"

## API Routes
* The parameter section shows what __KEY__ to use in the __Strinigfy JSON request__.
* The parameter section show what __KEY__ is being sent back in the __Strinigfy JSON respond__.

### Authentication
* http://167.99.69.157:8000/authenticate   
    * Authentication for web frontend
    * Parameters:-
        * username  (String)
        * password  (String)   
    * Return
        * {token: tokenString, admin_level: <1-10 level>}
        * {error: "Incorrect Username or Password"}  [If Fail]
* http://167.99.69.157:8000/authenticate/app  
    * QR authentication for APP
    * Parameters:-
        * qrcode    (String) 
    * Return   
        * token
        * username
        * fullname
        * admin_level
        * id
        * {error: "User Does Not Exist"} [If Fail]
* http://167.99.69.157:8000/authenticate/changePassword
    * Authentication for web frontend
    * Parameters:-
        * username  (String)
        * old_pw    (String)   
        * new_pw    (String)   
    * Return
        * { Status: "Success" }
        * { Status: "Incorrect Password" }  [If wrong old_pw]
        * { Status: ErrorMessage }            [If Fail]

### CRUD operations
* http://167.99.69.157:8000/crud/getInventory
    * Get a main Inventory table
    * Parameter: N/A
    * Return
        * keys
        * labels
        * results
        * {Status: ErrorMessage}    [If Fail]
* http://167.99.69.157:8000/crud/getTable 
    * Get a table from inventory DB
    * Parameter:-
        * table (String)    "Production", "Warehouse", "Supplier
    * Return
        * keys
        * labels
        * results
        * {Status: ErrorMessage}    [If Fail]
* http://167.99.69.157:8000/crud/getSpecific  
    * Get a table with specific material from Warehouse, Production, or InventoryList
    * Parameter:-
        * table     (String)    "InventoryList", "Production", "Warehouse"
        * mat_id    (String)    Starts with "A0000001"   
    * Return
        * keys
        * labels
        * results
        * {Status: ErrorMessage}    [If Fail]
* http://167.99.69.157:8000/crud/getMaterialQR
    * Generate material QR code 
    * Parameter:-
        * mat_id        (String)
    * Return
        * qrcode        (Data URL)
        * {Status: ErrorMessage}    [If Fail]
* http://167.99.69.157:8000/crud/createCategory   
    * Insert a new material into DB
    * Parameter:- 
        * description   (String)
    * Return
        * {Status: "Success"}       [If Success]
        * {Status: ErrorMessage}    [If Fail]
* http://167.99.69.157:8000/crud/editItem
    * Edit item detail
    * Parameters: The keys from "getSpecific" JSON
    * Return
        * {Status: "Success"}       [If Success]
        * {Status: ErrorMessage}    [If Fail]
* http://167.99.69.157:8000/crud/insertItem    
    * Insert new bacth of material into DB
    * Parameter:-
        * qrcode        (QR Code)
        * quantity      (Int)
        * employee_id   (Int)   Starts with 1111
        * supplier_id   (Int)   Starts with 2111
    * Return
        * {Status: "Success"}       [If Success]
        * {Status: ErrorMessage}    [If Fail]
* http://167.99.69.157:8000/crud/toProduction  
    * Move item from warehouse to production
    * Parameter:-
        * qrcode        (QR Code)
        * quantity      (Int)
        * employee_id   (Int)   Starts with 1111
    * Return
        * {Status: "Success"}       [If Success]
        * {Status: ErrorMessage}    [If Fail]    
* http://167.99.69.157:8000/crud/toWarehouse
* Move item from production to warehosuse
    * Parameter:-
        * qrcode        (QR Code)
        * quantity      (Int)
        * employee_id   (Int)   Starts with 1111
    * Return
        * {Status: "Success"}       [If Success]
        * {Status: ErrorMessage}    [If Fail]

### User operation (For Admin only)
* http://167.99.69.157:8000/admin/getUsers
    * Get a list of all employees
    * Parameter: N/A 
    * Return
        * keys
        * labels
        * results
* http://167.99.69.157:8000/admin/getUser
    * Get details of a single employee
    * Parameter: usr_id     (Int)
    * Return
        * keys
        * labels
        * results
* http://167.99.69.157:8000/admin/addUser
    * Add a new employee to the system
    * Parameters:-
        * username      (String)
        * fam_name      (String)
        * giv_name      (String)
        * position      (String)
        * admin_level   (String)    1 to 10
        * password      (String) 
        * emp_no        (String)
    * Return
        * {Status: "New User Added"} [If Success]
        * {Status: ErrorMessage}     [If Fail]
* http://167.99.69.157:8000/admin/editUser
    * Edit employee detail
    * Parameters:-
        * usr_id        (Int)
        * fam_name      (String)
        * giv_name      (String)
        * position      (String)
        * admin_level   (String)    1 to 10
    * Return
        * {Status: "Success"}       [If Success]
        * {Status: ErrorMessage}    [If Fail]
* http://167.99.69.157:8000/admin/removeUser
    * Remove a new employee to the system
    * Parameters:-
        * usr_id        (Int)       
    * Return
        * {Status: "User deleted"}           [If Success]
        * {Status: "User does not exist!"}   [If Fail]  
* http://167.99.69.157:8000/admin/generateQR
    * Generate employee QR code 
    * Parameter:-
        * usr_id        (Int)
    * Return
        * qrcode        (Data URL)
        * {Status: "User does not exist}     [If User Does Not Exist]
        * {Status: ErrorMessage}             [If Fail]
* http://167.99.69.157:8000/admin/resetQR
    * Generate employee QR code 
    * Parameter:-
        * usr_id        (Int)
    * Return
        * {Status: "Success"}         [If Success]
        * {Status: ErrorMessage}      [If Fail]

### Request operations
* http://167.99.69.157:8000/request/getRequests
    * Get a list of all requests
    * Parameter: N/A 
    * Return
        * keys
        * labels
        * results
* http://167.99.69.157:8000/request/getPending
    * Get a list of all pending requests
    * Parameter: N/A 
    * Return
        * keys
        * labels
        * results
* http://167.99.69.157:8000/request/createRequest
    * Add a crud request
    * Parameter:-
        * action        (String)        "insertItem", "toProduction", "toWarehouse", "toExternal"
        * qrcode        (QR Code)
        * quantity      (Int)
        * employee_id   (Int)   Starts with 1111    (optional)
        * supplier_id   (Int)   Starts with 2111    (optional)
    * Return
        * {Status: "Success"}         [If Success]
        * {Status: ErrorMessage}      [If Fail]
* http://167.99.69.157:8000/request/updateStatus
    * Approve or rejact request
    * Parameter:-
        * req_id        (Int)       
        * status        (String)    "Approved", "Rejected", "Pending"
    * Return
        * {Status: "Success"}         [If Success]
        * {Status: ErrorMessage}      [If Fail]
* http://167.99.69.157:8000/request/executeReuqests
    * Execute all approved request
    * Parameter: N/A 
    * Return
        * The execution status of all request
