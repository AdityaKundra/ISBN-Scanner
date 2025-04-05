import React, { useState, useEffect } from "react";
import ISBNScanner from "./ISBNScanner";
import BookList from "./BookList";

const App = () => {
  const [books, setBooks] = useState([]);
  const [showScanner, setShowScanner] = useState(false);

  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:5001/books");
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleScanComplete = () => {
    fetchBooks();       // Refresh the list
    setShowScanner(false); // Close scanner
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📚 ISBN Book Manager</h1>
      <button style={styles.scanButton} onClick={() => setShowScanner(true)}>
        + Scan Book
      </button>

      {showScanner && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button style={styles.closeBtn} onClick={() => setShowScanner(false)}>×</button>
            <ISBNScanner onDone={handleScanComplete} />
          </div>
        </div>
      )}

      <BookList books={books} />
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
    maxWidth: "900px",
    margin: "auto",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  scanButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    display: "block",
    margin: "0 auto 30px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    position: "relative",
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "600px",
  },
  closeBtn: {
    position: "absolute",
    top: "10px",
    right: "15px",
    background: "transparent",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#000",
    fontSize: "26px",
  },
};

export default App;
