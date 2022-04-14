const EventModel = require("../models/events.js");
const UserModel = require("../models/user.js");

module.exports = class Events {
  constructor(app, connect) {
    this.app = app;
    this.EventModel = connect.model("Event", EventModel);
    this.UserModel = connect.model("User", UserModel);
    this.run();
  }

  postEvents() {
    this.app.post("/events/", async (req, res) => {
      try {
        this.UserModel.findOne({ email: req.body.createdBy })
          .then((user) => {
            if (!user) {
              res.status(404).json("User not found");
              return;
            } else {
              req.body.createdBy = user._id;
              req.body.managers = user._id;
              const eventModelQuery = new this.EventModel(req.body);
              eventModelQuery
                .save()
                .then((event) => {
                  res.status(200).json(event || {});
                })
                .catch((err) => {
                  res
                    .status(422)
                    .json(`Save events step : ${err.message}` || {});
                });
            }
          })
          .catch((err) => {
            res.status(422).json(`Search user step : ${err.message}` || {});
          });
      } catch (err) {
        console.error(`[ERROR] post:events -> ${err}`);

        res.status(400).json({
          code: 400,
          message: `${err}`,
        });
      }
    });
  }

  getEvents() {
    this.app.get("/events/:id", async (req, res) => {
      try {
        this.EventModel.findOne({ _id: req.params.id })
          .populate("managers")
          .populate("createdBy")
          .then((event) => {
            res.status(200).json(event || "Event not found");
          })
          .catch((err) => {
            res.status(422).json(err.message || {});
          });
      } catch (err) {
        console.error(`[ERROR] post:events -> ${err}`);

        res.status(400).json({
          code: 400,
          message: `${err}`,
        });
      }
    });
  }

  putEvents() {
    this.app.put("/events/:id", (req, res) => {
      try {
        this.EventModel.findOneAndUpdate({ _id: req.params.id }, req.body, {
          new: true,
          runValidators: true,
        })
          .then((event) => {
            res.status(200).json(event || "Event not found");
          })
          .catch((err) => {
            res.status(422).json(err.message || {});
          });
      } catch (err) {
        console.error(`[ERROR] post:events -> ${err}`);
        res.status(400).json({
          code: 400,
          message: `${err}`,
        });
      }
    });
  }

  deleteEvents() {
    this.app.delete("/events/:id", (req, res) => {
      try {
        this.EventModel.findOneAndDelete({ _id: req.params.id })
          .then((event) => {
            let message = !event ? "Event not found" : "Successful Delete";
            res.status(200).json(message);
          })
          .catch((err) => {
            res.status(422).json(err.message || {});
          });
      } catch (err) {
        console.error(`[ERROR] post:events -> ${err}`);
        res.status(400).json({
          code: 400,
          message: `${err}`,
        });
      }
    });
  }

  putEventParticipants() {
    this.app.put("/events/addParticipant/:id", (req, res) => {
      try {
        this.UserModel.findOne({ email: req.body.participant })
          .then((user) => {
            if (!user) {
              res.status(404).json("User not found");
              return;
            } else {
              delete req.body.participant;
              req.body.participants = user._id;
              this.EventModel.findOneAndUpdate(
                { _id: req.params.id },
                { $addToSet: { participants: user._id } },
                {
                  new: true,
                  runValidators: true,
                }
              )
                .then((event) => {
                  res.status(200).json(event || "Event not found");
                })
                .catch((err) => {
                  res
                    .status(422)
                    .json(`Add participant step : ${err.message}` || {});
                });
            }
          })
          .catch((err) => {
            res.status(422).json(`Search user step : ${err.message}` || {});
          });
      } catch (err) {
        console.error(`[ERROR] post:events -> ${err}`);
        res.status(400).json({
          code: 400,
          message: `${err}`,
        });
      }
    });
  }

  deleteEventParticipants() {
    this.app.delete("/events/removeParticipant/:id", (req, res) => {
      try {
        this.UserModel.findOne({ email: req.body.participant })
          .then((user) => {
            if (!user) {
              res.status(404).json("User not found");
              return;
            } else {
              this.EventModel.findOneAndUpdate(
                { _id: req.params.id },
                {
                  $pull: {
                    participants: user._id,
                  },
                },
                {
                  new: true,
                  runValidators: true,
                }
              )
                .then((event) => {
                  res.status(200).json(event || "Event not found");
                })
                .catch((err) => {
                  res
                    .status(422)
                    .json(`Remove participant step : ${err.message}` || {});
                });
            }
          })
          .catch((err) => {
            res.status(422).json(`Search user step : ${err.message}` || {});
          });
      } catch (err) {
        console.error(`[ERROR] post:events -> ${err}`);
        res.status(400).json({
          code: 400,
          message: `${err}`,
        });
      }
    });
  }

  putEventManagers() {
    this.app.put("/events/addManager/:id", (req, res) => {
      try {
        this.UserModel.findOne({ email: req.body.manager })
          .then((user) => {
            if (!user) {
              res.status(404).json("User not found");
              return;
            } else {
              delete req.body.manager;
              req.body.managers = user._id;
              this.EventModel.findOneAndUpdate(
                { _id: req.params.id },
                { $addToSet: { managers: user._id } },
                {
                  new: true,
                  runValidators: true,
                }
              )
                .then((event) => {
                  res.status(200).json(event || "Event not found");
                })
                .catch((err) => {
                  res
                    .status(422)
                    .json(`Add manager step : ${err.message}` || {});
                });
            }
          })
          .catch((err) => {
            res.status(422).json(`Search user step : ${err.message}` || {});
          });
      } catch (err) {
        console.error(`[ERROR] post:events -> ${err}`);
        res.status(400).json({
          code: 400,
          message: `${err}`,
        });
      }
    });
  }

  deleteEventManagers() {
    this.app.delete("/events/removeManager/:id", (req, res) => {
      try {
        this.UserModel.findOne({ email: req.body.manager })
          .then((user) => {
            if (!user) {
              res.status(404).json("User not found");
              return;
            } else {
              this.EventModel.findOneAndUpdate(
                { _id: req.params.id },
                {
                  $pull: {
                    managers: user._id,
                  },
                },
                {
                  new: true,

                  runValidators: true,
                }
              )
                .then((event) => {
                  res.status(200).json(event || "Event not found");
                })
                .catch((err) => {
                  res
                    .status(422)
                    .json(`Remove manager step : ${err.message}` || {});
                });
            }
          })
          .catch((err) => {
            res.status(422).json(`Search user step : ${err.message}` || {});
          });
      } catch (err) {
        console.error(`[ERROR] post:events -> ${err}`);
        res.status(400).json({
          code: 400,
          message: `${err}`,
        });
      }
    });
  }

  run() {
    this.postEvents();
    this.getEvents();
    this.putEvents();
    this.deleteEvents();
    this.putEventParticipants();
    this.delEventsParticipants();
    this.putEventManager();
  }
};
