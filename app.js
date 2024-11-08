require('dotenv').config();
require('express-async-errors');
const express = require('express');
const connectDB = require('./db/connect');
const morgan = require('morgan');
const authRouter = require('./routes/authRoutes');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/api/v1/auth', authRouter);
app.use(morgan('tiny'));
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, console.log(`Server is running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
