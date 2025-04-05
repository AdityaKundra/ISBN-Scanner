import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Book from "./models/Book.js";

const app = express();

app.use(cors());
app.use(cors({ origin: 'http://localhost:5173' }));

app.use(express.json());

mongoose.connect('mongodb+srv://aditya:<PASSWORD>@<DBNAME>.zysvtxr.mongodb.net/?retryWrites=true&w=majority&appName=<DBNAME>').then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));


    app.get('/fetch-book/:isbn', async (req, res) => {
        const { isbn } = req.params;
        const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;
      
        try {
          // 🔍 Check if already in DB
          const existingBook = await Book.findOne({ isbn });
          if (existingBook) {
            return res.status(409).json({ message: 'Book already exists', data: existingBook });
          }
      
          // 📚 Fetch from OpenLibrary if not in DB
          const response = await fetch(url);
          const data = await response.json();
      
          const bookKey = `ISBN:${isbn}`;
          const bookData = data[bookKey];
      
          if (!bookData) {
            return res.status(404).json({ error: 'Book not found from OpenLibrary' });
          }
      
          // 🧠 Prepare and save to DB
          const newBook = new Book({
            isbn: isbn,
            title: bookData.title || '',
            authors: bookData.authors?.map(a => a.name) || [],
            publish_date: bookData.publish_date || '',
            cover: bookData.cover?.medium || '',
          });
      
          const savedBook = await newBook.save();
      
          res.status(201).json({
            message: "Book fetched and saved successfully",
            data: savedBook,
          });
      
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to fetch or save book' });
        }
      });
      

app.get('/books', async (req, res) => {
    try {
        const books = await Book.find().sort({ _id: -1 }); // latest first
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(5001, () => {
    console.log(`Server running on port http://localhost:${5000}`);
});
