import React from "react";

const BookList = ({ books }) => {
  return (
    <div>
      <h2>📖 Saved Books</h2>
      {books.length === 0 ? (
        <p style={{ color: "#666", fontStyle: "italic" }}>No books saved yet.</p>
      ) : (
        <div style={styles.grid}>
          {books.map((book) => (
            <div key={book._id} style={styles.card}>
              <img
                src={book.cover || "https://via.placeholder.com/100x150?text=No+Cover"}
                alt={book.title}
                style={styles.cover}
              />
              <div style={styles.details}>
                <h3 style={styles.title}>{book.title}</h3>
                <p style={styles.authors}>By: {book.authors.join(", ")}</p>
                <p style={styles.date}>{book.publish_date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  cover: {
    width: "100px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "5px",
    marginBottom: "10px",
  },
  details: {
    textAlign: "center",
  },
  title: {
    fontSize: "16px",
    fontWeight: "bold",
    margin: "10px 0 5px",
  },
  authors: {
    fontSize: "14px",
    color: "#555",
  },
  date: {
    fontSize: "12px",
    color: "#888",
  },
};

export default BookList;
