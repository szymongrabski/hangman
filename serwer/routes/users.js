const express = require('express');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const router = express.Router();
const generateAuthToken = require('../utils/helperFunctions')

router.get('/', async (req, res) => {
    const client = new MongoClient(process.env.MONGO_URI);

    try {
        await client.connect();
        const database = client.db('app-data');
        const users = database.collection('users');

        const returnedUsers = await users.find().toArray();
        res.json(returnedUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});


router.post('/signup', async (req, res) => {
    const client = new MongoClient(process.env.MONGO_URI);
    const { username, password } = req.body

    const userId = uuidv4()
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        await client.connect();
        const database = client.db('app-data');
        const users = database.collection('users')

        const existingUser = await users.findOne({ username })

        if (existingUser) {
            return res.status(409).send({message: 'Username już zajęty'})
        }

        const data = {
            user_id: userId,
            username: username,
            hashed_password: hashedPassword
        }

        const insertedUser = await users.insertOne(data)

        const token = generateAuthToken(userId, username, 'user')

        res.status(201).json({ token, userId: userId, username})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});


router.post('/login', async (req, res) => {
    const client = new MongoClient(process.env.MONGO_URI);
    const { username, password } = req.body

    try {
        await client.connect();
        const database = client.db('app-data');
        const users = database.collection('users')

        const user = await users.findOne({ username })

        if (user) {
            const correctPassword = await bcrypt.compare(password, user.hashed_password)
            if (correctPassword) {
                const token = generateAuthToken(user.user_id, username, 'user')

                res.status(201).json({ token, userId: user.user_id, username})
            } else {
                res.status(400).send({message: 'Niepoprawne hasło'})
            }
        } else {
            res.status(400).send({message: 'Użytkownik nie istnieje'})
        } 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

router.put('/user', async (req, res) => {
    const client = new MongoClient(process.env.MONGO_URI);
    const updatedUser = req.body.updatedUser;
    const hashedPassword = await bcrypt.hash(updatedUser.password, 10)

    try {

        if (!updatedUser || !updatedUser.user_id || !updatedUser.username || !updatedUser.password) {
            return res.status(400).json({ message: 'Niepoprawne dane wejściowe.' });
        }

        await client.connect()
        const database = client.db('app-data');
        const users = database.collection('users')

        const existingUser = await users.findOne({ username: updatedUser.username });
        
        if (existingUser && existingUser.user_id !== updatedUser.user_id) {
            return res.status(409).json({ message: 'Nazwa użytkownika zajęta.' });
        }

        const query = { user_id: updatedUser.user_id }
        const updateDocument = {
            $set: {
                user_id: updatedUser.user_id,
                username: updatedUser.username,
                hashed_password: hashedPassword,
            }
        }
        const insertedUser = await users.updateOne(query, updateDocument);
        res.status(201).json(insertedUser)
    } finally {
        await client.close()
    }

})


router.delete('/user/:userId', async (req, res) => {
    const client = new MongoClient(process.env.MONGO_URI);
    const userId = req.params.userId;

    try {
        if (!userId) {
            return res.status(400).json({ message: 'Brak podanego identyfikatora użytkownika.' });
        }

        await client.connect();
        const database = client.db('app-data');
        const users = database.collection('users');

        const userToDelete = await users.findOne({ user_id: userId });

        if (!userToDelete) {
            return res.status(404).json({ message: 'Użytkownik nie istnieje.' });
        }

        const result = await users.deleteOne({ user_id: userId });

        if (result.deletedCount === 1) {
            res.json({ success: true, message: 'Użytkownik został pomyślnie usunięty.' });
        } else {
            res.status(500).json({ error: 'Wystąpił błąd podczas usuwania użytkownika.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});



module.exports = router;
