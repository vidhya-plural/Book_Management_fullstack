import React, { useState, useEffect } from 'react';
import axios from 'axios';

import libReturnImg from './images/adminimage.png'; // Import library return image

const Returnbook = () => {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [members, setMembers] = useState([]); // State for members
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIssuedBooks = async () => {
      try {
        if (selectedMember) {
          const response = await axios.get(`http://localhost:5000/books/issued?member_id=${selectedMember}`);
          setIssuedBooks(response.data);
          setError(null);
        } else {
          setIssuedBooks([]);
        }
      } catch (error) {
        console.error('Error fetching issued books:', error);
        setError('Error fetching issued books');
      }
    };

    fetchIssuedBooks();
  }, [selectedMember]);

  const handleReturnBook = async (bookId) => {
    if (window.confirm('Are you sure you want to return this book?')) {
      try {
        await axios.put(`http://localhost:5000/books/return/${bookId}`);
        setIssuedBooks(issuedBooks.filter(book => book.book_id !== bookId));
      } catch (error) {
        console.error('Error returning book:', error);
        setError('Error returning book');
      }
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/members');
      setMembers(response.data); // Update members state with fetched data
      setError(null);
    } catch (error) {
      console.error('Error fetching members:', error);
      setError('Error fetching members');
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div
      className="delete-book-container"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/background.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
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
        <img src={libReturnImg} alt="Library Return" className="card-img-top mb-4" style={{ maxWidth: '100%', height: 'auto' }} /> {/* Display library return image */}
        <h2 className="text-center mb-4">Return Book</h2>

        {/* Dropdown to select members */}
        <div className="mb-3">
          <label htmlFor="memberSelect" className="form-label">Select Member:</label>
          <select
            id="memberSelect"
            className="form-select"
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
          >
            <option value="">Select a member...</option>
            {members.map(member => (
              <option key={member.member_id} value={member.member_id}>{member.name}</option>
            ))}
          </select>
        </div>

        {/* Table to display issued books */}
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Issued To</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {issuedBooks.length > 0 ? (
              issuedBooks.map(book => (
                <tr key={book.issue_id}>
                  <td>{book.book_title}</td>
                  <td>{book.member_name}</td>
                  <td>
                    <button onClick={() => handleReturnBook(book.book_id)} className="btn btn-sm btn-outline-danger">
                      Return
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">{selectedMember ? 'No books currently issued to this member.' : 'Select a member to view issued books.'}</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Back to Dashboard button */}
        <div className="text-center mt-3">
          <button className="btn btn-outline-primary" onClick={() => window.location.href = '/dashboard'}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Returnbook;
