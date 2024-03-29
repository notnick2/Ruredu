// Importing required Node.js modules for the Express server

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');


const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// connecting to mongodb using mongoose
const uri = "mongodb+srv://varun024123:ruredu@cluster0.tllkn3x.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
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
  incomplete: [{ type: String }],
  complete: [{ type: String }],
});

const UserModel = mongoose.model('User', UserSchema);

//class - subject - details schema

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

// file schema
const fileSchema = new mongoose.Schema({
  std: {
    type: String,
    required: true,
  },
  selectedSubject: {
    type: String,
    required: true,
  },
  selectedUnit: {
    type: String,
    required: true,
  },
  selectedTopic: {
    type: String,
    required: true,
  },
  topicDescription: {
    type: String,
    required: true,
  },
  pdfPath: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const File = mongoose.model('File', fileSchema);

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

    let reaccess = access

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ studentName });
    if (existingUser) {
      return res.status(200).json({ message: 'User already exists' });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    //default access to superuser
    if(studentName == 'superuser'){ 
      reaccess = true
    }

    // Save user to the database
    const user = new UserModel({ studentName, std, password: hashedPassword, access: reaccess });
    await user.save();

    res.status(200).json({ message: 'Registration successful' });
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


    // Add the topic to the incomplete array in the UserModel
    await UserModel.updateMany(
      { std },
      { $addToSet: { incomplete: topic } },
      { new: true }
    );
    


    res.json({ success: true, data: updatedData });
  } catch (error) {
    console.error('Error adding topic', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


app.post('/api/add-topic-description', verifyToken, async (req, res) => {
  try {
    const { std, subject, unit, topic, topic_description } = req.body;
    console.log(topic_description);

    // Validate input (you can add more validation as needed)

    // Find the unit and its index within the array
    const unitDocument = await SubjectModel.findOne({
      std,
      'name.subject_name': subject,
      'name.units.unit_name': unit,
    });

    if (!unitDocument) {
      throw new Error('Unit not found');
    }

    const unitIndex = unitDocument.name.findIndex(u => u.units.some(u => u.unit_name === unit));

    // Update the topic_description for the specified topic
    const updatedData = await SubjectModel.findOneAndUpdate(
      {
        std,
        'name.subject_name': subject,
        'name.units.unit_name': unit,
        'name.units.topics.topic_name': topic,
      },
      {
        $set: {
          [`name.${unitIndex}.units.$[u].topics.$[t].topic_description`]: topic_description,
        },
      },
      {
        arrayFilters: [
          { 'u.unit_name': unit },
          { 't.topic_name': topic },
        ],
        new: true,
      }
    );

    res.json({ success: true, data: updatedData });
  } catch (error) {
    console.error('Error adding topic description', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});





// handle pdf uploads....


// Storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    const fileName = `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, fileName); // Set the file name to avoid naming conflicts
  },
});

const upload = multer({ storage: storage });

// API endpoint for handling file uploads
app.post('/api/upload', upload.single('pdf'), (req, res) => {
  try {
    const { std, Subject, Unit, Topic, topic_description } = req.body;
    const pdfPath = req.file.path;
    console.log(std)
    console.log(Subject)
    console.log(Unit)
    console.log(Topic)
    console.log(topic_description)
    // Save the file details to your database
    // Assuming you have a File model for storing file information
    const newFile = new File({
      std,
      selectedSubject: Subject,
      selectedUnit: Unit,
      selectedTopic: Topic,
      pdfPath,
      topicDescription: topic_description,
    });

    newFile.save();

    res.json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// api end to update profile

// API endpoint to update the user's profile


app.put('/api/updateUser', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { updatedStudentName, newPassword } = req.body;
    console.log(req.body)
    console.log(updatedStudentName)
    console.log(newPassword)
    // Validate and update user information
    const user = await UserModel.findById(userId);
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (updatedStudentName) {
      user.studentName = updatedStudentName;
      console.log(user.studentName);
    }

    if (newPassword) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      user.password = hashedPassword;
      console.log(hashedPassword)
      console.log(user.password)
    }

    // Save the updated user details
    await user.save();

    res.status(200).json({ message: 'User information updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// send pdf to frontend

app.post('/api/get-pdf', verifyToken, async (req, res) => {
  try {
    const { topicName, topicDescription } = req.body;

    // Fetch the PDF path based on the provided topic information
    const file = await File.findOne({
      selectedTopic: topicName,
      topicDescription,
    });

    if (!file) {
      return res.status(404).json({ error: 'PDF not found' });
    }

    res.json({ pdfPath: file.pdfPath });
    console.log(file.pdfPath);
  } catch (error) {
    console.error('Error fetching PDF', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Check access route
app.get('/api/check-access', async (req, res) => {
  try {
    const { username } = req.query;
    const user = await UserModel.findOne({ studentName: username });

    if (user) {
      res.json({ access: user.access });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error checking access status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update access route
app.post('/api/update-access', async (req, res) => {
  try {
    const { username, access } = req.body;
    const user = await UserModel.findOneAndUpdate(
      { studentName: username },
      { access },
      { new: true }
    );

    if (user) {
      res.json({ success: 'Access status updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating access status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/get-units', async (req, res) => {
  try {
    const std = req.query.std;
    const subjectName = req.query.subject_name;

    const subject = await SubjectModel.findOne({ std, 'name.subject_name': subjectName });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const units = subject.name.find((subj) => subj.subject_name === subjectName).units;

    const unitNames = units.map((unit) => unit.unit_name);

    console.log('Unit Names:', unitNames);
    res.json({ unitNames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/get-topics', async (req, res) => {
  try {
    const std = parseInt(req.query.std);
    const subjectName = req.query.subjectName;
    const unitName = req.query.unitName;

    const subject = await SubjectModel.findOne({ std, 'name.subject_name': subjectName });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const unit = subject.name.find((s) => s.subject_name === subjectName)?.units.find((u) => u.unit_name === unitName);

    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    const topics = unit.topics;

    topics.forEach((topic) => {
      console.log(`Topic Name: ${topic.topic_name}, Topic Description: ${topic.topic_description}`);
    });

    res.status(200).json({ topics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// API endpoint to get incomplete tasks
app.get('/api/get-incomplete-tasks', verifyToken, async (req, res) => {
  try {
      // Access the user ID from req.user
      const userId = req.user.userId;

      // Assuming your User model is UserModel, and incomplete tasks are stored in the same collection
      const user = await UserModel.findById(userId);

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Access the incomplete array from the user model
      const incompleteTasks = user.incomplete;
      res.json({ incomplete: incompleteTasks });
  } catch (error) {
      console.error('Error fetching incomplete tasks:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


// API endpoint to get complete tasks
app.get('/api/get-complete-tasks', verifyToken, async (req, res) => {
  try {
      const userId = req.user.userId;
      console.log(userId)
      const user = await UserModel.findById(userId);
      console.log(user)
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Access the complete array from the user model
      const completeTasks = user.complete;
      console.log(completeTasks);
      console.log('completed tasks dfsfhksdhgkjkfsdk');
      res.json({ complete: completeTasks });
  } catch (error) {
      console.error('Error fetching complete tasks:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});



// API endpoint to check if a topic is completed
app.post('/api/check-topic-completion', verifyToken, async (req, res) => {
  try {
    const { topicName } = req.body;
    console.log(topicName)
    const userId = req.user.userId;
    const user = await UserModel.findById(userId);
    console.log(user)
    // Assuming the complete array is an array of objects with a topic_name property
    const isCompleted = user.complete.some(topic => topic === topicName);
    console.log(isCompleted);
    res.json({ isCompleted });
  } catch (error) {
    console.error('Error checking topic completion:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to mark a topic as completed
app.post('/api/mark-topic-completed', verifyToken, async (req, res) => {
  try {
    const { topicName } = req.body;
    console.log(topicName);
    // Add the completed topic to the complete array and remove it from the incomplete array
    await UserModel.findByIdAndUpdate(
      req.user.userId,
      {
        $addToSet: { complete: topicName  },
        $pull: { incomplete: topicName  },
      },
      { new: true }
    );

    res.json({ success: true, message: 'Topic marked as completed' });
  } catch (error) {
    console.error('Error marking topic as completed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// get subject and unit data from the given topic 

app.post('/searchTopic', async (req, res) => {
  try {
    const topicName = req.body.topicName; // Assuming the frontend sends the topicName in the request body

    // Search for the topic in the SubjectModel
    const result = await SubjectModel.findOne({
      'name.units.topics.topic_name': topicName,
    });

    if (!result) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    // Extract relevant information and send it to the frontend
    const subjectName = result.name.find(subject => subject.units.some(unit => unit.topics.some(topic => topic.topic_name === topicName))).subject_name;
    const unitName = result.name.find(subject => subject.units.some(unit => unit.topics.some(topic => topic.topic_name === topicName))).units.find(unit => unit.topics.some(topic => topic.topic_name === topicName)).unit_name;

    res.status(200).json({
      subjectName,
      unitName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

});