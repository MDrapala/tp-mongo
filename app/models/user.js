const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Schema = new mongoose.Schema(
  {
    Nom: {
      type: String,
      required: true,
      trim: true,
    },
    Prenom: {
      type: String,
      required: true,
      trim: true,
    },
    Email: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    Password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Password cannot contain 'password'");
        }
      },
    },
    Photo: {
      type: String,
      required: true,
      trim: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
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

Schema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "secret");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

Schema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ Email: email });
  if (!user) {
    throw new Error("Unable to login");
  }
  const isMatch = await bcrypt.compare(password, user.Password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};

Schema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("Password")) {
    user.Password = await bcrypt.hash(user.Password, 8);
  }
  next();
});

const User = mongoose.model("User", Schema);
module.exports = User;
