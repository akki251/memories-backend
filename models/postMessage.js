import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
  title: String,
  message: String,
  creator: String,
  name: String,
  tags: [String],
  selectedFile: String,
  // likeCount: {
  //   type: Number,
  //   default: 0,
  // },

  likes: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const postMessage = mongoose.model('PostMessage', postSchema);

export default postMessage;
