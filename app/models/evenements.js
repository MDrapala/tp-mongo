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
    DateDeDebut: {
      type: Date,
      required: true,
    },
    DateDeFin: {
      type: Date,
      required: true,
    },
    Lieu: {
      type: String,
      required: true,
    },
    Photo: {
      type: String,
    },
  },
  {
    collection: "events",
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
