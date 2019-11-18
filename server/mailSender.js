import { Email } from 'meteor/email'
import { Meteor } from 'meteor/meteor'
import * as myCfConfig from './cfsettings'

Meteor.methods({
    sendPDFEmail: function(thepdf ,thename, themail){
        let ownEmail = myCfConfig.myconf.emails.find((el) => el.key == 'dev').value;
        let infoEmail = myCfConfig.myconf.emails.find((el) => el.key == 'cfinfo').value;
        let centralEmail = myCfConfig.myconf.emails.find((el) => el.key == 'cfcentral').value;
        SSR.compileTemplate('htmlemailcontract', Assets.getText('htmlemailcontract.html'));
    
        Email.send({
            to: themail,
            from: "Carflet Central de Reservas <"+centralEmail+">",
            subject: "Su reserva en Carflet, "+thename+"",
            html: SSR.render('htmlemailcontract'),
            attachments: [
                {
                    filename: "Reserva_Carflet_["+thename+"].pdf",
                    type: "application/pdf",
                    content: Buffer.from(thepdf, 'base64')
                }
            ]
        });
    
        Email.send({
            to: ownEmail,
            from: "Carflet Central de Reservas <"+centralEmail+">",
            subject: "Su reserva en Carflet, "+thename+"",
            html: SSR.render('htmlemailcontract'),
            attachments: [
                {
                    filename: "Reserva_Carflet_["+thename+"].pdf",
                    type: "application/pdf",
                    content: Buffer.from(thepdf, 'base64')
                }
            ]
        });
    
        Email.send({
            to: infoEmail,
            from: "Carflet Central de Reservas <"+centralEmail+">",
            subject: "Su reserva en Carflet, "+thename+"",
            html: SSR.render('htmlemailcontract'),
            attachments: [
                {
                    filename: "Reserva_Carflet_["+thename+"].pdf",
                    type: "application/pdf",
                    content: Buffer.from(thepdf, 'base64')
                }
            ]
        });
      },


      sendEmailTideRise: function(tideToShow, subtide) {
        let ownEmail = myCfConfig.myconf.emails.find((el) => el.key == 'dev').value;
        let infoEmail = myCfConfig.myconf.emails.find((el) => el.key == 'cfinfo').value;
        let centralEmail = myCfConfig.myconf.emails.find((el) => el.key == 'cfcentral').value;
    
         switch (tideToShow) {
             case 0:
                     var emailData = {
                         newMonthYear: moment(new Date()).format("MMM YYYY"),
                         lastMonthYear: moment(new Date()).subtract('days', 5).format("MMMM"),
                         tide: subtide,
    
                     }
    
                     SSR.compileTemplate('tidesnewmonth', Assets.getText('tidesnewmonth.html'));
    
                     Email.send({
                         to: ownEmail,
                         from: "Carflet Central de Reservas <"+centralEmail+">",
                         subject: "[#Niveles]: Nuevo Mes ("+emailData.newMonthYear+")",
                         // html: SSR.render('recapemail', emailData)
                         html: SSR.render('tidesnewmonth', emailData)
                     });
    
                 break;
    
            case 1:
                    var tLow = Tides.find({level: 0}).fetch();
                    var tLowNum = tLow.threshold;
                    var tHigh = Tides.find({level: 1}).fetch();
                    var tHighNum = tHigh[0].threshold;
    
                    var emailData = {
                        newMonthYear: moment(new Date()).format("MMM YYYY"),
                        tide: tideToShow,
                        thresLow: tLowNum,
                        thresHigh: tHighNum,
                    }
    
                         SSR.compileTemplate('tidestolevel1', Assets.getText('tidestolevel1.html'));
    
                         Email.send({
                             to: ownEmail,
                             from: "Carflet Central de Reservas <"+centralEmail+">",
                             subject: "[#Niveles "+emailData.newMonthYear+"]: Nivel "+tideToShow+" alcanzado",
                             // html: SSR.render('recapemail', emailData)
                             html: SSR.render('tidestolevel1', emailData)
                         });
    
                         Email.send({
                             to: infoEmail,
                             from: "Carflet Central de Reservas <"+centralEmail+">",
                             subject: "[#Niveles]: Nuevo Mes ("+emailData.newMonthYear+")",
                             html: SSR.render('tidestolevel1', emailData)
                         });
    
                    break;
    
                    case 2:
    
                            var emailData = {
                                newMonthYear: moment(new Date()).format("MMM YYYY"),
                                tide: tideToShow,
                                thresLow: tLowNum,
                                thresHigh: tHighNum,
                            }
    
                                 SSR.compileTemplate('tidestolevel2', Assets.getText('tidestolevel2.html'));
    
                                 Email.send({
                                     to: ownEmail,
                                     from: "Carflet Central de Reservas <"+centralEmail+">",
                                     subject: "[#Niveles "+emailData.newMonthYear+"]: Nivel "+tideToShow+" alcanzado",
                                     // html: SSR.render('recapemail', emailData)
                                     html: SSR.render('tidestolevel2', emailData)
                                 });
    
                                 Email.send({
                                     to: infoEmail,
                                     from: "Carflet Central de Reservas <"+centralEmail+">",
                                     subject: "[#Niveles "+emailData.newMonthYear+"]: Nivel "+tideToShow+" alcanzado",
                                     html: SSR.render('tidestolevel2', emailData)
                                 });
    
                            break;
    
                            case 3:
    
                                    var emailData = {
                                        newMonthYear: moment(new Date()).format("MMM YYYY"),
                                        tide: tideToShow,
                                        thresLow: tLowNum,
                                        thresHigh: tHighNum,
                                    }
    
                                         SSR.compileTemplate('tidestolevel3', Assets.getText('tidestolevel3.html'));
    
                                         Email.send({
                                             to: ownEmail,
                                             from: "Carflet Central de Reservas <"+centralEmail+">",
                                             subject: "[#Niveles "+emailData.newMonthYear+"]: Nivel "+tideToShow+" alcanzado",
                                             // html: SSR.render('recapemail', emailData)
                                             html: SSR.render('tidestolevel3', emailData)
                                         });
    
                                         Email.send({
                                             to: infoEmail,
                                             from: "Carflet Central de Reservas <"+centralEmail+">",
                                             subject: "[#Niveles "+emailData.newMonthYear+"]: Nivel "+tideToShow+" alcanzado",
                                             // html: SSR.render('recapemail', emailData)
                                             html: SSR.render('tidestolevel3', emailData)
                                         });
    
                                    break;
    
                                    case 4:
    
                                            var emailData = {
                                                newMonthYear: moment(new Date()).format("MMM YYYY"),
                                                tide: tideToShow,
                                                thresLow: tLowNum,
                                                thresHigh: tHighNum,
                                            }
    
                                                 SSR.compileTemplate('tidestolevel4', Assets.getText('tidestolevel4.html'));
    
                                                 Email.send({
                                                     to: ownEmail,
                                                     from: "Carflet Central de Reservas <"+centralEmail+">",
                                                     subject: "[#Niveles "+emailData.newMonthYear+"]: Nivel "+tideToShow+" alcanzado",
                                                     // html: SSR.render('recapemail', emailData)
                                                     html: SSR.render('tidestolevel4', emailData)
                                                 });
    
                                                 Email.send({
                                                     to: infoEmail,
                                                     from: "Carflet Central de Reservas <"+centralEmail+">",
                                                     subject: "[#Niveles "+emailData.newMonthYear+"]: Nivel "+tideToShow+" alcanzado",
                                                     // html: SSR.render('recapemail', emailData)
                                                     html: SSR.render('tidestolevel4', emailData)
                                                 });
    
                                            break;
    
                                            case 5:
    
                                                    var emailData = {
                                                        newMonthYear: moment(new Date()).format("MMM YYYY"),
                                                        tide: tideToShow,
                                                        thresLow: tLowNum,
                                                        thresHigh: tHighNum,
                                                    }
    
                                                         SSR.compileTemplate('tidestolevel5', Assets.getText('tidestolevel5.html'));
    
                                                         Email.send({
                                                             to: ownEmail,
                                                             from: "Carflet Central de Reservas <"+centralEmail+">",
                                                             subject: "[#Niveles "+emailData.newMonthYear+"]: Nivel "+tideToShow+" alcanzado",
                                                             // html: SSR.render('recapemail', emailData)
                                                             html: SSR.render('tidestolevel5', emailData)
                                                         });
    
                                                         Email.send({
                                                             to: infoEmail,
                                                             from: "Carflet Central de Reservas <"+centralEmail+">",
                                                             subject: "[#Niveles "+emailData.newMonthYear+"]: Nivel "+tideToShow+" alcanzado",
                                                             // html: SSR.render('recapemail', emailData)
                                                             html: SSR.render('tidestolevel5', emailData)
                                                         });
    
                                                    break;
             // default:
    
         }
      },
    
      sendTest: function(){
        let ownEmail = myCfConfig.myconf.emails.find((el) => el.key == 'dev').value;
        let infoEmail = myCfConfig.myconf.emails.find((el) => el.key == 'cfinfo').value;
        let centralEmail = myCfConfig.myconf.emails.find((el) => el.key == 'cfcentral').value;
        Email.send({
            to: ownEmail,
            from: "Carflet Central de Reservas <"+centralEmail+">",
            subject: "[#Resumen Diario]: Actividad en Carflet",
            // html: SSR.render('recapemail', emailData)
            html: "<h2>sdfgdsfg</h2>"
        });
      },
    
      sendDailyMail: function(){
        let ownEmail = myCfConfig.myconf.emails.find((el) => el.key == 'dev').value;
        let infoEmail = myCfConfig.myconf.emails.find((el) => el.key == 'cfinfo').value;
        let centralEmail = myCfConfig.myconf.emails.find((el) => el.key == 'cfcentral').value;
          // GET YESTERDAYS DATE
          var today = moment(new Date()).toDate();
          var yesterday = moment(new Date()).add(-1, "days").toDate();
          var dummyDateIni = moment("10-30-2017", "MM-DD-YYYY").toDate();
          var dummyDateFin = moment("10-30-2017", "MM-DD-YYYY").toDate();
          var dummyDateIni = moment("10-30-2017", "MM-DD-YYYY").toDate();
          var dummyDateFin = moment("10-30-2015", "MM-DD-YYYY").toDate();
          //console.log(today);
          //console.log(yesterday);
    
          //GET RESERVAS AYER
          // var yestBookings = Bookings.find({}, {limit: 10}).fetch();
          var yestBookings = Bookings.find({createdAt: {'$gte': yesterday}},{sort:{createdAt: 1}}).fetch();
    
          var numToday = yestBookings.length;
          //console.log(numToday);
          var earnedToday = 0;
          var maxEarning = 0;
          var indexMaxEarning = 0;
    
          if(yestBookings.length > 0){
            //  console.log("entro por el if");
              //console.log(yestBookings);
              for (var i = 0; i<yestBookings.length; i++){
                  // var singleEarning = yestBookings[i].euroscarflet.replace(/[^\d.-]/g,'');
                  var singleEarning = yestBookings[i].euroscarflet;
                //  console.log("the earning");
                  // console.log(singleEarning);
    
                  if(!isNaN(singleEarning)) {
                       //do some thing if it's a number
                  //     console.log(singleEarning);
                       singleEarning = parseFloat(singleEarning);
                       earnedToday = parseFloat(earnedToday + singleEarning);
    
                       if(singleEarning > maxEarning){
                           indexMaxEarning = i;
                           maxEarning = singleEarning;
                       }
                  } else{
                       //do some thing if it's NOT a number
                  }
              }
    
    
              //
              // console.log("total");
              // console.log(earnedToday.toFixed(2));
    
              var emailData = {
                fecha: moment(yesterday).format("dddd, D [de] MMM"),
                numReservas: numToday,
                earningsToday: earnedToday.toFixed(2),
                nameFeatured: yestBookings[indexMaxEarning].nombre,
                placeFromFeatured: yestBookings[indexMaxEarning].recogida,
                placeToFeatured: yestBookings[indexMaxEarning].devolucion,
                dateFromFeatured: moment(yestBookings[indexMaxEarning].fechareco).format("dddd, D [de] MMM HH:mm"),
                dateToFeatured: moment(yestBookings[indexMaxEarning].fechadevo).format("dddd, D [de] MMM HH:mm"),
                companyFeatured: yestBookings[indexMaxEarning].company,
                tipoFeatured: yestBookings[indexMaxEarning].tipo,
              }
    
              SSR.compileTemplate('recapemail', Assets.getText('recapemail.html'));
    
              Email.send({
                  to: ownEmail,
                  from: "Carflet Central de Reservas <"+centralEmail+">",
                  subject: "[#Resumen Diario]: Actividad en Carflet ("+emailData.fecha+")",
                  // html: SSR.render('recapemail', emailData)
                  html: SSR.render('recapemail', emailData)
              });
    
              Email.send({
                  to: centralEmail,
                  from: "Carflet Central de Reservas <"+centralEmail+">",
                  subject: "[#Resumen Diario]: Actividad en Carflet ("+emailData.fecha+")",
                  // html: SSR.render('recapemail', emailData)
                  html: SSR.render('recapemail', emailData)
              });
    
          } else {
              var emailData = {
                fecha: moment(yesterday).format("dddd, D [de] MMM")
              }
    
              SSR.compileTemplate('recapemailzero', Assets.getText('recapemailzero.html'));
    
              Email.send({
                  to: ownEmail,
                  from: "Carflet Central de Reservas <"+centralEmail+">",
                  subject: "[Resumen Diario]: Actividad en Carflet ("+emailData.fecha+")",
                  // html: SSR.render('recapemail', emailData)
                  html: SSR.render('recapemail', emailData)
              });
    
          }
    
    
    
    
      },
    
      sendDummyEmail: function(){
        let ownEmail = myCfConfig.myconf.emails.find((el) => el.key == 'dev').value;
        let infoEmail = myCfConfig.myconf.emails.find((el) => el.key == 'cfinfo').value;
        let centralEmail = myCfConfig.myconf.emails.find((el) => el.key == 'cfcentral').value;
          Email.send({
              to: ownEmail,
              from: "Carflet Rent a Car <"+infoEmail+">",
              subject: "dummy nuevo",
              html: "<p>hey bro otra vez</p>"
          });
      },
});