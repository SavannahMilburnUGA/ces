import mongoose from "mongoose";
const ShowtimeSchema = new mongoose.Schema(
  {
    showroom: {
      type: String,
      required: true,
      enum: ["Showroom 1", "Showroom 2", "Showroom 3"], // 3 showroom test data
    },
    dateTime: {
      type: Date,
      required: true,
    },
  },
  { _id: false }
);

const MovieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    posterUrl: { type: String, required: true },
    rating: { type: String, default: "NR" },
    description: { type: String, required: true },

    cast: { type: [String], default: [] },
    director: { type: String, default: "" },
    producer: { type: String, default: "" },

    showtimes: {
      type: [ShowtimeSchema],
      default: [], }, 
    showDate: { type: Date, required: true },
    trailerUrl: { type: String, required: true },
    genre: { type: String, required: true }
  },
   {
    timestamps: true,
  }
);

export default mongoose.models.Movie || mongoose.model("Movie", MovieSchema);
