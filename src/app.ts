// Base
import * as dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

// Controllers
import baseController from './controllers/base';

// Routers
import userRouter from './routes/users';
import collectionsRouter from './routes/collections';
import storiesRouter from './routes/stories';

// Logger
import {morganOption} from './middlewares/logger';

dotenv.config();

const APP = express();

      APP.use(helmet());
      APP.use(express.json());
      APP.use(morgan('combined', morganOption));

      APP.use('/users', userRouter);
      APP.use('/collections', collectionsRouter);
      APP.use('/stories', storiesRouter);
      APP.get('/', baseController.renderSplash);

export default APP;