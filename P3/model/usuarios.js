import mongoose from "mongoose";

// Esquema del subdocumento de geolocalización
const GeolocationSchema = new mongoose.Schema({
  lat: {
    type: String,
    required: true,
  },
  long: {
    type: String,
    required: true,
  },
});

// Esquema del subdocumento de dirección
const AddressSchema = new mongoose.Schema({
  geolocation: {
    type: GeolocationSchema,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  zipcode: {
    type: String,
    required: true,
  },
});

// Esquema del subdocumento del nombre
const NameSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
});

// Esquema principal para los usuarios
const UserSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: NameSchema,
    required: true,
  },
  address: {
    type: AddressSchema,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  __v: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model("users", UserSchema);
export default User;
