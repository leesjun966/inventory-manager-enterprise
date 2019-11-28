const http = require("http");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

// initiate express
const express = require("express");
const app = express();

// enable cors
app.use(cors());

// import databases
const db = require("./utils/database");

// import models and association
const models = require("require-all")(__dirname + "/models");

// import routes
const authRoute = require("./routes/auth_route");
const crudRoute = require("./routes/crud_route");
const adminRoute = require("./routes/admin_route");
const reqRoute = require("./routes/request_route");

// utilities
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// use routes
app.use("/authenticate", authRoute);
app.use("/crud", crudRoute);
app.use("/admin", adminRoute);
app.use("/request", reqRoute);

// sync databases
// if force: true, reset whole database and delete all data
// please becareful not to wipe all data
db.sync({ logging: false, force: false }).catch(err => console.log(err));

// initiate server
const server = http.createServer(app);
server.listen(8000);

const crud = require("./controllers/crud_functions");
const Sequelize = require("Sequelize");
