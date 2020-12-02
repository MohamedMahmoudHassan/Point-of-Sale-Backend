const mongoose = require("mongoose");
const getDbParams = require("../Utils/getDbParams");

module.exports = () => {
  const { dbUrl, dbOptions } = getDbParams("deployed");
  mongoose.connect(dbUrl, dbOptions).then(() => console.log(`Connected to deployed database...`));
};
