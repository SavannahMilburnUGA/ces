import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  street: { type: String, trim: true },
  city:   { type: String, trim: true },
  state:  { type: String, trim: true },
  zip:    { type: String, trim: true }
}, { _id: false });

const PaymentSchema = new mongoose.Schema({
  cardType:   { type: String, trim: true },
  cardNumber: { type: String, trim: true },
  expiration: { type: String, trim: true },
  billingAddress: { type: String, trim: true },
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name:         { type: String, trim: true, required: true },
  email:        { type: String, trim: true, lowercase: true, unique: true, required: true },
  phone:        { type: String, trim: true, required: true },
  passwordHash: { type: String, required: true },

  promoOptIn:   { type: Boolean, default: false },
  status:       { type: String, enum: ["Inactive", "Active"], default: "Inactive" },

  role:      { type: String, enum: ["user", "admin"], default: "user" },
  suspended: { type: Boolean, default: false },

  homeAddress: { type: AddressSchema, required: false },

  payments: {
    type: [PaymentSchema],
    validate: { validator: (arr) => !arr || arr.length <= 3, message: "You can store at most 3 payment cards." },
    default: undefined,
  },

  confirmationToken:    { type: String, index: true },
  confirmationCodeHash: { type: String },
  confirmationExpires:  { type: Date },

  customerId: { type: String, unique: true, sparse: true },

  lastProfileUpdate: { type: Date, default: null },

  // Forgot-password (link-only)
  resetPasswordTokenHash: { type: String, index: true, sparse: true },
  resetPasswordExpires:   { type: Date },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
