const fs = require("fs");
const path = require("path");
const config = require("config");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./static/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}.jpg`)
});

const upload = multer({ storage }).single("image");

const createImagePath = name => path.join(__dirname, "../static/", name);

const createImage = ({ file }) => {
  if (!file) return { status: 400, error: "No image uploaded." };

  return { data: { imageUrl: `${config.get("apiHost")}/api/static/${file.filename}` } };
};

const getImage = ({ params }) => {
  const imagePath = createImagePath(params.name);
  if (!fs.existsSync(imagePath)) return { status: 404, error: "No such file." };
  return { data: { imagePath } };
};

const deleteImage = ({ params }) => {
  const imagePath = createImagePath(params.name);
  if (!fs.existsSync(imagePath)) return { status: 404, error: "No such file." };
  fs.unlinkSync(imagePath);

  return { data: "File deleted successfully." };
};

exports.upload = upload;
exports.createImage = createImage;
exports.getImage = getImage;
exports.deleteImage = deleteImage;
