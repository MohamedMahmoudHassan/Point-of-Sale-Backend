const config = require("config");

module.exports = type => {
  const dbParams = config.get("db");
  const { urlPrefix, password, url } = dbParams[type];
  const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  };

  return { dbUrl: urlPrefix + password + url, dbOptions };
};
