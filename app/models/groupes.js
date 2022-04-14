const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    Nom: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      required: true,
    },
    Icones: {
      type: Date,
      required: true,
    },
    Photo: {
      type: Date,
      required: true,
    },
    TypeGroupe: {
      type: String,
      required: true,
    },
    MembrePublication: {
      type: String,
      required: true,
    },
    MembreCreate: {
      type: String,
      required: true,
    },
  },
  {
    collection: "groupe",
    minimize: false,
    versionKey: false,
  }
).set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

module.exports = Schema;
