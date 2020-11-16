const mongoose = require("mongoose");
const config = require("config");

const mkDbURL = dbParams => {
  const { urlPrefix, password, url } = dbParams;
  return urlPrefix + password + url;
};

module.exports = () => {
  const { local, deployed } = config.get("db");

  const localDb = mkDbURL(local);
  const deployedDb = mkDbURL(deployed);
  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  };

  mongoose
    .connect(deployedDb, mongooseOptions)
    .then(() => console.log(`Connected to deployed database...`))
    .catch(() => {
      mongoose
        .connect(localDb, mongooseOptions)
        .then(() => console.log(`Connected to local database...`));
    });
};
