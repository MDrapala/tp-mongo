const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    Nom: {
      type: String,
      required: true,
    },
    Prenom: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
    Photo: {
      type: String,
      required: true,
    },
  },
  {
    collection: "user",
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
