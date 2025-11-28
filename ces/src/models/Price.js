import mongoose from "mongoose";

const PriceSchema = new mongoose.Schema(
  ticketPrices: {
    Adult: { type: Number, required: true, default: 12.00, min: 0 },
    Child: { type: Number, required: true, default: 8.00, min: 0 },
    Senior: { type: Number, required: true, default: 10.00, min: 0 }
  },
  bookingFee: { type: Number, required: true, default: 1.50, min: 0 }, 
  taxRate: { type: Number, required: true, default: 0.07, min: 0, max: 1 }
  { timestamps: true }
);

export default mongoose.models.Price || mongoose.model("Price", PriceSchema);