const request = require('supertest');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

const DbConnection = require('./DbConnection');
const app = require('./server');
const { authenticateUser, verifyUser } = require('./utils/auth');
const jwt = require("jsonwebtoken");

const {
  addUser,
  getUserByEmail,
  getUsers,
  getUser,
  updateUser,
  updateUserByEmail,
  searchUsersBySkill,
  searchUsers,
} = require("./DbOperations");

let db;

const user = {
    email: 'username',
    password: 'password',
    skills: ['gaming', 'coding'],
    'looking for': ['gamers'],
};

let userID;

beforeAll(async () => {
    // mongo = await DbOperations.connect();
    // db = mongo.db();

    db = await DbConnection.getDB();

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
    await DbConnection.closeMongoDBConnection();
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

    // User profile page displays name correctly (success flow) with id
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

describe('Skill searching', () => {
  it('Search for a skill', async () => {

    const resp = await request(app).get('/skill-search/drawing');

    const containsBbob = (arr) => {
      let ret = false;
      arr.forEach((item) => {
        if (item.email === 'bbob') ret = true;
      });
      return ret;
    };

    expect(resp.status).toBe(200);
    expect(resp.type).toBe('application/json');
    expect(containsBbob(resp.body.data)).toBe(true);
  });
});

describe('Auth', () => {
    it('generates a valid token for a user', async () => {
        const token = authenticateUser('username');
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
      });
      it('verifies a valid token', async () => {
        const token = authenticateUser('username');
        const user = await verifyUser(token);
        expect(user).toBeDefined();
        expect(user.email).toBe('username');
      });
      it('returns false for an invalid token', async () => {
        const invalidToken = 'invalid_token';
        const user = await verifyUser(invalidToken);
        expect(user).toBe(false);
      });
      it('returns false for a token with an invalid user', async () => {
        const token = authenticateUser('nonexistent_user');
        const user = await verifyUser(token);
        expect(user).toBe(false);
      });
      it('handles errors in token generation', async () => {
        // Mock the jwt.sign method to throw an error
        jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
          throw new Error('Token generation error');
        });
      
        const token = authenticateUser('username');
        expect(token).toBeUndefined();
      });
      it('handles errors in token verification', async () => {
        // Mock the jwt.verify method to throw an error
        jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
          throw new Error('Token verification error');
        });
      
        const token = authenticateUser('username');
        const user = await verifyUser(token);
        expect(user).toBe(false);
      });
});

describe("User search", () => {
    it('searches users by skill and returns matching users', async () => {
        const skill = 'gaming';
        const filter = (skill) => true;
        const matchingUsers = await searchUsersBySkill(skill, filter);
        expect(matchingUsers.length).toBeGreaterThan(0);
        expect(matchingUsers[0]).toHaveProperty('email');
        expect(matchingUsers[0]).toHaveProperty('skills');
      });
      it('retrieves a user by user ID', async () => {
        // Create a sample user
        const sampleUser = {
          email: 'test@example.com',
          password: 'password123',
          skills: ['JavaScript', 'Node.js'],
        };
        const insertedUser = await db.collection('users').insertOne(sampleUser);
        const userID = insertedUser.insertedId.toString();
    
        // Call the getUser function
        const retrievedUser = await getUser(userID);
    
        // Assert the retrieved user matches the sample user
        expect(retrievedUser).toMatchObject({
          _id: insertedUser.insertedId,
          email: sampleUser.email,
          password: sampleUser.password,
          skills: sampleUser.skills,
        });
    
        // Clean up the inserted user
        await db.collection('users').deleteOne({ _id: insertedUser.insertedId });
      });
});