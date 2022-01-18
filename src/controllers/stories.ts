import { NextFunction, Request, Response } from 'express';
import { validationResult, body } from 'express-validator';

import { getItemById } from './hn-api/hackerNewsApi';
import Collection from '../models/Collections';
import Story from '../models/Stories';
import Comment from '../models/Comments';

import {CommentQue} from './hn-api/hackerNewsQue';

const storiesController = {
    /**
     * @ignore
     * Validate incoming input
     * @param {string} method method name
     * @returns {NextFunction|Response}
     */
    validate: (method:string) => {
        switch (method) {
            case 'addStoryToCollection':
                return [
                    body('storyId').exists().notEmpty(),
                    body('collectionId').exists().notEmpty(),
                    (req:Request, res:Response, next:NextFunction) => {
                        const validationErrors = validationResult(req);
                        if (!validationErrors.isEmpty()) {
                            return res.status(400).json({ error: true, message: 'Missing required parameters!' })
                        }

                        next();
                        return;
                    }
                ]
            default:
                return (_req:Request, _res: Response, next: NextFunction) => next()
        }
    },

    /**
     * POST /stories/add
     * __Add a story to a collection__
     * @param {string} email
     * @param {string} password
     */
    addStoryToCollection: async (req:Request, res:Response) => {
        // Req data
        const { storyId, collectionId } = req.body;

        // Collection document
        const collectionDoc = await Collection.findOne({
            where: {
                id: collectionId,
                ownerId: req.currentUser.userId
            }
        });
        if (!collectionDoc) return res.status(404).json({ error: true, message: 'No collection found under given ID.' });

        // HN Item
        const itemDoc = await getItemById(storyId);
        if (!itemDoc) return res.status(404).json({ error: true, message: 'No story found under given ID.' });

        // Collection document
        const storyDoc = Story.build({
            itemId: storyId,
            collectionId: collectionId,
            title: itemDoc.title ? itemDoc.title : '',
            text: itemDoc.text ? itemDoc.text : '',
            url: itemDoc.url ? itemDoc.url : ''
        });

        // Comments
        let commentIds:number[] = [];
        if (itemDoc.childrenIds.length > 0) {
            // Has children (story => comments)
            commentIds = itemDoc.childrenIds;
        }

        try {
            const insert = await storyDoc.save();

            // Add comments to que
            if (commentIds && commentIds.length > 0) {
                console.log(commentIds)
                commentIds.forEach((commentId) => CommentQue.push({
                    commentId: commentId,
                    storyId: insert.id
                }))
            }

            return res.status(200).json({ success: true, message: 'Story added to collection successfuly.', storyId: insert.id });
        } catch (error: unknown) {
            return res.status(500).json({ error: true, message: (error instanceof Error && process.env.NODE_ENV!=='production') ? error.message : `Couldn't add story!` });
        }
    },

    /**
     * GET /stories/get-all/:collectionId
     * __Get all stories inside a collection__
     * @param {number} collectionId
     */
    getAllStoriesInCollection: async (req:Request, res:Response) => {
        // Params
        const {collectionId} = req.params;

        // Collection document
        const collectionDoc = await Collection.findOne({
            where: {
                id: collectionId,
                ownerId: req.currentUser.userId
            }
        });
        if (!collectionDoc) return res.status(404).json({ error: true, message: 'No collection found under given ID.' });
        
        // Collection documents
        const storyDocs = await Story.findAll({ 
            where: { 
                collectionId: collectionId
            } 
        });
        if (!storyDocs) return res.status(404).json({ error: true, message: 'No stories found, add some to the collection.' });
        return res.status(200).json({ success: true, stories: storyDocs });
    },

    /**
     * GET /stories/get/:storyId
     * __Get singular story /w comments__
     * @param {number} storyId
     */
    getStory: async (req:Request, res:Response) => {
        // Req data
        const {storyId} = req.params;

        // Collection document
        const storyDoc = await Story.findOne({
            where: {
                id: storyId
            }
        });
        if (!storyDoc) return res.status(404).json({ error: true, message: 'No story found under given ID.' });

        // Collection document
        const collectionDoc = await Collection.findOne({
            where: {
                id: storyDoc.collectionId,
                ownerId: req.currentUser.userId
            }
        });
        if (!collectionDoc) return res.status(404).json({ error: true, message: 'No collection found under given story ID.' });

        // Comments
        const commentsDocs = await Comment.findAll({
            where: {
                storyId: storyId
            }
        });

        // Response
        return res.status(200).json({ success: true, story: storyDoc, comments: commentsDocs ?? [] }); // @todo comments
    },

    /**
     * DELETE /stories/remove/:collectionId/:storyId
     * __Remove a story from a collection__
     * @param {number} collectionId
     * @param {number} storyId
     */
    removeStoryFromCollection: async (req:Request, res:Response) => {
        // Req data
        const {collectionId, storyId} = req.params;

        // Collection document
        const collectionDoc = await Collection.findOne({
            where: {
                id: collectionId,
                ownerId: req.currentUser.userId
            }
        });
        if (!collectionDoc) return res.status(404).json({ error: true, message: 'No collection found under given ID.' });

        try {
            // Remove Story
            await Story.destroy({
                where: {
                    id: storyId,
                    collectionId: collectionId
                }
            });

            // Return
            return res.status(200).json({ success: true, message: 'Story was removed from collection!' });
        } catch (error: unknown) {
            return res.status(500).json({ error: true, message: (error instanceof Error && process.env.NODE_ENV!=='production') ? error.message : 'Internal server error.' });
        }
    }
}

export default storiesController