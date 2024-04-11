const request = require('supertest');
const DbOperations = require('../backend/DbOperations');
const app = require('../backend/server');
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

let mongo;
let db;

let user = {
    email: 'username',
    password: 'password',
    skills: ['gaming', 'coding'],
    "looking for": ['gamers']
};

let userID;

beforeAll(async () => {
    // mongo = await DbOperations.connect();
    // db = mongo.db();

    db = await DbOperations.getDB();

    // Add a user to the database
    const newPassword = await bcrypt.hash(user.password, 10);
    user.password = newPassword;

    const result = await db.collection('users').insertOne(user);
    user.password = 'password';

    userID = result.insertedId;
    // console.log('user id:', userID);
});

afterAll(async () => {
    // deleteeee
    await db.collection('users').deleteOne({ _id: userID });
    // await mongo.close();
    await DbOperations.closeMongoDBConnection();
});

describe('User login', () => {

    // Login user with valid username and password (success flow)
    it('User can login with correct username/password', async () => {
        const resp = await request(app)
            .post('/login')
            .send(`email=${user.email}&password=${user.password}`);
        expect(resp.status).toBe(200);
        expect(resp.type).toBe('application/json');
        expect(resp.body).toHaveProperty('apptoken')
    });

    // Login user with invalid username and password (failure flow)
    it('User can login with incorrect username/password', async () => {
        const resp = await request(app)
            .post('/login')
            .send(`email=${"joe"}&password=${"password123"}`);
        expect(resp.status).toBe(401);
        expect(resp.type).toBe('application/json');
    });

    // Login user with valid username and invalid password (failure bad authorization flow)
    it('User can login with incorrect username/password', async () => {
        const resp = await request(app)
            .post('/login')
            .send(`email=${user.email}&password=${"password123"}`);
        expect(resp.status).toBe(401);
        expect(resp.type).toBe('application/json');
    });

    // Login user with missing password (failure bad parameter flow)
    it('User can login with missing password', async () => {
        const resp = await request(app)
            .post('/login')
            .send(`email=${user.email}`);
        expect(resp.status).toBe(400);
        expect(resp.type).toBe('application/json');
        expect(resp.body).toEqual({ error: 'empty or missing password' });
    });

    // Login user with missing email (failure bad parameter flow)
    it('User can login with missing email', async () => {
        const resp = await request(app)
            .post('/login')
            .send(`password=${user.password}`);
        expect(resp.status).toBe(400);
        expect(resp.type).toBe('application/json');
        expect(resp.body).toEqual({ error: 'empty or missing email' });
    });

    // Login user with missing email and password (failure bad parameter flow)
    it('User can login with missing email', async () => {
        const resp = await request(app)
            .post('/login')
            .send();
        expect(resp.status).toBe(400);
        expect(resp.type).toBe('application/json');
        expect(resp.body).toEqual({ error: 'empty or missing email and password' });
    });
});

describe('Register', () => {

    // Registered user with a valid username and password (success flow)
    it('User can register with a valid username and password', async () => {
        const resp = await request(app)
            .post('/register')
            .send(`email=${"joey"}&password=${"password123"}`);
        expect(resp.status).toBe(201);
        expect(resp.type).toBe('application/json');
        const newUserId = resp.body.data.id;
        const hashedPassword = await bcrypt.hash('password123', 10);
        console.log({ _id: new ObjectId(newUserId), email: "joey", password: hashedPassword });
        // Check exists in db
        const newUser = await db.collection('users').findOne({ _id: new ObjectId(newUserId) });
        expect(newUser.email).toBe('joey');
        expect(await bcrypt.compare('password123', newUser.password)).toBe(true);
        // Delete the user
        await db.collection('users').deleteOne({ _id: new ObjectId(newUserId) });
    });

    // Registered user with an invalid username and password (failure flow – username does exist)
    it('User can register with an already existing email', async () => {
        const resp = await request(app)
            .post('/register')
            .send(`email=${user.email}&password=${user.password}`);
        expect(resp.status).toBe(409);
        expect(resp.type).toBe('application/json');
        expect(resp.body).toEqual({ error: 'email already exists' });
    });

    // Registered user with both invalid username and password (failure flow)

    it('User tries to register with a missing password', async () => {
        const resp = await request(app)
            .post('/register')
            .send('');
        // console.log(resp.body);
        expect(resp.status).toBe(400);
        expect(resp.type).toBe('application/json');
        expect(resp.body).toEqual({ error: 'empty or missing email and password' });
    });

    // Registered user with missing email
    it('User tries to register with a missing email', async () => {
        const resp = await request(app)
            .post('/register')
            .send(`password=${user.password}`);
        // console.log(resp.body);
        expect(resp.status).toBe(400);
        expect(resp.type).toBe('application/json');
        expect(resp.body).toEqual({ error: 'empty or missing email' });
    });

    // Registered user with missing password
    it('User tries to register with a missing password', async () => {
        const resp = await request(app)
            .post('/register')
            .send(`email=${user.email}`);
        // console.log(resp.body);
        expect(resp.status).toBe(400);
        expect(resp.type).toBe('application/json');
        expect(resp.body).toEqual({ error: 'empty or missing password' });
    });

});

describe('User profile info', () => {

    // User profile page displays name correctly (success flow)
    it('Successfully gets user page', async () => {
        const resp = await request(app)
            .get('/users/username');
        expect(resp.status).toBe(200);
        expect(resp.type).toBe('application/json');
        expect(resp.body.data).toMatchObject({
            skills: ['gaming', 'coding'],
            "looking for": ['gamers']
        });
    });

    // Displays no user found if wrong profile (failure flow)
    it('Tries to access nonexistant user', async () => {
        const resp = await request(app)
            .get('/users/nonexistant_user');
        expect(resp.status).toBe(404);
        expect(resp.type).toBe('application/json');
        expect(resp.body).toEqual({ error: 'unknown user' });
    });


    // Check that get users outputs list of all users
    it('Successfully gets list of all users', async () => {
        const resp = await request(app)
            .get('/users');
        expect(resp.status).toBe(200);
        expect(resp.type).toBe('application/json');
        expect(resp.body.data[0]).toHaveProperty('email');
    });
});

describe('Skill editing', () => {

    // update the skills (success flow)
    it('Add a new skill to the email', async () => {
        const resp = await request(app)
            .put('/users/username')
            .send({
                id: "username",
                info: [
                    {
                        key: "skills",
                        value: ["gaming", "coding", "cooking"]
                    }
                ]
            });

        expect(resp.status).toBe(200);
        expect(resp.type).toBe('application/json');

        const getUpdatedUser = await db.collection('users').findOne({ _id: new ObjectId(userID) });
        expect(getUpdatedUser.skills).toEqual(expect.arrayContaining(['gaming', 'coding', 'cooking']));
    });

    // Edit looking for (success flow)
    it('Add a new skill to the email', async () => {
        const resp = await request(app)
            .put('/users/username')
            .send({
                id: "username",
                info: [
                    {
                        key: "looking for",
                        value: ["jazz musicians"]
                    }
                ]
            });

        expect(resp.status).toBe(200);
        expect(resp.type).toBe('application/json');

        const getUpdatedUser = await db.collection('users').findOne({ _id: new ObjectId(userID) });
        expect(getUpdatedUser["looking for"]).toEqual(expect.arrayContaining(['jazz musicians']));
    });
});