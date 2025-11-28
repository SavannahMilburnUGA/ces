import mongoose from "mongoose";

const PriceSchema = new mongoose.Schema(
  ticketPrices: {
    Adult: { type: Number, required: true, default: 12.00 },
    Child: { type: Number, required: true, default: 8.00 },
    Senior: { type: Number, required: true, default: 10.00 }
  },
  bookingFee: { type: Number, required: true, default: 1.50 }, 
  taxRate: { type: Number, required: true, default: 0.07 }
  { timestamps: true }
);

export default mongoose.models.Price || mongoose.model("Price", PriceSchema);