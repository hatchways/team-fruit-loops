const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new aws.S3();

// Set filter to only accept image formats
const fileFilter = (req, file, cb) => {
  if (file.mimetype.includes("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid Mime Type; Please upload an image file"), false);
  }
};

// Configure multer storage for AWS S3
const storage = multerS3({
  s3: s3,
  bucket: "teamfruitloops",
  acl: "public-read",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    // Set name of file to equal user's object ID
    cb(null, req.body.id);
  },
});

const upload = multer({
  fileFilter: fileFilter,
  storage: storage,
});

module.exports = upload;
