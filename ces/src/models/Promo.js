import mongoose from "mongoose";

const PromoSchema = new mongoose.Schema(
  {
    promoCode: { type: String, required: true, unique: true, trim: true },
    discountPercent: { type: Number, required: true, min: [1, "Discount must be at least 1%."], max: [100, "Discount cannot exceed 100%."]},
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true }, 
    sentCount: { type: Number, default: 0 }, 
    lastSentAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.models.Promo || mongoose.model("Promo", PromoSchema);