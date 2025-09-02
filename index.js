const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/submit-form', (req, res) => {
  const formData = req.body;
  console.log('Received form data:', formData);

  //data

  res.json({ success: true, message: 'Data received successfully' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
