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
    //üst satır gelen HTTP isteğinin req.body kısmındaki verileri alır. Burada odanın ID'si (roomId), geliş tarihi (arrivalDate) ve çıkış tarihi (departureDate) beklenmektedir. Bu veriler, kullanıcı tarafından gönderilmiş olan JSON verisi içinden çıkarılmaktadır.
    const checkRoom = await Resarvation.findOne({  //Bu satırda, MongoDB veritabanında daha önce yapılmış bir rezervasyon olup olmadığını kontrol etmek için Resarvation modelinden bir sorgu yapılır.findOne metodu, sadece bir eşleşme bulduğunda döner.
      roomId: roomId, 
      $nor: [
        {arrivalDate: {$gt: arrivalDate} },
        {departureDate: {$lt: departureDate} },
      ],
    })//roomId: roomId: Verilen oda ID'sine sahip rezervasyonları arar.
    // $nor: Bu, "ya da" koşulunun zıt anlamına gelir ve şu iki koşulun her ikisinin de sağlanmadığı rezervasyonları bulur:
    // { arrivalDate: { $gt: arrivalDate } }: Eğer rezervasyonun geliş tarihi, talep edilen geliş tarihinden sonraysa, bu kayıt arama dışında bırakılır.
    // { departureDate: { $lt: departureDate } }: Eğer rezervasyonun çıkış tarihi, talep edilen çıkış tarihinden önceyse, bu kayıt arama dışında bırakılır.
    // Yani burada yapılan şey, istenen tarihlerde oda zaten başka bir rezervasyonla doluysa, checkRoom değişkeni bir sonuç döndürecektir.

    if(checkRoom){
      res.status(400).send({
        error: true,
        message: "Oda Dolu!"
      })
    }

    const data = await Resarvation.create(req.body) //Eğer oda müsaitse (yani checkRoom boşsa), yeni bir rezervasyon eklenir.
    //Burada Resarvation.create(req.body) metodu kullanılarak, kullanıcı tarafından gönderilen req.body içindeki tüm verilerle yeni bir rezervasyon oluşturulur. Bu işlem asenkron bir işlem olduğu için await ile beklenir.
    res.status(201).send({
      error: false,
      data,
    }); //Eğer yeni rezervasyon başarıyla oluşturulursa, HTTP durumu 201 (Created) döndürülür ve oluşturulan rezervasyon verisi (data) yanıt olarak kullanıcıya gönderilir.
  },

  read: async (req, res) => {

    let customFilter={}

    if(!req.user.isAdmin){
      customFilter = {userId:req.body.user._id}
    }

    const data = await Resarvation.findOne({ _id: req.params.id, ...customFilter}).populate([
      {path:"userId",select:"username email"}
      ,{path:"roomId",select:"image price"}
    ])
    res.status(200).send({
      error: false,
      data,
    });
  },

  update: async (req, res) => {

    if(req.user.isAdmin){
      const data = await Resarvation.updateOne({ _id: req.params.id }, req.body, {runValidators: true,});

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

    const getData = await Resarvation.findOne({ _id: req.params.id }).populate("roomId")

  if(!req.user.isAdmin && getData.userId !== req.user._id){
    return res.status(404).send({
      error: true,
      message: "bunu yapmaya yetkiniz yok"
    })
  }    

  const data = await Resarvation.deleteOne({_id: req.params.id});
  if(data.deletedCount){
    const updateRoom = await Room.updateOne({_id: getData.roomId},{available:true})
  }
    
    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
      updateRoom,
      message: `${req.params.id} no lu rezervasyon silinmiştir `
    });
  },
};