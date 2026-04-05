const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const EmissionFactor = require("../models/emissionFactor.model");
const User = require("../models/user.model");

const defaultFactors = [
  { activity_type: "transportation", factor: 0.12 },
  { activity_type: "electricity", factor: 0.475 },
  { activity_type: "paper", factor: 0.01 },
  { activity_type: "device", factor: 0.04 }
];

const defaultUsers = [
  {
    name: "Aslam",
    email: "aslam.admin@example.com",
    role: "admin",
    password: "football123"
  },
  {
    name: "Lionel Messi",
    email: "messi.student@example.com",
    role: "student",
    password: "football123"
  },
  {
    name: "Kylian Mbappe",
    email: "mbappe.student@example.com",
    role: "student",
    password: "football123"
  },
  {
    name: "Erling Haaland",
    email: "haaland.student@example.com",
    role: "student",
    password: "football123"
  },
  {
    name: "Cristiano Ronaldo",
    email: "ronaldo.faculty@example.com",
    role: "faculty",
    password: "football123"
  },
  {
    name: "Kevin De Bruyne",
    email: "debruyne.faculty@example.com",
    role: "faculty",
    password: "football123"
  },
  {
    name: "Luka Modric",
    email: "modric.faculty@example.com",
    role: "faculty",
    password: "football123"
  }
];

async function seedEmissionFactors() {
  for (const factor of defaultFactors) {
    await EmissionFactor.findOneAndUpdate({ activity_type: factor.activity_type }, factor, {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true
    });
  }
}

async function seedUsers() {
  for (const user of defaultUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await User.findOneAndUpdate(
      { email: user.email },
      {
        name: user.name,
        email: user.email,
        role: user.role,
        password: hashedPassword
      },
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true
      }
    );
  }
}

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not set");
  }

  await mongoose.connect(mongoUri);
  await seedEmissionFactors();
  await seedUsers();
}

module.exports = { connectDB };
