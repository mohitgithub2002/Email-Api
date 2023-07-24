const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

const dbURI = process.env.MONGODB_URI ;


mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

const emailSchema = new mongoose.Schema({
    email: String,
});

const emailList = mongoose.model('emailListDeltaLab', emailSchema);


// Middleware to parse JSON
app.use(express.json());

// Define route to store emails
app.post('/subscribe', async(req, res) => {
  const { email } = req.body;

  try {
    // Save the email to the database
    const newEmail = emailList({ email });
    await newEmail.save();
    console.log('Email stored:', email);
    res.json({ message: 'Email stored successfully!' });
  } catch (error) {
    console.error('Error storing email:', error);
    res.status(500).json({ error: 'Error storing email' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


