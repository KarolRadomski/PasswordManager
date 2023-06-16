const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');
const CryptoJS = require('crypto-js');
const { validateID, validateString, validateEmail, validatePassword } = require('./validations.js');
const prisma = new PrismaClient();

// @desc    Get all user project entry
// @route   GET /api/entry/user/:projectId
// @access  Private
const getUserEntry = asyncHandler(async (req, res) => {
  //validate project id
  if (!validateID(req.params.id)) {
    res.status(400);
    throw new Error('Invalid ID');
  }
  //validate user id
  if (!validateID(req.user.id)) {
    res.status(400);
    throw new Error('Invalid ID');
  }
  const projectId = req.params.id;
  const project = await prisma.Project.findUnique({
    where: {
      id: Number(projectId),
    },
  });
  if (!project) {
    res.status(400);
    throw new Error('No such project');
  }

  const entry = await prisma.Entry.findMany({
    where: {
      projectId: Number(projectId),
      accesses: {
        some: {
          userId: Number(req.user.id),
        },
      },
    },
  });

  // entry.map((item) => {
  //   if (item.password) {
  //     let bytes = CryptoJS.AES.decrypt(item.password, process.env.CRYPTO_SECRET);
  //     item.password = bytes.toString(CryptoJS.enc.Utf8);
  //   }
  // });

  res.status(201).json(entry);
});

const countEntries = asyncHandler(async (req, res) => {
  const entries = await prisma.Entry.findMany({});
  res.status(201).json(entries.length);
});

// @desc    Get all project entry
// @route   GET /api/entry
// @access  Private, admin
const getAllProjectEntry = asyncHandler(async (req, res) => {
  //validate project id
  if (!validateID(req.body.projectId)) {
    res.status(400);
    throw new Error('Invalid ID');
  }
  const { projectId } = req.body;
  if (!projectId) {
    res.status(400);
    throw new Error('Missing projectId');
  }
  const entries = await prisma.Entry.findMany({
    where: {
      projectId: Number(projectId),
    },
  });

  // entries.map((item) => {
  //   if (item.password) {
  //     let bytes = CryptoJS.AES.decrypt(item.password, process.env.CRYPTO_SECRET);
  //     item.password = bytes.toString(CryptoJS.enc.Utf8);
  //   }
  // });

  res.json(entries);
});

// @desc    Add new entry for project
// @route   POST /api/entry
// @access  private, admin
const addNewProjectEntry = asyncHandler(async (req, res) => {
  //validate inputs
  if (!validateString(req.body.name)) {
    res.status(400);
    throw new Error('Invalid name');
  }
  if (!validateID(req.body.projectId)) {
    res.status(400);
    throw new Error('Invalid ID');
  }
  if (!validateString(req.body.login)) {
    res.status(400);
    throw new Error('Invalid login');
  }
  if (!validateString(req.body.password)) {
    res.status(400);
    throw new Error('Invalid password');
  }

  const { name, login, password, url, projectId } = req.body;

  if (!name || !login || !password || !projectId) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  //Check if project exists
  const entryExists = await prisma.Entry.findMany({
    where: {
      AND: {
        name: {
          equals: name,
        },
        projectId: {
          equals: Number(projectId),
        },
      },
    },
  });

  if (entryExists.length > 0) {
    res.status(400);
    throw new Error('Entry already exist');
  }

  //Check if project exist
  const projectExists = await prisma.Project.findUnique({
    where: {
      id: Number(projectId),
    },
  });

  if (!projectExists) {
    res.status(400);
    throw new Error('No such project');
  }
  // Encrypt password
  const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.CRYPTO_SECRET).toString();

  //Create entry
  const entry = await prisma.Entry.create({
    data: {
      name,
      login,
      password: encryptedPassword,
      url,
      projectId: Number(projectId),
    },
  });

  //grant access to admin
  const access = await prisma.Access.create({
    data: {
      userId: Number(req.user.id),
      entryId: Number(entry.id),
    },
  });
  if (!access) {
    res.status(400);
    throw new Error('Failed to grand access to admin');
  }

  //Response after create
  if (entry) {
    res.status(201).json({
      id: entry.id,
      name: entry.name,
      login: entry.login,
      password: entry.password,
      url: entry.url,
      projectId: entry.projectId,
    });
  } else {
    res.status(400);
    throw new Error('Invalid entry data');
  }
});

// @desc    Edit entry for project
// @route   PUT /api/entry/:entryId
// @access  Private, admin
const editProjectEntry = asyncHandler(async (req, res) => {
  try {
    //validate inputs
    if (!validateString(req.body.name)) {
      res.status(400);
      throw new Error('Invalid name');
    }

    if (!validateString(req.body.login)) {
      res.status(400);
      throw new Error('Invalid login');
    }
    if (!validateString(req.body.password)) {
      res.status(400);
      throw new Error('Invalid password');
    }

    const entryId = req.params.id;
    const { name, login, password, url } = req.body;

    if (!name) {
      res.status(400);
      throw new Error('Please fill all fields');
    }

    //Check if entry exist
    const entryExists = await prisma.Entry.findUnique({
      where: {
        id: Number(entryId),
      },
    });
    if (!entryExists) {
      res.status(400);
      throw new Error('Entry doesnt exists');
    }

    //Check if name is unique

    // Encrypt password
    if (password) {
      var encryptedPassword = CryptoJS.AES.encrypt(password, process.env.CRYPTO_SECRET).toString();
    }

    //Update entry
    const entry = await prisma.Entry.update({
      where: { id: Number(entryId) },
      data: {
        name,
        login,
        password: encryptedPassword,
        url,
      },
    });

    //remove all entry accesses
    const access = await prisma.Access.deleteMany({
      where: {
        entryId: Number(entryId),
      },
    });
    if (!access) {
      res.status(400);
      throw new Error('Failed to remove access to admin');
    }

    // grant access to admin

    const accessAdmin = await prisma.Access.create({
      data: {
        userId: Number(req.user.id),
        entryId: Number(entryId),
      },
    });
    if (!accessAdmin) {
      res.status(400);
      throw new Error('Failed to grant access to admin');
    }

    // grant access for each user in users array

    if (req.body.users) {
      const users = req.body.users;
      users.forEach(async (user) => {
        const accessUser = await prisma.Access.create({
          data: {
            userId: Number(user.id),
            entryId: Number(entryId),
          },
        });
        if (!accessUser) {
          res.status(400);
          throw new Error('Failed to grant access to user');
        }
      });
    }

    //Response after update
    if (entry) {
      res.status(201).json({
        id: Number(entry.id),
        name: entry.name,
        login: entry.login,
        password: entry.password,
        url: entry.url,
        projectId: Number(entry.projectId),
      });
    } else {
      res.status(400);
      throw new Error('Invalid entry data');
    }
  } catch (error) {
    console.log(error);
  }
});

// @desc    Remove entry for project
// @route   DELETE /api/entry/:entryID
// @access  Private, admin
const removeProjectEntry = asyncHandler(async (req, res) => {
  //validate inputs
  if (!validateID(req.params.id)) {
    res.status(400);
    throw new Error('Invalid ID');
  }

  const entryId = req.params.id;
  if (!entryId) {
    res.status(400);
    throw new Error('Missing entry ID');
  }

  //Check if entry exists
  const entryExists = await prisma.Entry.findUnique({
    where: {
      id: Number(entryId),
    },
  });

  if (!entryExists) {
    res.status(400);
    throw new Error('Missing entry with provided ID');
  }

  //Remove entry
  const entry = await prisma.Entry.delete({
    where: {
      id: Number(entryId),
    },
  });

  //Response
  if (entry) {
    res.status(201).json({
      message: 'Entry successfuly removed',
    });
  } else {
    res.status(400);
    throw new Error('Invalid entry data');
  }
});

module.exports = {
  getUserEntry,
  countEntries,
  getAllProjectEntry,
  addNewProjectEntry,
  editProjectEntry,
  removeProjectEntry,
};
