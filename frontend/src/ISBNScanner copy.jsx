import React, { useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

const ISBNScanner = () => {
  const [scannedISBN, setScannedISBN] = useState('');
  const [bookData, setBookData] = useState(null);
  const [error, setError] = useState(null);

  const fetchBookData = async (isbn) => {
    try {
      const response = await fetch(`http://localhost:5001/fetch-book/${isbn}`);
      if (!response.ok) throw new Error('Failed to fetch book data');

      const data = await response.json();
      setBookData(data[`ISBN:${isbn}`]);
      setError(null);
    } catch (err) {
      console.error('API fetch error:', err);
      setError('Could not fetch book data');
    }
  };

  const startScan = async () => {
    const codeReader = new BrowserMultiFormatReader();
    try {
      await codeReader.decodeFromVideoDevice(undefined, 'video', (result, err) => {
        if (result) {
          const isbn = result.getText();
          setScannedISBN(isbn);
          fetchBookData(isbn);
          codeReader.reset(); // stop scanning once a result is found
        }
  
        if (err && !(err instanceof NotFoundException)) {
          console.error('Scan error:', err);
          setError('Error during scanning');
        }
      });
    } catch (err) {
      console.error('Setup error:', err);
      setError('Failed to initialize scanner');
    }
  };
  

  return (
    <div>
      <h2>ISBN Scanner</h2>
      <button onClick={startScan}>Start Scanning</button>
      <video id="video" style={{ width: '100%', maxWidth: '400px' }}></video>

      {scannedISBN && <p><strong>Scanned ISBN:</strong> {scannedISBN}</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {bookData && (
        <div>
          <h3>{bookData.title}</h3>
          <p>By: {bookData.authors?.map(author => author.name).join(', ')}</p>
          <img src={bookData.cover?.medium} alt={bookData.title} />
        </div>
      )}
    </div>
  );
};

export default ISBNScanner;
