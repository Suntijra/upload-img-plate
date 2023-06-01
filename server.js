const express = require('express');
const multer = require('multer');

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = new Date().getTime() + ".jpg"
    const filename = file.originalname.replace(/[^a-zA-Z0-9]/g, '') + '-' + uniqueSuffix;
    cb(null, filename);
  }
});

const imageFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('รองรับเฉพาะไฟล์ภาพเท่านั้น!'), false);
  }
  cb(null, true);
};

// ปรับเป็น multer.array() แทน upload.single()
const upload = multer({ storage: storage, fileFilter: imageFilter }).array('images');

app.post('/upload', function (req, res, next) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // กรณีเกิดข้อผิดพลาดจาก multer
      return res.status(500).json({ message: err.message });
    } else if (err) {
      // กรณีเกิดข้อผิดพลาดอื่นๆ
      return res.status(500).json({ message: err.message });
    }

    // ตรวจสอบว่ามีไฟล์ภาพหรือไม่
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'ไม่พบไฟล์ภาพ' });
    }

    // ดำเนินการกับไฟล์ภาพที่อัปโหลดที่นี่
    const filenames = req.files.map(file => file.filename);
    res.status(200).json({ message: 'อัปโหลดภาพสำเร็จ', filenames: filenames });
  });
});

app.listen(3000, function () {
  console.log('เซิร์ฟเวอร์เริ่มต้นที่พอร์ต 3000');
});
