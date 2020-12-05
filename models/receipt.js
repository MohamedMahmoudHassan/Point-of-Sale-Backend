const axios = require("axios");
const config = require("config");

const sendReceipt = async ({ body }) => {
  const emailAPI = config.get("emailAPI");

  const options = {
    method: "POST",
    url: emailAPI.url,
    headers: {
      "content-type": "application/json",
      "x-rapidapi-key": emailAPI.key,
      "x-rapidapi-host": emailAPI.host
    },
    data: {
      personalizations: [{ to: [{ email: body.receiver }], subject: body.emailSubject }],
      from: { email: emailAPI.sender },
      content: [{ type: "text/html", value: body.emailBody }]
    }
  };

  const response = await axios(options);
  return { data: response };
};

exports.sendReceipt = sendReceipt;
