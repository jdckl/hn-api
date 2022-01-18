import express from 'express';
import collectionsController from '../controllers/collections';
import { verifyToken } from '../middlewares/auth';

const collectionsRouter = express.Router();
      collectionsRouter.use(verifyToken);

collectionsRouter.post('/add', collectionsController.validate('createCollection'), collectionsController.createCollection);
collectionsRouter.delete('/remove/:collectionId', collectionsController.validate('removeCollection'), collectionsController.removeCollection);
collectionsRouter.get('/get-all', collectionsController.getAllCollections);
collectionsRouter.get('/get/:collectionId', collectionsController.getCollection);

export default collectionsRouter;