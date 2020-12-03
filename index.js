const express = require("express");
const app = express();

require("./startup/db")();
require("./startup/validation")();
require("./startup/routes")(app);

const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.log(`Listening to port ${port}...`));

module.exports = server;
