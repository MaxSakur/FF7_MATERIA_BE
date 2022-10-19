const mongoose = require('mongoose');
const express = require('express');
const config = require('config');
const authRouter = require('./router/auth.router.js');
const userRouter = require('./router/user.router.js');
const app = express();
const PORT = config.get('serverPort');
const DATABASE_URL = config.get('mongoDbUrl');
const corsMiddleware = require('./middleware/cors.middleware');

app.use(corsMiddleware);
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

const start = async () => {
  try {
    // connect DB
    await mongoose.connect(DATABASE_URL);
    app.listen(PORT, () => {
      console.log('SERVER STARTED on port =', PORT);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
