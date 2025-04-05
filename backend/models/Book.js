import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  isbn: String,
  title: String,
  authors: [String],
  publish_date: String,
  cover: {
    type: String,
    default: "",
  }
});

export default mongoose.model("Book", bookSchema);
