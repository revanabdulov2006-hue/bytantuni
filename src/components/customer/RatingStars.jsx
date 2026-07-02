import { Star } from "lucide-react";

export default function RatingStars({ rating, reviewCount, prepTime, size = 13 }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-text-dim">
      <span className="flex items-center gap-0.5 font-medium text-text">
        <Star size={size} className="fill-accent text-accent" />
        {rating?.toFixed(1)}
      </span>
      {reviewCount != null && <span>{reviewCount} rəy</span>}
      {prepTime && <span>{prepTime}</span>}
    </div>
  );
}
