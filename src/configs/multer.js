const multer = require('multer');

const diskStorage = multer.diskStorage({
  destination: 'media/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.includes('image/')) {
    return cb(new Error('only image files are allowed'));
  }

  cb(null, true);
};

const upload = multer({
  fileFilter,
  storage: diskStorage,
  limits: {
    files: 1,
    parts: 2,
    fieldNameSize: 50,
    fields: 0,
    fileSize: 1024 * 1024, // 1MG
    fieldSize: 1024 * 1024 // 1MG
  }
}).single('image');

module.exports = upload;
