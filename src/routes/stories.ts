import express from 'express';
import storiesController from '../controllers/stories';
import { verifyToken } from '../middlewares/auth';

const storiesRouter = express.Router();
storiesRouter.use(verifyToken);

storiesRouter.post('/add', storiesController.validate('addStoryToCollection'), storiesController.addStoryToCollection);
storiesRouter.delete('/remove/:collectionId/:storyId', storiesController.validate('removeStoryFromCollection'), storiesController.removeStoryFromCollection);
storiesRouter.get('/get-all/:collectionId', storiesController.getAllStoriesInCollection);
storiesRouter.get('/get/:storyId', storiesController.getStory);

export default storiesRouter;