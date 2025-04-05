import React, { useEffect, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ISBNScanner = () => {
  const [scannedISBN, setScannedISBN] = useState('');
  const [bookData, setBookData] = useState(null);
  const [bookList, setBookList] = useState([]);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  // Load existing books on mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch('http://localhost:5001/books');
      const data = await res.json();
      setBookList(data);
    } catch (err) {
      toast.error('Error fetching book list');
    }
  };

  const fetchBookData = async (isbn) => {
    try {
      const response = await fetch(`http://localhost:5001/fetch-book/${isbn}`);
      const result = await response.json();

      if (response.status === 409) {
        toast.info('Book already exists in database');
        return;
      }

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch book data');
      }

      setBookData(result.data);
      toast.success('Book saved successfully');
      fetchBooks(); // Refresh list
    } catch (err) {
      console.error('API fetch error:', err);
      toast.error(err.message || 'Could not fetch book data');
    }
  };

  const startScan = async () => {
    setIsScanning(true);
    const codeReader = new BrowserMultiFormatReader();
    try {
      await codeReader.decodeFromVideoDevice(undefined, 'video', (result, err) => {
        if (result) {
          const isbn = result.getText();
          setScannedISBN(isbn);
          fetchBookData(isbn);
          codeReader.reset();
          setIsScanning(false);
        }

        if (err && !(err instanceof NotFoundException)) {
          console.error('Scan error:', err);
          toast.error('Error during scanning');
        }
      });
    } catch (err) {
      console.error('Setup error:', err);
      toast.error('Failed to initialize scanner');
      setIsScanning(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <ToastContainer />

      <h2>📚 ISBN Book Manager</h2>

      <button onClick={startScan} style={{ padding: '0.5rem 1rem', marginBottom: '1rem' }}>
        Start Scan
      </button>

      {isScanning && (
        <div style={{
          border: '1px solid #ddd',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          background: '#f9f9f9'
        }}>
          <h4>Scanning...</h4>
          <video id="video" style={{ width: '100%', maxWidth: '400px' }}></video>
        </div>
      )}

      {bookData && (
        <div style={{ marginBottom: '2rem' }}>
          <h3>{bookData.title}</h3>
          <p><strong>Authors:</strong> {bookData.authors.join(', ')}</p>
          <img src={bookData.cover} alt={bookData.title} style={{ width: '150px' }} />
        </div>
      )}

      {/* <hr />

      <h3>📖 Book List</h3>
      {bookList.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <ul>
          {bookList.map((book) => (
            <li key={book._id}>
              <strong>{book.title}</strong> by {book.authors.join(', ')}
            </li>
          ))}
        </ul>
      )} */}
    </div>
  );
};

export default ISBNScanner;
