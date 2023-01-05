import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter name'],
  },

  email: {
    type: String,
    required: [true, 'Please enter an email'],
  },

  password: {
    type: String,
    required: [true, 'Please enter Password'],
  },
  id: { type: String },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model('User', userSchema);

export default User;
