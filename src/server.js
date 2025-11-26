import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectMongoDB } from './db/connectMongoDB.js';
import logger from './middleware/logger.js';
import notFoundHandler from './middleware/notFoundHandler.js';
import errorHandler from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';

dotenv.config();
const app = express();

// const PORT = process.env.PORT || 3000;

// app.use(logger);

// app.use(cors());

// app.use(express.json());

// app.use('/notes', notesRoutes);

// app.get('/notes', (req, res) => {
//   res.status(200).json({
//     message: 'Retrieved all notes',
//   });
// });

// app.get('/notes/:noteId', (req, res) => {
//   const noteId = req.params.noteId;
//   res.status(200).json({
//     message: `Retrieved note with ID: ${noteId}`,
//   });
// });

await connectMongoDB()
  .then(() => {
    console.log('MongoDB connected');

    app.use(logger);
    app.use(express.json());
    app.use(cors());

    app.use(notesRoutes);

    app.use(notFoundHandler);

    app.use(errorHandler);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

export default app;
