const mongoose = require("mongoose");
const config = require("config");

module.exports = () => {
  const { urlPrefix, url, password } = config.get("db");
  const db = urlPrefix + password + url;
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    .then(() => console.log(`Connected to database...`));
};
