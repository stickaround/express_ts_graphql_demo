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
});

interface iPost extends Document {
  _id: String;
  title: String;
  content: String;
}

const Post = model('posts', postSchema);

export { Post, iPost };
