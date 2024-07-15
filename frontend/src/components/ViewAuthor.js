import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import authorImg from './images/author.jpg'; // Import author.jpg for card image

const ViewAuthor = () => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/authors');
      setAuthors(response.data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const handleDeleteAuthor = async (authorId) => {
    if (window.confirm('Are you sure you want to delete this author?')) {
      try {
        await axios.delete(`http://localhost:5000/authors/${authorId}`);
        // After successful deletion, update the authors list
        setAuthors(authors.filter(author => author.author_id !== authorId));
      } catch (error) {
        console.error('Error deleting author:', error);
      }
    }
  };

  return (
    <div
      className="delete-book-container"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/background.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        className="card shadow"
        style={{
          maxWidth: '800px',
          margin: 'auto',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        }}
      >
        <img src={authorImg} alt="Author" className="card-img-top mb-4" style={{ maxWidth: '100%', height: 'auto' }} /> {/* Adjusted image size */}
        <h2 className="text-center mb-4">View Authors</h2>

        <div className="mb-3">
          <div className="btn-group mb-3" role="group">
            <Link to="/dashboard" className="btn btn-dark me-2">
              <BsArrowLeft className="me-2" /> Back to dashboard
            </Link>
          </div>
        </div>

        <ul className="list-group">
          {authors.map(author => (
            <li key={author.author_id} className="list-group-item d-flex justify-content-between align-items-center">
              <Link to={`/authors/${author.author_id}`}>{author.name}</Link>
              <div>
                <Link to={`/authors/edit/${author.author_id}`} className="btn btn-sm btn-outline-primary me-2">
                  Edit
                </Link>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDeleteAuthor(author.author_id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ViewAuthor;
