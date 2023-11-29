import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import styles from '../styles/Home.module.css';

function Bookmarks() {
  const [data, setData] = useState([]);
  const [bookmarkedCards, setBookmarkedCards] = useState([]);

  useEffect(() => {
    // Fetch data from your API
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/jobpostings');
        const data = await response.json();
        setData(data.job_postings);
        console.log(data.job_postings);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Get bookmarked card IDs from the cookie
    const storedBookmarks = Cookies.get('bookmarkedCards');
    console.log(storedBookmarks);
    if (storedBookmarks) {
      const parsedBookmarks = JSON.parse(storedBookmarks);
      setBookmarkedCards(parsedBookmarks);
    }
  }, []);

  const handleToggleBookmark = (cardId) => {
    // Remove the specific card ID from the bookmarkedCards state
    const updatedBookmarkedCards = bookmarkedCards.filter((id) => id !== cardId);

    // Update the state and the cookie
    setBookmarkedCards(updatedBookmarkedCards);
    Cookies.set('bookmarkedCards', JSON.stringify(updatedBookmarkedCards));
  };

  const bookmarkedData = data.filter((card) => bookmarkedCards.includes(card._id));

  return (
    <div className={`${styles.profilemain}`}>
      <h2 style={{ textAlign: 'center', margin: '20px 0' }}>Bookmarked Cards</h2>
      {bookmarkedData.map((card) => (
        <div key={card._id} style={cardStyle}>
          <h3>{card.job_title}</h3>
          <p>{card.description}</p>
          <button onClick={() => handleToggleBookmark(card._id)}>
            Remove Bookmark
          </button>
        </div>
      ))}
    </div>
  );
}

// Example styles, you can adjust these to your liking
const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '16px',
  margin: '16px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

export default Bookmarks;
