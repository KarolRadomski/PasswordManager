const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { validateID, validateString, validateEmail, validatePassword } = require('./validations.js');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// @desc    Grant password to existing user
// @route   POST /api/projects/:userID
// @access  Private, admin
const grantAccessToExistingUser = asyncHandler(async (req, res) => {
  //Validate inputs
  if (!validateID(req.params.id)) {
    res.status(400);
    throw new Error('Invalid ID');
  }
  if (!validateID(req.body.entryID)) {
    res.status(400);
    throw new Error('Invalid entry ID');
  }

  const userID = req.params.id;
  const entryID = req.body.entryID;

  //Check if user exist
  const user = await prisma.User.findUnique({
    where: {
      id: Number(userID),
    },
  });
  if (!user) {
    res.status(400);
    throw new Error('No such user');
  }

  //Check if entry exist
  const entry = await prisma.Entry.findUnique({
    where: {
      id: Number(entryID),
    },
  });
  if (!entry) {
    res.status(400);
    throw new Error('No such entry');
  }

  //Check if user have access
  const access = await prisma.Access.findMany({
    where: {
      userId: Number(userID),
      entryId: Number(entryID),
    },
  });
  if (access.length > 0) {
    res.status(400);
    throw new Error('User has access');
  }

  //Grant access
  const grantedAccess = await prisma.Access.create({
    data: {
      userId: Number(userID),
      entryId: Number(entryID),
    },
  });

  //Response
  if (grantedAccess) {
    res.status(201).json({
      message: 'Access successfuly granted',
    });
  } else {
    res.status(400);
    throw new Error('Invalid access data');
  }
});

// @desc    Grant password to new user
// @route   POST /api/access
// @access  Private, admin
const grantAccessToNewUser = asyncHandler(async (req, res) => {
  //Validate inputs
  if (!validateString(req.body.name)) {
    res.status(400);
    throw new Error('Invalid name');
  }
  if (!validateEmail(req.body.email)) {
    res.status(400);
    throw new Error('Invalid email');
  }
  if (!validatePassword(req.body.password)) {
    res.status(400);
    throw new Error('Invalid password');
  }
  if (!validateID(req.body.entryID)) {
    res.status(400);
    throw new Error('Invalid entry ID');
  }

  const { name, email, password, entryId } = req.body;

  if (!name || !email || !password || !entryId) {
    res.status(400);
    throw new Error('Missing data');
  }

  //Check if user exist
  const userExists = await prisma.User.findUnique({
    where: {
      email,
    },
  });
  console.log(userExists);
  if (userExists) {
    res.status(400);
    throw new Error('User already exist');
  }

  //Check if entry exist
  const entryExists = await prisma.Entry.findUnique({
    where: {
      id: Number(entryId),
    },
  });
  if (!entryExists) {
    res.status(400);
    throw new Error('No such entry');
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

  if (!user) {
    res.status(400);
    throw new Error('Unable to create user');
  }
  //Grant access
  const grantedAccess = await prisma.Access.create({
    data: {
      userId: Number(user.id),
      entryId: Number(entryId),
    },
  });

  //Response
  if (grantedAccess) {
    res.status(201).json({
      message: 'User created Access successfuly granted',
    });
  } else {
    res.status(400);
    throw new Error('Invalid data');
  }
});

module.exports = {
  grantAccessToExistingUser,
  grantAccessToNewUser,
};
