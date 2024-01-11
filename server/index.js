const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://varun024123:ruredu@cluster0.tllkn3x.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
if (db) {
    console.log('Connected to MongoDB');
}
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// User Model
const UserSchema = new mongoose.Schema({
    studentName: String,
    std: { type: Number, required: true },
    password: String,
    access: Boolean,
});

const UserModel = mongoose.model('User', UserSchema);

const TopicSchema = new mongoose.Schema({
  topic_name: String,
  topic_description: String,
});

const UnitSchema = new mongoose.Schema({
  unit_name: String,
  topics: [TopicSchema],
});

const SubjectSchema = new mongoose.Schema({
  std: Number,
  name: [
    {
      subject_name: String,
      units: [UnitSchema],
    },
  ],
});


const SubjectModel = mongoose.model('Subject', SubjectSchema);

// Secret key for JWT
const secretKey = 'hackingmeisimpossible'; // Replace with a strong, secret key


// Middleware to verify JWT tokens
const verifyToken = async (req, res, next) => {
    const token = req.header('Authorization');
    console.log('verifying');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decodedToken = jwt.verify(token, secretKey);
        const userId = decodedToken.userId;

        // Fetch user details from the MongoDB collection based on userId
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = {
            userId: user._id,
            studentName: user.studentName,
            std: user.std,
            access: user.access,
        };
        next();
    } catch (error) {
        console.log('Token Verification Error:', error);
        return res.status(403).json({ message: 'Forbidden' });
    }
};


// API endpoint for user registration
app.post('/api/register', async (req, res) => {
    try {
        const { studentName, std, password, access } = req.body;

        // Check if the user already exists
        const existingUser = await UserModel.findOne({ studentName });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to the database
        const user = new UserModel({ studentName, std, password: hashedPassword, access });
        await user.save();

        
        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// API endpoint for user login
app.post('/api/login', async (req, res) => {
    try {
        const { studentName, password } = req.body;

        // Find the user in the database
        const user = await UserModel.findOne({ studentName });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token upon successful login
        const token = jwt.sign({ userId: user._id, studentName: user.studentName }, secretKey);

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


//API endpoint to fetch the user's access

app.get('/api/get-access', verifyToken, async (req, res) => {
    // Access information, student name, and std are available in req.user
    try {
      res.json({
        access: req.user.access,
        studentName: req.user.studentName,
        std: req.user.std,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  


// API endpoint to fetch subjects based on user's class
app.get('/api/get-subjects', verifyToken, async (req, res) => {
    try {
      const subjects = await SubjectModel.find({ std: req.user.std });
  
      // Extract only the 'name' array from each subject
      console.log(subjects)
      //const subjectNames = subjects.map(subject => subject.name);
       // console.log(subjectNames);
      res.json({ subjects });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

// Endpoint to get topics based on subject and unit
app.get('/api/get-topics/:subject/:unit', verifyToken, async (req, res) => {
  const { subject, unit } = req.params;

  try {
    // Find the subject in the database
    const selectedSubject = await SubjectModel.findOne({
      'name.subject_name': subject,
      'name.units.unit_name': unit,
    });

    if (!selectedSubject) {
      return res.status(404).json({ message: 'Subject or unit not found' });
    }

    // Extract and send the topics
    const topics = selectedSubject.name.find(sub => sub.subject_name === subject)
      .units.find(u => u.unit_name === unit).topics;
    res.json({ topics });
  } catch (error) {
    console.error('Error fetching topics', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


//getting details for a specified class to add by the admin

app.get('/api/get-class-details', verifyToken, async (req, res) => {
  try {
    const { std } = req.query;

    // Validate input (you can add more validation as needed)

    // Fetch subjects based on the selected class (std)
    const subjects = await SubjectModel.find({ std });

    res.json({ success: true, subjects });
  } catch (error) {
    console.error('Error fetching subjects', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});



//adding data into the database

app.post('/api/add-subject', verifyToken, async (req, res) => {
  try {
    const { std, subject } = req.body;

    // Validate input (you can add more validation as needed)

    // Add the new subject to the database
    const updatedData = await SubjectModel.findOneAndUpdate(
      { std },
      { $addToSet: { 'name': { subject_name: subject, units: [] } } },
      { new: true }
    );

    res.json({ success: true, data: updatedData });
  } catch (error) {
    console.error('Error adding subject', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.post('/api/add-unit', verifyToken, async (req, res) => {
  try {
    const { std, subject, unit } = req.body;

    // Validate input (you can add more validation as needed)

    // Add the new unit to the database
    const updatedData = await SubjectModel.findOneAndUpdate(
      { std, 'name.subject_name': subject },
      { $addToSet: { 'name.$.units': { unit_name: unit, topics: [] } } },
      { new: true }
    );

    res.json({ success: true, data: updatedData });
  } catch (error) {
    console.error('Error adding unit', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.post('/api/add-topic', verifyToken, async (req, res) => {
  try {
    const { std, subject, unit, topic } = req.body;

    // Validate input (you can add more validation as needed)

    // Add the new topic to the database
    const updatedData = await SubjectModel.findOneAndUpdate(
      { std, 'name.subject_name': subject, 'name.units.unit_name': unit },
      { $addToSet: { 'name.$.units.$[u].topics': { topic_name: topic } } },
      { arrayFilters: [{ 'u.unit_name': unit }], new: true }
    );

    res.json({ success: true, data: updatedData });
  } catch (error) {
    console.error('Error adding topic', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});











