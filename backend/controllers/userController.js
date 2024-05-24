import userModel from "../models/userModule.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const googleLogin = async (req, res) => {
  const { name, email, password } = req.body; // include password for registration
  try {
    // Check if the user already exists
    let user = await userModel.findOne({ email });

    if (!user) {
      // Register new user
      const newUser = new userModel({
        name,
        email,
        password: '', // Store empty password or handle it differently
      });
      user = await newUser.save();
    }

    // Generate a token for the user
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error during Google login" });
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Existing loginUser and registerUser functions

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Password is incorrect" });
    }

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    // checking if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }
    // validating email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password" });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

export { loginUser, registerUser, googleLogin };
