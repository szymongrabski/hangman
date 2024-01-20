const express = require('express');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

router.get('/', async (req, res) => {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();
    const database = client.db('app-data');
    const words = database.collection('words');

    const returnedWords = await words.find().toArray();
    res.json(returnedWords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});

router.post('/add', async (req, res) => {
  const client = new MongoClient(process.env.MONGO_URI);
  const { word, category, definition } = req.body;

  const wordId = uuidv4();

  try {
    await client.connect();
    const database = client.db('app-data');
    const words = database.collection('words');

    const existingWord = await words.findOne({ word });

    if (existingWord) {
      return res.status(409).send({ message: 'Słowo już istnieje' });
    }

    const data = {
      word_id: wordId,
      word: word,
      category: category,
      definition: definition,
    };

    const insertedWord = await words.insertOne(data);

    res.status(201).json(insertedWord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});

router.put('/update/:wordId', async (req, res) => {
  const client = new MongoClient(process.env.MONGO_URI);
  const wordId = req.params.wordId;
  const { word, category, definition } = req.body;

  try {
    if (!wordId || !word || !category || !definition) {
      return res.status(400).json({ message: 'Niepoprawne dane wejściowe.' });
    }

    await client.connect();
    const database = client.db('app-data');
    const words = database.collection('words');

    const existingWord = await words.findOne({ word_id: wordId });

    if (!existingWord) {
      return res.status(404).json({ message: 'Słowo nie istnieje.' });
    }

    const query = { word_id: wordId };
    const updateDocument = {
      $set: {
        word: word,
        category: category,
        definition: definition,
      },
    };
    const result = await words.updateOne(query, updateDocument);
    res.status(201).json(result);
  } finally {
    await client.close();
  }
});

router.delete('/delete/:wordId', async (req, res) => {
  const client = new MongoClient(process.env.MONGO_URI);
  const wordId = req.params.wordId;

  try {
    if (!wordId) {
      return res.status(400).json({ message: 'Brak podanego identyfikatora słowa.' });
    }

    await client.connect();
    const database = client.db('app-data');
    const words = database.collection('words');

    const wordToDelete = await words.findOne({ word_id: wordId });

    if (!wordToDelete) {
      return res.status(404).json({ message: 'Słowo nie istnieje.' });
    }

    const result = await words.deleteOne({ word_id: wordId });

    if (result.deletedCount === 1) {
      res.json({ success: true, message: 'Słowo zostało pomyślnie usunięte.' });
    } else {
      res.status(500).json({ error: 'Wystąpił błąd podczas usuwania słowa.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});

module.exports = router;
