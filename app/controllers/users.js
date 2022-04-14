const UserModel = require("../models/user.js");
const auth = require("../middleware/auth.js");
module.exports = class Users {
  constructor(app, connect) {
    this.app = app;
    this.UserModel = connect.model("User", UserModel);
    this.run();
  }

  postUsers() {
    this.app.post("/users/", (req, res) => {
      try {
        const userModel = new this.UserModel(req.body);
        userModel
          .save()
          .then((user) => {
            const token = user.generateAuthToken();
            res.status(200).json({ user, token } || {});
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

  postLogin() {
    try {
      const user = await this.UserModel.findByCredentials(
        req.body.email,
        req.body.password
      );
      const token = await user.generateAuthToken();
      res.status(200).json({ user, token });
    } catch (err) {
      console.error(`[ERROR] post:login -> ${err}`);
      res.status(400).json({
        code: 400,
        message: "Bad Request",
      });
    }
  }

  run() {
    this.postUsers();
    this.postLogin();
  }
};
