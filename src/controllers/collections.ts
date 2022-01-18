import { NextFunction, Request, Response } from 'express';
import { validationResult, body } from 'express-validator';

import Collection from '../models/Collections';
import Story from '../models/Stories';

const collectionsController = {
    /**
     * Validate incoming input
     * @param {string} method method name
     * @returns {NextFunction|Response}
     */
    validate: (method:string) => {
        switch (method) {
            case 'createCollection':
                return [
                    body('name').exists().notEmpty().isString(),
                    (req:Request, res:Response, next:NextFunction) => {
                        const validationErrors = validationResult(req);
                        if (!validationErrors.isEmpty()) {
                            return res.status(400).json({ error: true, message: 'Missing the collection name!' })
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
     * Create a new story collection
     * @param {Request} req 
     * @param {Response} res 
     */
    createCollection: async (req:Request, res:Response) => {
        // Req data
        const {name} = req.body;

        // Collection document
        const collectionDoc = Collection.build({
            name: name,
            ownerId: req.currentUser.userId
        });

        try {
            const insert = await collectionDoc.save();
            return res.status(200).json({ success: true, message: 'Collection created.', collectionId: insert.id });
        } catch (error: unknown) {
            return res.status(500).json({ error: true, message: (error instanceof Error && process.env.NODE_ENV!=='production') ? error.message : `Couldn't create a new collection!` });
        }
    },

    /**
     * Get all owned collections
     * @param {Request} req 
     * @param {Response} res 
     */
    getAllCollections: async (req:Request, res:Response) => {
        console.log(req.currentUser)
        // Collection documents
        const collectionDocs = await Collection.findAll({ 
            where: { 
                ownerId: req.currentUser.userId 
            } 
        });
        if (!collectionDocs) return res.status(404).json({ error: true, message: 'No collections found, create one perhaps.' });
        return res.status(200).json({ success: true, collections: collectionDocs });
    },

    /**
     * Get singular collection with its stories
     * @param {Request} req 
     * @param {Response} res 
     */
    getCollection: async (req:Request, res:Response) => {
        // Req data
        const {collectionId} = req.params;

        // Collection document
        const collectionDoc = await Collection.findOne({
            where: {
                id: collectionId,
                ownerId: req.currentUser.userId
            }
        });
        if (!collectionDoc) return res.status(404).json({ error: true, message: 'No collection found under given ID.' });

        // Stories
        const storiesDocs = await Story.findAll({
            where: {
                collectionId: collectionId
            }
        });

        // Response
        return res.status(200).json({ success: true, collection: collectionDoc, stories: storiesDocs??[] });
    },

    /**
     * Remove an existing collection
     * @param {Request} req 
     * @param {Response} res 
     */
    removeCollection: async (req:Request, res:Response) => {
        // Req data
        const {collectionId} = req.params;

        try {
            // Remove Collections
            await Collection.destroy({
                where: {
                    id: collectionId,
                    ownerId: req.currentUser.userId
                }
            });

            // Remove stories
            await Story.destroy({
                where: {
                    collectionId: collectionId
                }
            });

            // Return
            return res.status(200).json({ success: true, message: 'Collection was removed!' });
        } catch (error: unknown) {
            return res.status(500).json({ error: true, message: (error instanceof Error && process.env.NODE_ENV!=='production') ? error.message : 'Internal server error.' });
        }
    }
}

export default collectionsController