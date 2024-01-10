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

// Subject Model
const SubjectSchema = new mongoose.Schema({
    std: Number,
    name: Array,
    // Add other subject-related fields
});

const SubjectModel = mongoose.model('Subject', SubjectSchema);


//Unit Model
const UnitSchema = new mongoose.Schema({
    subject: String,
    unit: Array,
});
const UnitModel = new mongoose.model('Unit', UnitSchema);


//Topic Model
const TopicSchema = new mongoose.Schema({
    unit: String,
    topic: Array,
})
const TopicModel = mongoose.model('Topic', TopicSchema);

//Note Model
const NoteSchema = new mongoose.Schema({
    unit: String,
    topic:String,
    note:Array,
});
const NoteModel = mongoose.model('Note', NoteSchema);

//Video Model
const VideoSchema = new mongoose.Schema({
    unit: String,
    topic: String,
    video: Array,
});
const VideoModel = mongoose.model('Video', VideoSchema);
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

// API endpoint to fetch subjects based on user's class
app.get('/api/subjects',verifyToken, async (req, res) => {
    
    try {
        const userClass = req.user.std;

        // Fetch subjects for the user's class from the MongoDB collection
        const subjects = await SubjectModel.findOne({ std: userClass });

        if (!subjects) {
            return res.status(404).json({ message: 'Subjects not found for the given class' });
        }

        res.json(subjects.name);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


//API endpoint to fetch units based on subject

app.get('/api/units/:subject', verifyToken, async (req, res) => {
    try {
      
      const subject = req.params.subject;
  
      // Fetch units for the user's class and the selected subject
      const units = await UnitModel.findOne({ subject }, { _id: 0, unit: 1 });
      
      res.json(units.unit);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });


// API endpoint to fetch topics for a specific subject and unit
app.get('/api/topics/:subject/:unit', verifyToken, async (req, res) => {
    try {
      const unit = req.params.unit;
      const result = await TopicModel.findOne({ unit }, { _id: 0 , topic: 1 });
      res.json(result.topic);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


//API endpoint to fetch notes for specific unit and topic
app.get('/api/notes/:unit/:topic', verifyToken, async (req, res) => {
    try {
      const { unit, topic } = req.params;
      // Query MongoDB to get notes based on unit and topic
      const note = await NoteModel.find({ unit, topic });
      const extractedObject = note[0];
      console.log(extractedObject);
      console.log(extractedObject.note);
      res.json(extractedObject.note);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

//API endpoint to fetch videos for specific unit and topic
app.get('/api/videos/:unit/:topic', verifyToken, async (req, res) => {
    try {
      const { unit, topic } = req.params;
      // Query MongoDB to get notes based on unit and topic
      const video = await NoteModel.find({ unit, topic });
      const extractedObject = video[0];
      console.log(extractedObject);
      console.log(extractedObject.note);
      res.json(extractedObject.note);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


// Protected API endpoint (Learn)
app.get('/api/learn', verifyToken, (req, res) => {
    res.json({ message: 'Welcome to the Learn page!' });
  });

// Protected API endpoint (Dashboard)
app.get('/api/dashboard', verifyToken, (req, res) => {
    res.json({ message: 'Welcome to the dashboard!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});




app.get('/api/test', (req,res) => {
    res.json({message: 'jesting'});
})