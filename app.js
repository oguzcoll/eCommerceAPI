require('dotenv').config();
require('express-async-errors');
const express = require('express');
const connectDB = require('./db/connect');
const morgan = require('morgan');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const app = express();
const port = process.env.PORT || 6000;
app.use(morgan('tiny'));
app.use(express.json());
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
app.get('/', (req, res) => {
  res.send('Hello World');
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, console.log(`Server is running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
