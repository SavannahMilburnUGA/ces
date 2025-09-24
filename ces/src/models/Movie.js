import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    posterUrl: { type: String, required: true },
    rating: { type: String, default: "NR" },
    description: { type: String, required: true },
    showtimes: { type: [String], default: ["2:00 PM", "5:00 PM", "8:00 PM"] },
    showDate: { type: Date, required: true },
    trailerUrl: { type: String, required: true },
    genre: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.models.Movie || mongoose.model("Movie", MovieSchema);
