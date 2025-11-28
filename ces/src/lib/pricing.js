// lib/pricing.js to calculate order totals
export function calculateOrderTotal (tickets, prices, promoDiscount = 0) {
    const ticketSum = tickets.reduce((sum, ticket) => {
        const price = prices.ticketPrices[ticket.type] || 0;
        return sum + price;
    }, 0); // ticketSum

    // Calculate promo code discount
    const discount = ticketSum * (promoDiscount/100);

    // Find order total after promo code discount
    const ticketsMinusPromo = ticketSum - discount; 

    // Calculate tax
    const tax = (ticketsMinusPromo + prices.bookingFee) * prices.taxRate; 

    // Find overall total after taxes + booking fee
    const total = ticketsMinusPromo + tax + prices.bookingFee;

    // Return object of ticket total without promo/taxes/fees, discount, tickets after promos, booking fee, tax, and order total
    return {
        ticketSum: parseFloat(ticketSum.toFixed(2)), 
        discount: parseFloat(discount.toFixed(2)),
        ticketsMinusPromo: parseFloat(ticketsMinusPromo.toFixed(2)), 
        bookingFee: parseFloat(prices.bookingFee.toFixed(2)), 
        tax: parseFloat(tax.toFixed(2)), 
        total: parseFloat(total.toFixed(2))
    }; // return
}; /// calculateOrderTotal