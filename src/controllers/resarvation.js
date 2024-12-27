"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
// Resarvation Controller:

const Resarvation = require("../models/resarvation");

module.exports = {
  list: async (req, res) => {
    const data = await res.getModelList(Resarvation)

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Resarvation),
      data,
    });
  },

  // CRUD:

  create: async (req, res) => {

    const {roomId, arrivalDate, departureDate} = req.body;

    const checkRoom = await Resarvation.findOne({
      roomId:roomId, 
      $nor: [
        {arrivalDate: {$gt: arrivalDate} },
        {departureDate: {$lt: departureDate} },
      ],
    })

    if(checkRoom){
      res.status(400).send({
        error: true,
        message: "Oda Dolu!"
      })
    }

    const data = await Resarvation.create(req.body)

    res.status(201).send({
      error: false,
      data,
    });
  },

  read: async (req, res) => {

    let customFilter={}

    if(!req.user.isAdmin){
      customFilter = {userId:req.body.user._id}
    }

    const data = await Resarvation.findOne({ _id: req.params.id, ...customFilter}).populate([{path:"userId",select:"username email"},{path:"roomId",select:"image price"}])

    res.status(200).send({
      error: false,
      data,
    });
  },

  update: async (req, res) => {

    if(req.user.isAdmin){
      const data = await Resarvation.updateOne({ _id: req.params.id }, req.body, {
        runValidators: true,
      });
      res.status(202).send({
        error: false,
        data,
        new: await Resarvation.findOne({ _id: req.params.id }),
      });
    } else {
      throw new Error('Admin Değilsin!')
    }
    
  },

  delete: async (req, res) => {

    const getData = await Reservation.findOne({ _id: req.params.id }).populate("roomId")

  if(req.user && getData.userId!==req.user._id){
    return res.status(404).send({
      error: true,
      message: "bunu yapmaya yetkiniz yok"
    })
  }    

  const data = await Resarvation.deleteOne({_id: req.params.id});
  if(data.deletedCount){
    const updateRoom = await Resarvation.updateOne({_id: getData.roomId},{available:true})
  }
    
    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
      updateRoom,
      message: `${req.params.id} no lu rezervasyon silinmiştir `
    });
  },
};