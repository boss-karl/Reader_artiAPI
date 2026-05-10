const multer = require("multer");
const cloudinary = require('../config/cloudinary.js');
const CloudinaryStorage = require('multer-storage-cloudinary').CloudinaryStorage;

const avatar_storage = new CloudinaryStorage({
    cloudinary,
    params: {folder: 'avatar_uploads'},
});

const image_storage = new CloudinaryStorage({
    cloudinary,
    params: {folder: 'image_uploads'},
});

const upload_avatar = multer({
  storage: avatar_storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("Only images allowed"), false);
    }
  }
});

const upload_image = multer({
    storage: image_storage,
    limits: {
        fileSize: 3 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files allowed"), false);
        }
    }
});

module.exports = {upload_avatar, upload_image};