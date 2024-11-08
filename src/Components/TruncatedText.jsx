import React, { useState } from 'react';

const TruncatedText = ({ text, maxLength }) => {
  const [isTruncated, setIsTruncated] = useState(true);

  const toggleTruncate = () => {
    setIsTruncated(!isTruncated);
  };

  const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;

  return (
    <p>
      {isTruncated ? truncatedText : text}
      {text.length > maxLength && (
        <span onClick={toggleTruncate} style={{ color: 'blue', cursor: 'pointer' }}>
          {isTruncated ? ' más' : ' menos'}
        </span>
      )}
    </p>
  );
};

export default TruncatedText;
