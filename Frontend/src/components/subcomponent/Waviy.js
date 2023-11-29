// components/Waviy.js

import React from 'react';

const Waviy = () => {
  const letters = ['Z', 'I', 'Y', 'O', 'V', 'U', 'D', 'D', 'I', 'N'];

  return (
    <div className="waviy">
      {letters.map((letter, index) => (
        <span key={index} style={{'--i': index + 1}}>
          {letter}
        </span>
      ))}
    </div>
  );
};

export default Waviy;
