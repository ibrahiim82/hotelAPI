"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */

// sendMail(to, title, message)

//* EMAIL - NODEMAILER
// nmp i nodemailer
// https://www.nodemailer.com/


/*
      {
      user: 'dmrnbudxpsaxht6l@ethereal.email',
      pass: 'rprDNQDE8VSVcexf8U',
      smtp: { host: 'smtp.ethereal.email', port: 587, secure: false },
      imap: { host: 'imap.ethereal.email', port: 993, secure: true },
      pop3: { host: 'pop3.ethereal.email', port: 995, secure: true },
      web: 'https://ethereal.email',
      mxEnabled: false
      }
      */

const nodemailer = require('nodemailer')

module.exports = function (to,title,message ) {
    
    // nodemailer.createTestAccount().then((data => console.log(data)))
    
    // fake user
    // {
    // //  user: 'exoe2cg3fxqstvtf@ethereal.email',
    // //  pass: 'Dz5ArmcywUcbjTVHY2',
    //     user: 'dmrnbudxpsaxht6l@ethereal.email',
    //     pass: 'rprDNQDE8VSVcexf8U',
    //     smtp: { host: 'smtp.ethereal.email', port: 587, secure: false }, //mail gönderme hizmeti
    //     imap: { host: 'imap.ethereal.email', port: 993, secure: true }, // mail alma hizmeti
    //     pop3: { host: 'pop3.ethereal.email', port: 995, secure: true }, // mail alma hizmeti daha gelişmiş imapa göre
    //     web: 'https://ethereal.email',
    //     mxEnabled: false
    //   }
    
    // ? mailservere bağlantı yapma:

    // const transporter = nodemailer.createTransport({
    //     / SMTP Settings:
    //     host:"smtp.ethereal.email",
    //     port:587,
    //     secure:false,
    //     auth:{
    //         user:"dmrnbudxpsaxht6l@ethereal.email",
    //         pass:"rprDNQDE8VSVcexf8U"
    //     }
    // })

    // ? Sendmail
    // transporter.sendMail({
    //     from:"dmrnbudxpsaxht6l@ethereal.email",
    //     to:"yavuzyolcu82@gmail.com",
    //     subject:"hello",
    //     text:"hello there",
    //     html:"<h2>Hello there.</h2> <p>How are you?</p>"
    // }, function (error,success){
    //     / eğer gönderimde bir hata olursa error döner success null gelir
    //     / tam tersi durumda success datayı döner error boş gelir
    //     success ? console.log('SUCCESS:', success) : console.log('ERROR:', error)

    // })

    // ^ GoogleMail gmail.com
    // * Google -> AccountHome -> Security -> Two-Step-Verify -> App-Passwords

    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"yavuzyolcu82@gmail.com",
            pass:"arla gpte akoz fcvj"
        }
    })

    transporter.sendMail({
        from:"yavuzyolcu82@gmail.com", // gönderen mail ile burası eşleşmezse spama düşme olasılığı artar yazmaya gerek yok ama yazılması tavsiye edilir.
        to:to,
        subject: title,
        text:message,
        html:message
    }, function(error, success) {
        success ? console.log('SUCCESS:', success) : console.log('ERROR:', error)
    })


    //* YandexMail (yandex)
    // const transporter = nodemailer.createTransport({
    //     service: 'yandex',
    //     auth: {
    //         user: 'test@yandex.com',
    //         pass: '11' // your email-password
    //     }
    // })


}