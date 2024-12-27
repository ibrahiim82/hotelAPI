"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
// Room Controller:

const Room = require("../models/room");

module.exports = {
  list: async (req, res) => {
    const data = await res.getModelList(Room);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Room),
      data,
    });
  },

  // CRUD:

  create: async (req, res) => {

    req.body.image = []
    if(req.files) {
      for (let file of req.files){
        req.body.image.push(file.path)
      }
    }

    const data = await Room.create(req.body);

    res.status(201).send({
      error: false,
      data,
    });
  },

  read: async (req, res) => {
    const data = await Room.findOne({ _id: req.params.id });

    res.status(200).send({
      error: false,
      data,
    });
  },

  update: async (req, res) => {
    const data = await Room.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });

    res.status(202).send({
      error: false,
      data,
      new: await Room.findOne({ _id: req.params.id }),
    });
  },

  delete: async (req, res) => {
    const data = await Room.deleteOne({ _id: req.params.id });

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
    });
  },
};
