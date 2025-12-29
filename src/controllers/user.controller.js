const { User } = require("../models/user.model");
const { hashPassword, comparePassword } = require("../utils/hash.util");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../services/token.service");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const hashed = await hashPassword(req.body.password);

    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashed,
    });
    res.status(201).json({ message: "User registered" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(401).json({ message: "user not found" });

    const valid = await comparePassword(req.body.password, user.password);

    if (!valid) return res.status(401).json({ message: "user not found" });

    const accessToken = generateAccessToken({ id: user._id });
    const refreshToken = generateRefreshToken({ id: user._id });

    user.refreshToken = refreshToken;
    await user.save();
    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.log("failed to login:", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).json({ message: "" });

    const user = await User.findOne({ refreshToken });

    if (!user) return res.status(403).json({ message: "" });

    const verifyToken = jwt.verify(refreshToken, process.env.SECRET_KEY);

    if (!verifyToken) return res.status(403).json({ message: "" });

    const newAccessToken = generateAccessToken({ id: verifyToken.id });

    res.json({ newAccessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
