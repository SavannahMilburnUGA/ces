// Movies.js: Exports relevant/matching movies as Card components
// MovieCard.js: Individual movie card component for horizontal scrolling sections
import Image from "next/image";
import Link from "next/link";
import Card from "./Card";

const Movies = ({ movie }) => {

    // Missing movie
    if (!movie) {
        return null;
    } // i 

    const {
        _id,
        title = 'Unknown Title',
        posterUrl = '/placeholder-poster.jpg',
        rating = 'NR',
        genre = 'Unknown',
        showtimes = ['Times TBA']
    } = movie;

    return (
        <Card className="flex-shrink-0 w-64 h-96 hover:shadow-lg transition-shadow duration-300">
            <div className="w-full h-48 relative mb-3">
                <Image src={posterUrl} alt={title}  fill className="object-cover rounded-md" sizes="256px" onError={(e) => {e.target.src = '/placeholder-poster.jpg';}}
            />
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-semibold">
                    {rating}
                </div>
            </div>
      
            <div className="flex flex-col h-32 justify-between">
                <div>
                    <h3 className="text-lg font-semibold mb-1 line-clamp-2">{title}</h3>
                        <div className="text-sm text-gray-600 mb-2">
                            <span className="inline-block bg-gray-100 px-2 py-1 rounded-full text-xs"> {genre} </span>
                        </div>
                </div>
                
            <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Showtimes:</p>
                <div className="flex flex-wrap gap-1"> {showtimes.slice(0, 3).map((time, index) => (
                    <span key={index} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded"> {time} </span>
                ))}
                </div>
            </div>
            <Link 
            href={`/movie/${_id}`}
            className="bg-red-600 text-white text-center px-4 py-2 rounded hover:bg-red-700 transition duration-200 text-sm font-medium"
                >
                View Details
            </Link>
            </div>
        </Card>
    );
}; // Movies

export default MovieCard;