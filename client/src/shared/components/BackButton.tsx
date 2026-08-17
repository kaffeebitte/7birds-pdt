import { ThumbsUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="absolute
        top-10
        left-10
        text-4xl
        cursor-pointer
        -rotate-90
        "
      aria-label="Go back"
    >
      <ThumbsUp size={36} className="text-bird-blue" />
      <ThumbsUp size={36} className="text-bird-blue" />
    </button>
  );
}
