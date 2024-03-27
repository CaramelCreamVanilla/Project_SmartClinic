const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const Jimp = require('jimp');

require('dotenv').config()

const app = express();
const port = process.env.ENV_PORT;

//Routes
const authRouter = require('./routes/authRoutes.js');
const questionRouter = require('./routes/questionRoutes.js');
const patientRouter = require('./routes/patientRoutes.js');

// Use the cors middleware
app.use(cors());

// Parse JSON in the request body
app.use(express.json());


//Use Routes
app.use('/auth',authRouter)
app.use('/question',questionRouter)
app.use('/patient',patientRouter)

//For Upload img
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

app.post('/uploadimg', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }
  
  Jimp.read(req.file.buffer)
    .then(image => {
      // Convert the image to PNG
      return image.writeAsync(path.join(__dirname, 'UserProfile/acc_profile/', req.body.userID + '.png'));
    })
    .then(() => {
      res.status(200).send('Image uploaded and converted to PNG.');
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error processing image.');
    });
});
//For Upload img

//For fetch image
app.use('/UserProfile/acc_profile', express.static(path.join(__dirname, 'UserProfile/acc_profile')));

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});