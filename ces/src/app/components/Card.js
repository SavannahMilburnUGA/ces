// Card.js: Exports a Card component to contain each movie displayed on the website
const Card = ({ children, className = "", onClick }) => {
    return (
    <div className={`border border-gray-300 shadow-sm rounded-lg p-4 bg-white ${className}`}
    onClick={onClick}
    >
        {children}
    </div>
    ); // return
}; // Card
  
export default Card;