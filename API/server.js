const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.port || 5000;
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/entry', require('./routes/entryRoutes'));
app.use('/api/access', require('./routes/accessRoutes'));

app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));
