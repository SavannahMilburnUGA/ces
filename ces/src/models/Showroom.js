import mongoose from "mongoose";

const ShowroomSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // "Showroom 1"
    rows: { type: Number, required: true }, // e.g., 6
    cols: { type: Number, required: true }, // e.g., 10
    capacity: { type: Number, required: true },
});

export default mongoose.models.Showroom || mongoose.model("Showroom", ShowroomSchema);