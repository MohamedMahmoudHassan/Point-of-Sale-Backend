const mongoose = require("mongoose");
const getDbParams = require("../Utils/getDbParams");

module.exports = () => {
  const dbType = process.env.dbType || "deployed";
  const { dbUrl, dbOptions } = getDbParams(dbType);
  mongoose.connect(dbUrl, dbOptions).then(() => console.log(`Connected to ${dbType} database...`));
};
