import Note from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
  const page = req.query.page;
  const perPage = req.query.perPage;
  const { tag, search } = req.query;

  const filter = { userId: req.user._id };
  if (tag) filter.tag = tag;
  if (search) filter.$text = { $search: search };

  const skip = (page - 1) * perPage;

  const [totalNotes, notes] = await Promise.all([
    Note.countDocuments(filter),
    Note.find(filter).skip(skip).limit(perPage).exec(),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes,
  });
};

export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOne({ _id: noteId, userId: req.user._id });
  if (!note) {
    return next(createHttpError(404, 'Note not found'));
  }
  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const newNote = await Note.create({ ...req.body, userId: req.user._id });
  res.status(201).json(newNote);
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const deletedNote = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
  });
  if (!deletedNote) {
    next(createHttpError(404, 'Note not found'));
    return;
  }
  res.status(200).json(deletedNote);
};

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;
  const updatedNote = await Note.findOneAndUpdate(
    { _id: noteId, userId: req.user._id },
    req.body,
    { new: true },
  );
  if (!updatedNote) {
    next(createHttpError(404, 'Note not found'));
    return;
  }
  res.status(200).json(updatedNote);
};
