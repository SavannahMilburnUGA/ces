import mongoose from "mongoose";

const priceSchema = new mongoose.Schema({
  ticketPrices: {
    Adult: { type: Number, required: true, min: 0, default: 12.00 },
    Child: { type: Number, required: true, min: 0, default: 8.00 },
    Senior: { type: Number, required: true, min: 0, default: 10.00 }},
  bookingFee: { type: Number, required: true, min: 0, default: 1.50 },
  taxRate: { type: Number, required: true, min: 0, max: 1, default: 0.07}
  }, {  
    timestamps: true
}); 

const Price = mongoose.models.Price || mongoose.model("Price", priceSchema);

export default Price;