const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed!'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

const setFilename = (req, res, next) => {
  const timestamp = Date.now();
  const date = new Date().toISOString().split('T')[0];

  for (let field in req.files) {
    req.files[field].forEach(file => {
      const fieldname = file.fieldname.replace(/\[/g, '_').replace(/\]/g, '');
      const extension = path.extname(file.originalname); 
      const filename = `${fieldname}_${timestamp}_${date}${extension}`;
      file.filename = filename;
      file.extension = extension;
    });
  }
  next();
};

module.exports = {
  upload,
  setFilename
};
