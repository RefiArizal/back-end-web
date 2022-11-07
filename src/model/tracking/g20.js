// import ?mongoose from "mongoose";
require("../../config/mongo");
const mongoose = require("mongoose");

const collection = {
  id_user: String,
  latitude: Number,
  longitude: Number,
  id_officer: Number,
  status_login: Number,
  date: Date,
  dateOnly: String,
  pam_officer: String, //[foto petugas]
  photo_officer: String, //[foto petugas]
  photo_officer_telp_biasa: String, //[foto petugas]
  name_account: String,
  name_officer: String,
  rank_officer: String,
  name_country: String, //bendera
  photo_country: String, //bendera
  name_team: String, // [ketua tim]
  vip: String, // [nama vip]
  nrp_user: String,
  handphone: String,
  no_vehicle: String, // [plat nomor]
  type_vehicle: String, // ["motor"]
  fuel_vehicle: String,
  back_number_vehicle: String,
  bawa_penumpang: Number,
};
const DocumentSchema = mongoose.Schema(collection, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  collection: "trackG20",
});

const TrackG20 = mongoose.model("TrackG20", DocumentSchema);

module.exports = { TrackG20, collection };
