import React from 'react';

const colors = ['red', 'green', 'blue', 'yellow', 'purple'];

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)] || 'orange';
}

const ShoppingItemCard = ({ itemNumber }) => {
  const randomColor = getRandomColor();

  return (
    <div className="shopping-item-card">
      <div className="card-image" style={{ backgroundColor: randomColor }}></div>
      <div className="card-content">
        <div className="card-title">Item {itemNumber}</div>
        <div className="card-description">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        </div>
      </div>
    </div>
  );
};

export default ShoppingItemCard;
