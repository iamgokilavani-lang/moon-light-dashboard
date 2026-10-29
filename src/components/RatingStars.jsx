import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({
  rating = 5,
  maxStars = 5,
  size = 16,
  interactive = false,
  onRatingChange = () => {},
  showScore = false,
  reviewCount = null
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {Array.from({ length: maxStars }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= Math.floor(displayRating);
          const isHalf = !isFilled && starValue === Math.ceil(displayRating) && displayRating % 1 !== 0;

          return (
            <button
              key={index}
              type={interactive ? "button" : undefined}
              disabled={!interactive}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              onClick={() => interactive && onRatingChange(starValue)}
              className={`transition-transform ${interactive ? 'cursor-pointer hover:scale-125' : 'cursor-default'}`}
            >
              <Star
                size={size}
                className={`${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : isHalf
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'text-slate-300 fill-slate-100'
                }`}
              />
            </button>
          );
        })}
      </div>

      {showScore && (
        <span className="text-xs font-semibold text-slate-700">
          {Number(rating).toFixed(1)}
        </span>
      )}

      {reviewCount !== null && (
        <span className="text-xs text-slate-400">
          ({reviewCount})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
