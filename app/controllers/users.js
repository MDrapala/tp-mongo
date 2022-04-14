const UserModel = require("../models/user.js");

module.exports = class Users {
  constructor(app, connect) {
    this.app = app;
    this.UserModel = connect.model("User", UserModel);
    this.run();
  }

  run() {
    this.app.post("/users/", (req, res) => {
      try {
        const userModel = new this.UserModel(req.body);
        userModel
          .save()
          .then((user) => {
            res.status(200).json(user || {});
          })
          .catch((err) => {
            console.log(err);
            res.status(200).json({});
          });
      } catch (err) {
        console.error(`[ERROR] post:users -> ${err}`);
        res.status(400).json({
          code: 400,
          message: "Bad Request",
        });
      }
    });
  }
};
