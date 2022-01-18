import APP from '../app';
import request from 'supertest';


import User from '../models/Users';
import Collection from '../models/Collections';
import Story from '../models/Stories';


// Local variables
let userId:number,
    userToken:string,
    collectionId:number,
    storyId:number;

// Auth layer test
describe('REST Authorized endpoints', () => {
    it('should return "Missing token!" and 401 on token-less request', async () => {
        const response = await request(APP)
                            .get('/collections/get-all')
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(401);
    
        expect(response.body.error).toBeTruthy()
        expect(response.body.message).toBe('Missing token!');
    })
})

// Non-auth tests
describe('REST Un-authorized endpoints', () => {
    it('should return "Invalid input data!" and 400 on empty body request', async () => {
        const response = await request(APP)
                            .post('/users/register')
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(400);

        expect(response.body.error).toBeTruthy()
        expect(response.body.message).toBe('Invalid input data!');
    })

    it('should return "User account created!" and 200 OK + a token', async () => {
        const response = await request(APP)
                            .post('/users/register')
                            .send({
                                email: 'test@test.com',
                                password: 'password'
                            })
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(200);

        expect(response.body.success).toBeTruthy();
        expect(response.body.message).toBe('User account created!');
        expect(response.body.token).toBeDefined();
        expect(response.body.userId).toBeDefined();
        userId = response.body.userId;
        userToken = response.body.token;
    })

    it('should return "This user account already exists!" and 400', async () => {
        const response = await request(APP)
                            .post('/users/register')
                            .send({
                                email: 'test@test.com',
                                password: 'password'
                            })
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(400);

        expect(response.body.error).toBeTruthy();
        expect(response.body.message).toBe('This user account already exists!');
    })
})

// Collections test
describe('REST Authorized Collections endpoints', () => {
    it('should return "Collection created." and 200 OK', async () => {
        const response = await request(APP)
                            .post('/collections/add')
                            .set('Authorization', `Bearer ${userToken}`)
                            .send({
                                name: 'Test#Collection'
                            })
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(200);
    
        expect(response.body.success).toBeTruthy()
        expect(response.body.message).toBe('Collection created.');
        expect(response.body.collectionId).toBeDefined();
        collectionId = response.body.collectionId;
    })

    it('should return "No collection found under given ID." and 404', async () => {
        const response = await request(APP)
                            .post('/stories/add')
                            .set('Authorization', `Bearer ${userToken}`)
                            .send({
                                collectionId: 9999, // Non existing ID
                                itemId: 29978723 // Microsoft to Acquire Activision Blizzard (..sigh)
                            })
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(404);
    
        expect(response.body.error).toBeTruthy()
        expect(response.body.message).toBe('No collection found under given ID.');
    })

    it('should return "No story found under given ID." and 404', async () => {
        const response = await request(APP)
                            .post('/stories/add')
                            .set('Authorization', `Bearer ${userToken}`)
                            .send({
                                collectionId: collectionId,
                                itemId: 299787234 // Non existing HN item ID
                            })
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(404);
    
        expect(response.body.error).toBeTruthy()
        expect(response.body.message).toBe('No story found under given ID.');
    })

    it('should return "Story added to collection successfuly." and 200 OK', async () => {
        const response = await request(APP)
                            .post('/stories/add')
                            .set('Authorization', `Bearer ${userToken}`)
                            .send({
                                collectionId: collectionId,
                                itemId: 29978723
                            })
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(200);
    
        expect(response.body.success).toBeTruthy()
        expect(response.body.message).toBe('Story added to collection successfuly.');
        expect(response.body.storyId).toBeDefined();
        storyId = response.body.storyId;
    })

    it('should return an array of stories in a collection and 200 OK', async () => {
        const response = await request(APP)
                            .get(`/stories/get-all/${collectionId}`)
                            .set('Authorization', `Bearer ${userToken}`)
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(200);
    
        expect(response.body.success).toBeTruthy()
        expect(response.body.stories).toBeDefined();
    })

    it('should return "Story was removed from collection!" and 200 OK', async () => {
        const response = await request(APP)
                            .delete(`/stories/remove/${collectionId}/${storyId}`)
                            .set('Authorization', `Bearer ${userToken}`)
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(200);
    
        expect(response.body.success).toBeTruthy()
        expect(response.body.message).toBe('Story was removed from collection!');
    })

    it('should return "Collection was removed!" and 200 OK', async () => {
        const response = await request(APP)
                            .delete(`/collections/remove/${collectionId}`)
                            .set('Authorization', `Bearer ${userToken}`)
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(200);
    
        expect(response.body.success).toBeTruthy()
        expect(response.body.message).toBe('Collection was removed!');
    })
})

afterAll(async () => {
    if (userId) {
        // Clear generated user
        await User.destroy({
            where: {
                id: userId
            }
        })
    }

    if (collectionId) {
        // Clear generated collection if not cleared
        await Collection.destroy({
            where: {
                id: collectionId
            }
        })
    }

    if (storyId) {
        // Clear generated story if not cleared
        await Story.destroy({
            where: {
                id: storyId
            }
        })
    }
})