const mongoose = require("mongoose");
const config = require("config");
const path = require("path");
const multer = require("multer");
var Grid = require("gridfs-stream");
const GridFsStorage = require("multer-gridfs-storage");
const crypto = require("crypto");
const getDbParams = require("../Utils/getDbParams");

const dbType = process.env.dbType || "deployed";
const { dbUrl, dbOptions } = getDbParams(dbType);
let gfs;

const conn = mongoose.createConnection(dbUrl, dbOptions);
conn.once("open", function () {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("images");
});

const storage = new GridFsStorage({
  url: dbUrl,
  file: (req, file) =>
    new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err);

        const filename = buf.toString("hex") + path.extname(file.originalname);
        resolve({ filename: filename, bucketName: "images" });
      });
    })
});

const upload = multer({ storage }).single("image");

const createImage = ({ file }) => {
  if (!file) return { status: 400, error: "No image uploaded." };
  return { data: { imageUrl: `${config.get("apiHost")}/api/static/${file.filename}` } };
};

const getImage = async ({ params }) => {
  if (!gfs) return { status: 404, error: "Connection error." };
  const file = await gfs.files.findOne({ filename: params.name });
  if (!file || !file.length) return { status: 404, error: "No such file." };

  const readStream = gfs.createReadStream(file.filename);
  return { data: { readStream } };
};

const deleteImage = async ({ params }) => {
  if (!gfs) return { status: 404, error: "Connection error." };
  await gfs.remove({ filename: params.name });
  return { data: "File deleted." };
};

exports.upload = upload;
exports.createImage = createImage;
exports.getImage = getImage;
exports.deleteImage = deleteImage;
