
import Link from "next/link";
import Card from "./Card";

const Movie = ({ movie }) => {
  // Missing movie
  if (!movie) {
    return null;
  } // if

  const {
    _id,
    title = "Unknown Title",
    posterUrl = "/placeholder-poster.jpg",
    rating = "NR",
    genre = "Unknown",
    showtimes = [], // now an array of { showroom, dateTime }
  } = movie;

 
  const formattedShowtimes =
    Array.isArray(showtimes) && showtimes.length > 0
      ? showtimes.slice(0, 3).map((st) => {
          if (!st) return "";
          const showroom = st.showroom || "Showroom";
          const dt = st.dateTime ? new Date(st.dateTime) : null;
          const timeStr = dt
            ? dt.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })
            : "Time TBA";
          return `${showroom} – ${timeStr}`;
        })
      : [];

  return (
    <Card
      className="flex-shrink-0 w-70 flex flex-col hover:shadow-lg transition-shadow duration-300"
      style={{ backgroundColor: "#161A1D", borderColor: "#660708" }}
    >
      <div className="flex justify-between items-center mb-3">
        <span
          className="px-2 py-1 rounded text-xs font-semibold"
          style={{ backgroundColor: "#BA181B", color: "#F5F3F4" }}
        >
          {rating}
        </span>
        <span
          className="px-2 py-1 rounded-full text-xs"
          style={{ backgroundColor: "#660708", color: "#D3D3D3" }}
        >
          {genre}
        </span>
      </div>

      <div className="w-full h-80 relative mb-3 flex items-center justify-center">
        <img
          src={posterUrl}
          alt={title}
          className="object-cover rounded-md w-full h-full"
          onError={(e) => {
            e.target.src = "/placeholder-poster.jpg";
          }}
        />
      </div>

      <h3
        className="text-lg font-semibold mb-3 line-clamp-2"
        style={{ color: "#0B090A", fontFamily: "var(--font-archivo)" }}
      >
        {title}
      </h3>

      <div className="mb-4 flex-grow">
        <p className="text-xs mb-2" style={{ color: "#161A1D" }}>
          Showtimes:
        </p>
        <div className="flex flex-wrap gap-1">
          {formattedShowtimes.length > 0 ? (
            formattedShowtimes.map((label, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded"
                style={{ backgroundColor: "#660708", color: "#F5F3F4" }}
              >
                {label}
              </span>
            ))
          ) : (
            <span
              className="text-xs px-2 py-1 rounded"
              style={{ backgroundColor: "#660708", color: "#F5F3F4" }}
            >
              Times TBA
            </span>
          )}
        </div>
      </div>

      <Link
        href={`/movie/${_id}`}
        className="text-center px-4 py-2 rounded transition duration-200 text-sm font-medium block mt-auto"
        style={{ backgroundColor: "#BA181B", color: "#F5F3F4" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#E5383B")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#BA181B")
        }
      >
        View Details
      </Link>
    </Card>
  );
}; // Movie

export default Movie;
