import React, { useState, useEffect } from 'react';
import './CardBack.css';
import { fetchData } from '../../service/service';

function CardBack({ onCardClick }) {
  const [randomCards, setRandomCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);

  useEffect(() => {
    fetchRandomCards();
    const storedCards = localStorage.getItem('selectedCards');
    if (storedCards) {
      setSelectedCards(JSON.parse(storedCards));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedCards', JSON.stringify(selectedCards));
  }, [selectedCards]);

  const fetchRandomCards = async () => {
    try {
      const data = await fetchData();
      const randomIndexes = getRandomIndexes(data.length, 6);
      const randomCards = randomIndexes.map(index => data[index]);
      setRandomCards(randomCards);
    } catch (error) {
      console.error('Error fetching random cards:', error);
    }
  };

  const getRandomIndexes = (length, count) => {
    const indexes = Array.from({ length }, (_, index) => index);
    const shuffledIndexes = indexes.sort(() => Math.random() - 0.5);
    return shuffledIndexes.slice(0, count);
  };

  const handleCardClick = async (cardId) => {
    if (selectedCards.some(card => card.id === cardId)) {
      return; 
    }

    try {
      const data = await fetchData();
      const card = data.find(card => card.id === cardId);
      if (card) {
        console.log('Nueva carta seleccionada:', card);
        setSelectedCards([...selectedCards, card]);
        fetchRandomCards();
        if (typeof onCardClick === 'function') {
          onCardClick(card);
        }
      }
    } catch (error) {
      console.error('Error fetching card:', error);
    }
  };

  return (
    <div className="deck-card-container">
      {randomCards.map((card) => (
        <img
          key={card.id}
          className="card-back"
          src="https://i.ibb.co/XxrvMJ2/Reverso-Sakura.jpg"
          alt="Reverso carta de tarot sakura"
          onClick={() => handleCardClick(card.id)}
        />
      ))}
    </div>
  );
}

export default CardBack;
