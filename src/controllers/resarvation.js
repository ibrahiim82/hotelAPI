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

    let customFilter={} //Bu nesne, rezervasyonları sorgularken kullanılacak ek filtrelemeleri tutacaktır. Eğer kullanıcı yönetici (admin) değilse, yalnızca o kullanıcıya ait rezervasyonlar filtrelenecek.

    if(!req.user.isAdmin){
      customFilter = {userId:req.body.user._id}
    } //Eğer gelen istekteki user objesi admin değilse (!req.user.isAdmin), o zaman customFilter nesnesine, kullanıcının kimliğini (req.body.user._id) içeren bir filtre eklenir.
    // Bu durumda, admin olmayan bir kullanıcı yalnızca kendi yaptığı rezervasyonları görebilir, diğer kullanıcıların rezervasyonlarına erişemez
    
    const data = await Resarvation.findOne({ _id: req.params.id, ...customFilter}).populate([
      {path:"userId",select:"username email"}
      ,{path:"roomId",select:"image price"}
    ])//Resarvation.findOne() metodu ile, veritabanında rezervasyonun ID'sine (req. params.id) ve ek filtrelere (...customFilter) uyan bir kayıt aranır.
    // req.params.id, URL parametrelerinden gelen rezervasyonun benzersiz ID'sini ifade eder. Eğer customFilter bir kullanıcı kimliği (userId) içeriyorsa, o zaman yalnızca bu kullanıcıya ait olan rezervasyonlar aranır.
    // Bu sorgu, belirtilen koşullara uyan tek bir rezervasyonu döndürür.

    // .populate([ { path:"userId", select:"username email" }, { path:"roomId", select:"image price" } ])
    // populate metodu, ilişkili veri alanlarını (referansları) doldurmak için kullanılır. Burada:
    // userId: Rezervasyonun sahibinin bilgileri username ve email alanlarıyla getirilir.
    // roomId: Rezervasyonun ilgili olduğu odanın image ve price bilgileri getirilir.
    // Bu, rezervasyonla ilişkili olan kullanıcı ve oda bilgilerini getirir ve sonuç olarak bu bilgiler de yanıt verisi olarak kullanıcıya sunulur.

    res.status(200).send({
      error: false,
      data,
    }); //Sorgu başarılı bir şekilde tamamlanmışsa, HTTP 200 (başarılı) yanıtı döndürülür.
        // error: false ile, hata olmadığı belirtilir.
        // data içinde, sorgudan dönen rezervasyon verisi ve ilişkili kullanıcı ile oda bilgileri yer alır.
    },  

  update: async (req, res) => {

    if(req.user.isAdmin){ //Bu satır, gelen istekteki user objesinin isAdmin olup olmadığını kontrol eder.
      const data = await Resarvation.updateOne({ _id: req.params.id }, req.body, {runValidators: true,});
      //{ _id: req.params.id }: Güncellenecek rezervasyonun ID'si, URL parametresinden (req.params.id) alınır.
      // req.body: Bu, güncellenmesi istenen yeni rezervasyon verilerini içerir. İstemciden gelen verilerle rezervasyon kaydı güncellenir.
      // { runValidators: true }: Bu seçenek, veritabanına yeni verilerin eklenmeden önce modelde tanımlı olan doğrulama kurallarının (validation) çalıştırılmasını sağlar. Yani, örneğin, bir tarih yanlış formatta girilmişse veya gerekli bir alan eksikse, MongoDB hatalı veri ile işlem yapmaz.

      res.status(202).send({
        error: false,
        data, //data: updateOne() metodunun dönüş değeri döndürülür. Bu değer, güncelleme işleminin sonuçları (örneğin, kaç kayıt güncellendi) hakkında bilgi verir.
        new: await Resarvation.findOne({ _id: req.params.id }), //güncellenmiş rezervasyon verisi geri döndürülür. 
        //! yenilenmiş veriyi tekrar getiriyoruz. updateOne metodu yeni veriyi döndürmez yani return etmez kendimiz getirmek zorundayız
      });
    } else {
      throw new Error('Admin Değilsin!')
    }//Eğer kullanıcı admin değilse, bir hata fırlatılır. Bu, admin yetkisi olmayan kullanıcıların rezervasyonları güncellemesini engellemek için yapılır.
    
  },

  delete: async (req, res) => {

    const getData = await Resarvation.findOne({ _id: req.params.id }).populate("roomId")  // Resarvation.findOne() metodu, URL'deki id parametresini (req.params.id) kullanarak belirli bir rezervasyon kaydını arar.
    // populate("roomId"): Rezervasyon kaydının roomId alanındaki oda bilgilerini de dahil etmek için populate metodu kullanılır. Böylece, rezervasyonla ilişkilendirilmiş oda bilgileri de sorguya eklenir.

  if(!req.user.isAdmin && getData.userId !== req.user._id){ //Bu kontrol, yalnızca admin kullanıcılarının ve kendi rezervasyonunu yapan kullanıcıların rezervasyonu silebilmesini sağlamak için yapılır.
    // Eğer kullanıcı admin değilse (!req.user.isAdmin) ve kullanıcı, rezervasyonu yapan kişiyle aynı kullanıcı değilse (getData.userId !== req.user._id), o zaman kullanıcının bu işlemi yapmaya yetkisi olmadığına karar verilir.

    return res.status(404).send({
      error: true,
      message: "bunu yapmaya yetkiniz yok"
    }) //Bu durumda, HTTP 404 (Not Found) hatası ile birlikte "bunu yapmaya yetkiniz yok" mesajı gönderilir.
  }    

  const data = await Resarvation.deleteOne({_id: req.params.id});
  // Eğer yukarıdaki yetki kontrolü geçilirse, Resarvation.deleteOne() metodu kullanılarak belirtilen ID'ye sahip rezervasyon kaydı veritabanından silinir.
  // deleteOne() metodu, yalnızca belirtilen ID'ye sahip bir kaydı siler ve döndürülen data nesnesinde, silme işleminin sonucu (deletedCount) bulunur.
  
  if(data.deletedCount){
    const updateRoom = await Room.updateOne({_id: getData.roomId},{available:true})
  } //Eğer deletedCount değeri 1 (veya daha büyük) ise, yani rezervasyon başarıyla silinmişse:
    // İlgili odanın durumu güncellenir. Oda, artık müsait (available: true) olarak işaretlenir.
    // Room.updateOne() metodu ile, silinen rezervasyonun odasına ait available alanı true olarak güncellenir. Bu, oda tekrar müsait duruma getirilir.
    
    res.status(data.deletedCount ? 204 : 404).send({ //Eğer data.deletedCount 1 veya daha fazla ise (yani rezervasyon başarıyla silindiyse), HTTP 204 (No Content) durumu döndürülür.
      // Bu, işlemin başarılı olduğunu ama herhangi bir içerik döndürülmediğini belirtir.
      // Eğer data.deletedCount 0 ise (yani rezervasyon bulunamadı veya silinemedi), HTTP 404 (Not Found) durumu döndürülür.
      error: !data.deletedCount,
      data,
      updateRoom,
      message: `${req.params.id} no lu rezervasyon silinmiştir `
    }); // error: Eğer silme işlemi başarısız olmuşsa (deletedCount 0 ise), true döner. Aksi halde false.
        // data: Silme işleminin sonucu (deleteOne'ın döndüğü veri) döndürülür.
        // updateRoom: Eğer oda durumu güncellenmişse, oda durumu (available: true) ile ilgili yapılan güncelleme bilgisi döndürülür.
        // message: Silinen rezervasyonun ID'si ile birlikte bir bilgi mesajı gönderilir.
  },
};