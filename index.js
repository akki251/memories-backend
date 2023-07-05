import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import errorController from './controllers/errorController.js';
const app = express();

dotenv.config();

// middleware
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

// routing middleware
app.use('/posts', postRoutes);
app.use('/user', userRoutes);

app.use('/', (req, res) => {
  return res.send('Welcome to memories API');
});

const port = process.env.PORT || 5000;

mongoose
  .connect(`${process.env.CONNECTION_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => app.listen(port, () => console.log(`server running on ${port}`)))
  .catch((err) => console.log(err.message));

app.use(errorController);
