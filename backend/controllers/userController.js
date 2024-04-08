const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
 const signUp = async (req, res, next) => {
  console.log('first')
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
 
    });

    await newUser.save();
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET
    );
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ error: "Error signing up" });
    next(err);
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body; // Extract email and password from request body

    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) throw new Error("User not found");
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error("Invalid password");
    // Generate JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    res.cookie('jwt', '', {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    res.json({ token ,role:user.role});
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({ error: "Invalid credentials" });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logout = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {signUp, login, logout  };
