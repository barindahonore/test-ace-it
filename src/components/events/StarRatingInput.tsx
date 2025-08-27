import React from 'react';

interface StarRatingInputProps {
  value: string;
  onChange: (val: string) => void;
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({ value, onChange }) => {
  return (
    <div className="flex space-x-1">
      {[1,2,3,4,5].map(star => (
        <button
          key={star}
          type="button"
          className={`w-8 h-8 text-2xl focus:outline-none ${parseInt(value) >= star ? 'text-yellow-400' : 'text-gray-300'}`}
          onClick={() => onChange(star.toString())}
          aria-label={`Rate ${star}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default StarRatingInput;
