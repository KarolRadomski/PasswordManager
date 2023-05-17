const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// @desc    Get all users
// @route   GET /api/users
// @access  Private, admin
const getAll = asyncHandler(async (req, res) => {
  const users = await prisma.User.findMany({});
  res.json(users);
});

// @desc    Get all users
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const me = await prisma.User.findUnique({
    where: {
      id: req.user.id,
    },
  });
  if (me) {
    res.status(201).json({
      name: me.name,
      email: me.email,
    });
  } else {
    res.status(400);
    throw new Error('No such user');
  }
});

// @desc    Add new standard user
// @route   POST /api/users/add
// @access  Private, admin
const addUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  //Check if user exists
  const userExists = await prisma.User.findUnique({
    where: {
      email: email,
    },
  });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create user
  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
    },
  });

  //Response after create
  if (user) {
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user Data');
  }
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Fill all fields');
  }

  //Check for user email
  const user = await prisma.User.findUnique({
    where: {
      email,
    },
  });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      admin: user.admin,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  getAll,
  getMe,
  addUser,
  loginUser,
};
