import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  ageCategory: { type: String, enum: ["child", "adult", "senior"], required: true },
  seat: { type: String, required: true }, // e.g., "A3"
});

const BookingSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
  showtime: {
    showroom: { type: String, required: true },
    dateTime: { type: Date, required: true },
  },
  userEmail: { type: String, required: true },
  userName: String,
  tickets: { type: [TicketSchema], required: true },
  totalPrice: { type: Number, required: true },
  promoCode: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);