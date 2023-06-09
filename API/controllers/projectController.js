const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');
const { validateID, validateString } = require('./validations.js');

const prisma = new PrismaClient();

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private, admin
const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await prisma.Project.findMany({});
  res.json(projects);
});

const countProjects = asyncHandler(async (req, res) => {
  const projects = await prisma.Project.findMany({});
  res.json(projects.length);
});

// @desc    Get user projects
// @route   GET /api/projects/user
// @access  Private
const getUserProjects = asyncHandler(async (req, res) => {
  //validate id
  if (!validateID(req.user.id)) {
    res.status(400);
    throw new Error('Invalid ID');
  }

  const project = await prisma.project.findMany({
    where: {
      entries: {
        some: {
          accesses: {
            some: {
              userId: Number(req.user.id),
            },
          },
        },
      },
    },
  });
  res.status(201).json(project);
});

// @desc    Add new project
// @route   POST /api/projects
// @access  Private, admin
const addProject = asyncHandler(async (req, res) => {
  //validate inputs
  if (!validateString(req.body.name)) {
    res.status(400);
    throw new Error('Invalid name');
  }

  const { name } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  //Check if project exists
  const projectExists = await prisma.Project.findUnique({
    where: {
      name,
    },
  });

  if (projectExists) {
    res.status(400);
    throw new Error('Project already exists');
  }

  //Add new project
  const project = await prisma.Project.create({
    data: {
      name: name,
    },
  });

  //Response
  if (project) {
    res.status(201).json({
      name: project.name,
    });
  } else {
    res.status(400);
    throw new Error('Invalid project data');
  }
});

// @desc    Remove project
// @route   Delete /api/projects
// @access  Private, admin
const removeProject = asyncHandler(async (req, res) => {
  //validate inputs
  if (!validateString(req.body.name)) {
    res.status(400);
    throw new Error('Invalid name');
  }

  const { name } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  //Check if project exists
  const projectExists = await prisma.Project.findUnique({
    where: {
      name,
    },
  });

  if (!projectExists) {
    res.status(400);
    throw new Error('No such project');
  }

  //Remove project
  const project = await prisma.Project.delete({
    where: {
      name: name,
    },
  });

  //Response
  if (project) {
    res.status(201).json({
      message: 'Project successfuly removed',
    });
  } else {
    res.status(400);
    throw new Error('Invalid project data');
  }
});

module.exports = {
  getAllProjects,
  countProjects,
  getUserProjects,
  addProject,
  removeProject,
};
