const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const admin = asyncHandler(async (req, res, next) => {
  try {
    const user = await prisma.User.findUnique({
      where: {
        id: Number(req.user.id),
      },
    });
    if (user.admin === true) next();
    else {
      throw new Error('Access denied');
    }
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized');
  }
});

module.exports = { admin };
