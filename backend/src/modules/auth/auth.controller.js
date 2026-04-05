const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");
const { serializeUser } = require("../../utils/serializers");

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const role = req.body.role || "student";

    const existing = await User.findOne({ email: email.toLowerCase() }).lean();
    if (existing) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    const user = serializeUser(createdUser);
    const token = signToken(user);

    return res.status(201).json({ token, user });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const safeUser = serializeUser(user);

    const token = signToken(safeUser);

    return res.json({ token, user: safeUser });
  } catch (error) {
    return next(error);
  }
}

async function profile(req, res, next) {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(serializeUser(user));
  } catch (error) {
    return next(error);
  }
}

module.exports = { register, login, profile };
