const config = require("config");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, `./static/${req.body.path || ""}`),
  filename: (req, file, cb) => cb(null, `${Date.now()}.jpg`)
});

const upload = multer({ storage }).single("image");

const createImage = ({ body, file }) => {
  if (!file) return { status: 400, error: "No image uploaded." };

  return { data: { imageUrl: `${config.get("apiHost")}/api/static/${file.filename}` } };
};

exports.upload = upload;
exports.createImage = createImage;
