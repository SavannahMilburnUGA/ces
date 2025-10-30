import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  street: String, city: String, state: String, zip: String
}, { _id: false });

const PaymentSchema = new mongoose.Schema({
  cardType: String, cardNumber: String, expiration: String, billingAddress: String
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type:String, required:true },
  email:{ type:String, required:true, unique:true, lowercase:true, trim:true },
  phone:{ type:String, required:true },
  passwordHash:{ type:String, required:true },
  promoOptIn:{ type:Boolean, default:false },
  status:{ type:String, enum:["Inactive","Active"], default:"Active" },

  homeAddress: { type: AddressSchema, required:false },
  payments: {
    type:[PaymentSchema],
    validate:{ validator:arr=>!arr || arr.length<=3, message:"At most 3 payment cards" },
    default: undefined
  },

  // Password reset (link only)
  resetPasswordTokenHash: { type:String, index:true, sparse:true },
  resetPasswordExpires:   { type:Date },
}, { timestamps:true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
