// Card.js: Exports a Card component to contain each movie displayed on the website
const Card = ({ children, className = "" }) => {
    return (
    <div className={`border border-gray-300 shadow-sm rounded-lg p-4 bg-white ${className}`}>
        {children}
    </div>
    ); // return
}; // Card
  
export default Card;