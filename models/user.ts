import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    trim: true,
  },

  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

const User = model('users', userSchema);

export { User };
