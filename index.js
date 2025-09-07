const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure uploads folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'Maurya',
  password: 'Maurya99',
  database: 'friendship_db'
});
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});
app.use('/uploads', express.static('uploads'));

// Validation rules (Example, add all as needed)
const validationRules = [
  body('name').notEmpty().withMessage('Name is required'),
  // Add other validations for other fields here...
];

// POST route for form submission
app.post('/submit-form', 
  upload.single('photo'),         // multer middleware first
  validationRules,                // then express-validator middleware
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Optional: Delete uploaded file if validation fails (not shown here)
      return res.status(400).json({ errors: errors.array() });
    }

    const data = req.body;
    const photoPath = req.file ? req.file.filename : null;

    const sql = `INSERT INTO friendship_data (
      name, nickname, age, dob, mobile, gender, email, favcolor, favfood, hobbies,
      excrush, crush, address, specialtask, friendshiprating, secretsshared,
      firstmeet, schoolclass, gradtype, othertype, meetstory, currentedu, preptype,
      bestfriend1, bestfriend2, bestfriend3, bestfriend4, bestfriend5, bestfriend6, bestfriend7, photo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
      data.name, data.nickname, data.age, data.dob || null, data.mobile, data.gender, data.email,
      data.favcolor, data.favfood, data.hobbies,
      data.excrush, data.crush, data.address, data.specialtask,
      data.friendshiprating, data.secretsshared, data.firstmeet,
      data.schoolclass, data.gradtype, data.othertype, data.meetstory,
      data.currentedu, data.preptype, data.bestfriend1, data.bestfriend2,
      data.bestfriend3, data.bestfriend4, data.bestfriend5,
      data.bestfriend6, data.bestfriend7, photoPath
    ];

    db.query(sql, params, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      res.json({ success: true, message: 'Data saved successfully!' });
    });
});

// GET route to fetch all submitted forms
app.get('/all-forms', (req, res) => {
  const sql = 'SELECT * FROM friendship_data ORDER BY id DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database fetch error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    res.json({ success: true, data: results });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
