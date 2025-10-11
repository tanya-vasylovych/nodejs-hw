// src/server.js
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Використовує PORT або 3000 за замовчуванням

// Маршрут для повернення всіх нотаток
app.get('/notes', (req, res) => {
  res.status(200).json({
    message: 'Retrieved all notes',
  });
});

// Маршрут для повернення однієї нотатки за noteId
app.get('/notes/:noteId', (req, res) => {
  const noteId = req.params.noteId;
  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
