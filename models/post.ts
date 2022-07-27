import { Schema, Document, model } from 'mongoose';

const postSchema = new Schema<iPost>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
});

interface iPost extends Document {
  _id: String;
  title: String;
  content: String;
  user_id: String;
}

const Post = model('posts', postSchema);

export { Post, iPost };
