const express = require('express');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const router = express.Router();
const generateAuthToken = require('../utils/helperFunctions')
const jwt = require('jsonwebtoken');

const adminPassword = "wisielec"

router.get('/', async (req, res) => {
    const client = new MongoClient(process.env.MONGO_URI);

    try {
        await client.connect();
        const database = client.db('app-data');
        const admins = database.collection('admins');

        const returnedAdmins = await admins.find().toArray();
        res.json(returnedAdmins);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});


router.post('/signup', async (req, res) => {
    const client = new MongoClient(process.env.MONGO_URI);
    const { username, verification, password } = req.body;

    const adminId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await client.connect();
        const database = client.db('app-data');
        const admins = database.collection('admins');

        const existingAdmin = await admins.findOne({ username });

        if (existingAdmin) {
            return res.status(409).send({ message: 'Nazwa admina już zajęta' });
        }

        if (adminPassword !== verification) {
            return res.status(400).send({ message: 'Niepoprawna weryfikacja' });
        }

        const data = {
            admin_id: adminId,
            username: username,
            hashed_password: hashedPassword
        };

        const insertedAdmin = await admins.insertOne(data)

        const token = generateAuthToken(adminId, process.env.JWT_SECRET, 'admin');

        res.status(201).json({ token, adminId: adminId, username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

router.post('/login', async (req, res) => {
    const client = new MongoClient(process.env.MONGO_URI);
    const { username, password } = req.body;

    try {
        await client.connect();
        const database = client.db('app-data');
        const admins = database.collection('admins');

        const admin = await admins.findOne({ username });

        if (admin) {
            const correctPassword = await bcrypt.compare(password, admin.hashed_password);
            if (correctPassword) {
                const token = generateAuthToken(admin.admin_id, process.env.JWT_SECRET, 'admin');

                res.status(200).json({ token, adminId: admin.admin_id, username });
            } else {
                res.status(400).send({ message: 'Niepoprawne hasło' });
            }
        } else {
            res.status(400).send({ message: 'Admin nie istnieje' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});


router.put('/admin', async (req, res) => {
    const client = new MongoClient(process.env.MONGO_URI);
    const updatedAdmin = req.body.updatedAdmin;
    const hashedPassword = await bcrypt.hash(updatedAdmin.password, 10)

    try {

        if (!updatedAdmin || !updatedAdmin.admin_id || !updatedAdmin.username || !updatedAdmin.password) {
            return res.status(400).json({ message: 'Niepoprawne dane wejściowe.' });
        }

        await client.connect()
        const database = client.db('app-data');
        const admins = database.collection('admins')

        const existingAdmin = await admins.findOne({ username: updatedAdmin.username });
        
        if (existingAdmin && existingAdmin.admin_id !== updatedAdmin.admin_id) {
            return res.status(409).json({ message: 'Nazwa użytkownika zajęta.' });
        }

        const query = { admin_id: updatedAdmin.admin_id }
        const updateDocument = {
            $set: {
                admin_id: updatedAdmin.admin_id,
                username: updatedAdmin.username,
                hashed_password: hashedPassword,
            }
        }
        const insertedAdmin = await admins.updateOne(query, updateDocument);
        res.status(201).json(insertedAdmin)
    } finally {
        await client.close()
    }

})


router.delete('/admin/:adminId', async (req, res) => {
    const client = new MongoClient(process.env.MONGO_URI);
    const adminId = req.params.adminId;

    try {
        if (!adminId) {
            return res.status(400).json({ message: 'Brak podanego identyfikatora admina.' });
        }

        await client.connect();
        const database = client.db('app-data');
        const admins = database.collection('admins');

        const adminToDelete = await admins.findOne({ admin_id: adminId });

        if (!adminToDelete) {
            return res.status(404).json({ message: 'Admin nie istnieje.' });
        }

        const result = await admins.deleteOne({ admin_id: adminId });

        if (result.deletedCount === 1) {
            res.json({ success: true, message: 'Admin został pomyślnie usunięty.' });
        } else {
            res.status(500).json({ error: 'Wystąpił błąd podczas usuwania admina.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

router.get('/admin/verification', async (req, res) => {
    const client = new MongoClient(process.env.MONGO_URI);

    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(404).json({ message: 'Token not found' });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const role = decodedToken.role;

        if (role === 'admin') {
            res.status(200).json({ message: 'Admin verified successfully.' });
        } else {
            res.status(404).json({ message: 'User not found or not an admin.' });
        }
    } catch (error) {
        console.error(error.name);
        if (error.name === 'JsonWebTokenError') {
            res.status(401).json({ message: 'Invalid token' }); 
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } finally {
        await client.close();
    }
});


module.exports = router;
