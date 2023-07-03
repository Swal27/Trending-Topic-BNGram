import express from 'express';
import path from 'path'
import logger from 'morgan';
import cors from 'cors';
import morgan from 'morgan';

import { default as indexRouter } from './routes/index.js';
import { default as usersRouter } from './routes/users.js';

const __dirname = path.resolve();
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    origin:'http://localhost:3001'
}));
app.use(morgan('combined'));

app.use('/', indexRouter);
app.use('/users', usersRouter);

export default app;
