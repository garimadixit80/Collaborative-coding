import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  content: {
    type: String, // You can change this to `Buffer` if you want to save image blobs
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Note = mongoose.model('Note', noteSchema);

export default Note;
