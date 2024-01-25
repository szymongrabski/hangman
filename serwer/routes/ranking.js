const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();
const function1 = require('../mqtt/mqttCon')

router.get('/', async (req, res) => {
    const client = new MongoClient(process.env.MONGO_URI);

    try {
        await client.connect();
        const database = client.db('app-data');
        const users = database.collection('ranking');

        const rankedUsers = await users.find().sort({ score: -1 }).toArray();
        
        res.json(rankedUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

router.get('/top5', async (req, res) => {
    const client = new MongoClient(process.env.MONGO_URI);

    try {
        await client.connect();
        const database = client.db('app-data');
        const users = database.collection('ranking');

        const top5Users = await users.find().sort({ score: -1 }).limit(5).toArray();

        res.json(top5Users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

router.put('/user', async (req, res) => {
    const client = new MongoClient(process.env.MONGO_URI);
    const { userId, username, scoreChange } = req.body;

    try {
        if (!userId || !scoreChange || !username) {
            return res.status(400).json({ message: 'Niepoprawne dane wejściowe.' });
        }

        await client.connect();
        const database = client.db('app-data');
        const users = database.collection('ranking');

        const existingUser = await users.findOne({ user_id: userId });

        if (existingUser) {
            const query = { user_id: userId };
            const updateDocument = {
                $inc: { score: scoreChange }
            };

            const result = await users.updateOne(query, updateDocument);

            if (result.modifiedCount === 1) {
                res.json({ success: true, message: 'Wynik użytkownika został zaktualizowany.' });
            } else {
                res.status(500).json({ error: 'Wystąpił błąd podczas aktualizacji wyniku użytkownika.' });
            }
        } else {
            const newUser = {
                user_id: userId,
                username: username,
                score: scoreChange
            };

            const insertResult = await users.insertOne(newUser);

            res.json({ success: true, message: 'Użytkownik został dodany do rankingu.' });
    
        }

        function1();
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

router.delete('/user/:userId', async (req, res) => {
    const client = new MongoClient(process.env.MONGO_URI);
    const userId = req.params.userId;

    try {
        if (!userId) {
            return res.status(400).json({ message: 'Niepoprawne dane wejściowe.' });
        }

        await client.connect();
        const database = client.db('app-data');
        const users = database.collection('ranking');

        const existingUser = await users.findOne({ user_id: userId });

        if (existingUser) {
            const query = { user_id: userId };
            const result = await users.deleteOne(query);

            if (result.deletedCount === 1) {
                res.json({ success: true, message: 'Użytkownik został usunięty z rankingu.' });
            } else {
                res.status(500).json({ error: 'Wystąpił błąd podczas usuwania użytkownika z rankingu.' });
            }
        } else {
            res.status(404).json({ error: 'Użytkownik o podanym identyfikatorze nie istnieje.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});


module.exports = router;
