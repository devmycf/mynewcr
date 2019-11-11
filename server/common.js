// Meteor.publish('bookings',function(){
// //console.log("server", Talk.find().count());
// return Bookings.find();
// });
import { Email } from 'meteor/email'
import { Meteor } from 'meteor/meteor'
import * as myCfConfig from './cfsettings'

Meteor.publish("bookings", function(){
    return Bookings.find();
});

Meteor.publish("ciudades", function(){
    return Ciudades.find();
});

Meteor.publish("contacts", function(){
    return Contacts.find();
});

Meteor.publish("updates", function(){
    return Updates.find();
});

Meteor.publish("helpersfactura", function(){
    return HelpersFactura.find();
});

Meteor.publish("flota", function(){
    return Flota.find();
});

Meteor.publish("oficinas", function(){
    return Oficinas.find();
});

Meteor.publish("incomes", function(){
    return Incomes.find();
});

Meteor.publish("enterprises", function(){
    return Enterprises.find();
});

Meteor.publish("devexpenses", function(){
    return DevExpenses.find();
});

Meteor.publish("activities", function(){
    return Activities.find({}, {limit: 30});
});

Meteor.publish("workers", function(){
    return Workers.find();
});

Meteor.publish("presupuestos", function(){
    return Presupuestos.find();
});

Meteor.publish("tareasworkers", function(){
    return TareasWorkers.find();
});

Meteor.publish("tides", function(){
    return Tides.find();
});

Meteor.publish("comisionables", function(){
    return Comisionables.find();
});

Meteor.publish("llaves", function(){
  return Llaves.find();
});

Meteor.publish("invoices", function(){
  return Invoices.find();
});

Meteor.publish("multas", function(){
  return Multas.find();
});


Meteor.startup(function () {
    var everyHour = new Cron(function() {
        console.log("it is 30 minutes past the hour");
        Meteor.call("catchNewBookings");
        // Meteor.call("sendDummyEmail");
    }, {
        minute: 30
    });

    var everyDay = new Cron(function() {
    console.log("it is 24 minutes past the hour");
        Meteor.call("sendDailyMail");
        // Meteor.call("sendEmailTideRise", 0);
    }, {
        minute: 15,
        hour: 0
    });

    var onceEveryMonth = new Cron(function() {
        Meteor.call("sendEmailTideRise", 0, 4);
    }, {
        minute: 15,
        hour: 0,
        day: 1
    });

    // var everyHour = new Cron(function() {
    //     console.log("it is 30 minutes past the hour");
    //     Meteor.call("sendDailyMail");
    //     // Meteor.call("sendDummyEmail");
    // }, {
    //     minute: 30
    // });
    console.log("hey");
    let myemauk = myCfConfig.myconf.emails.find((el) => el.key == 'dev').value;
    console.log(myemauk);
 });


  temporaryFiles.allow({
    insert: function (userId, file) {
      return true;
    },
    remove: function (userId, file) {
      return true;
    },
    read: function (userId, file) {
      return true;
    },
    write: function (userId, file, fields) {
      return true;
    }
  });


Meteor.methods({

  // liquidarComisionable: function(fecha, id) {
  //   console.log(fecha);
  //   console.log("en servidor!");
  //   console.log(new Date());
  //   Comisionables.update({_id: id}, {$set: {pendienteLiquidar: false, lastLiquidacion: new Date()}});
  // },

  makeTheKeys: function(theId, theName) {
    var numKeys = 3;
    for(var i = 0; i<numKeys; i++){
      Llaves.insert({
        idFlota: theId,
        nameFlota: theName,
        ordinalInFlota: (i+1),
        locationName: "-",
        locationId: "-"
      });
    }
  },

  updateKeyLoc: function(theid, theLoc, theLocN){
    Llaves.update({'_id': theid}, {$set: {'locationName': theLocN, 'locationId': theLoc}});
  },

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

  updateCityForComi: function(myId, myCity){
    Comisionables.update({_id:myId}, {$set: {ciudad: myCity}});
  },

  pushCompanyPresup: function(preId, the_company){
    Presupuestos.update({_id: preId}, {$set: {company: the_company}});
  },

  updateLastLiquidacionDate: function(comiId, laFecha){
    Comisionables.update({_id: comiId}, {$set: {lastLiquidacion: laFecha}});
  },

  updateLastITV: function(carName, laFecha){
    Flota.update({nombreCoche: carName}, {$set: {lastITV: laFecha}});
  },

  updateOilChange: function(carName, km) {
    Flota.update({nombreCoche: carName}, {$set: {oilChange: km}});
  },

  updateDamage: function(carName, dam) {
    Flota.update({nombreCoche: carName}, {$set: {damages: dam}});
  },

  insertTask:function(taskjson){
    TareasWorkers.insert({'type': taskjson.type, 'worker': taskjson.worker, 'tarea': taskjson.tarea, 'precio': taskjson.precio, 'coche': taskjson.coche, 'comments': taskjson.comments, 'ciudad': taskjson.ciudad, 'fecha': taskjson.fecha});
  },

  pushCosteTask: function(myid, newCoste){
        TareasWorkers.update(myid, {
           $set: {precio: newCoste},
        });
  },

  pushMatricula: function(myid, newM){
        Bookings.update(myid, {
           $set: {matribooking: newM},
        });
  },


  setWorkerInactive: function(id){
    Workers.update({_id: id}, {$set: {isActive: false}});
  },

  setWorkerActive: function(id){
    Workers.update({_id: id}, {$set: {isActive: true}});
  },

  assignRecoWorker: function(idMyBooking, idWorker, nameWorker){
    Bookings.update({_id: idMyBooking}, {$set: {recoworker: nameWorker, recoworkerId: idWorker}});
  },

  resetComisionPerson: function(theBookingId, comiDate){
    Bookings.update({_id: theBookingId}, {$set: {isComissioned: false, comisionPerson: "", comisionEuros: 0, comisionId: "", comisionDate: comiDate}});
  },

  assignComisionPerson: function(idMyBooking, idComi, nameComi, dateComi){
    Bookings.update({_id: idMyBooking}, {$set: {isComissioned: true, comisionPerson: nameComi, comisionId: idComi, comisionDate: dateComi}});
    Comisionables.update({_id: idComi}, {$set: {pendienteLiquidar: true}});
  },

  resetRecoWorker: function(theBookingId){
    Bookings.update({_id: theBookingId}, {$set: {recoworker: "", recoworkerId: ""}});
    TareasWorkers.remove({idBooking: theBookingId, type: "Entrega"});
  },

  resetDevoWorker: function(theBookingId){
    Bookings.update({_id: theBookingId}, {$set: {devoworker: "", devoworkerId: ""}});
    TareasWorkers.remove({idBooking: theBookingId, type: "Recogida"});
  },

  updateRecoDevoWorker: function(idTarea, idWorker, nameWorker) {
    TareasWorkers.update({_id: idTarea}, {$set: {worker: nameWorker}});
  },

  insertRecoWorker: function(mybooking, idWorker, nameWorker) {
    var tarea = "Entrega del "+mybooking.company+" de "+mybooking.nombre+" en "+mybooking.recogida+"";
    TareasWorkers.insert({'type': 'Entrega', 'worker': nameWorker, 'tarea': tarea, 'idBooking': mybooking._id, 'nameBooking': mybooking.nombre, 'precio': 7.5, 'coche': mybooking.company, 'fecha': mybooking.fechareco});
  },

  insertDevoWorker: function(mybooking, idWorker, nameWorker) {
    var tarea = "Recogida del "+mybooking.company+" de "+mybooking.nombre+" en "+mybooking.recogida+"";
    TareasWorkers.insert({'type': 'Recogida', 'worker': nameWorker, 'tarea': tarea, 'idBooking': mybooking._id, 'nameBooking': mybooking.nombre, 'precio': 7.5, 'coche': mybooking.company, 'fecha': mybooking.fechadevo});
  },

  assignDevoWorker: function(idBooking, idWorker, nameWorker){
    Bookings.update({_id: idBooking}, {$set: {devoworker: nameWorker, devoworkerId: idWorker}});
  },

  setTides: function(first, second, third, forth, fifth){
      Tides.update({level: 1},{$set: {threshold: first},});
      Tides.update({level: 2},{$set: {threshold: second},});
      Tides.update({level: 3},{$set: {threshold: third},});
      Tides.update({level: 4},{$set: {threshold: forth},});
      Tides.update({level: 5},{$set: {threshold: fifth},});
  },

  addNewExpense: function(theNewExpense, theNewConcept){
      var theYear = moment(new Date()).format("YYYY").toString();
      var theMonth = parseInt(moment(new Date()).format("MM")).toString();

      DevExpenses.insert({'year': theYear, 'month': theMonth, 'amount': theNewExpense, 'concept': theNewConcept});
  },

  sendEmailTideRise: function(tideToShow, subtide) {
    let ownEmail = myCfConfig.myconf.emails.find((el) => el.key == 'dev').value;
    let infoEmail = myCfConfig.myconf.emails.find((el) => el.key == 'cfinfo').value;
    let centralEmail = myCfConfig.myconf.emails.find((el) => el.key == 'cfcentral').value;
     console.log("nuevo nivel");
     // tideToShow = 0;
     // subtide = 3;
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
      console.log(today);
      console.log(yesterday);

      //GET RESERVAS AYER
      // var yestBookings = Bookings.find({}, {limit: 10}).fetch();
      var yestBookings = Bookings.find({createdAt: {'$gte': yesterday}},{sort:{createdAt: 1}}).fetch();

      var numToday = yestBookings.length;
      console.log(numToday);
      var earnedToday = 0;
      var maxEarning = 0;
      var indexMaxEarning = 0;

      if(yestBookings.length > 0){
          console.log("entro por el if");
          console.log(yestBookings);
          for (var i = 0; i<yestBookings.length; i++){
              // var singleEarning = yestBookings[i].euroscarflet.replace(/[^\d.-]/g,'');
              var singleEarning = yestBookings[i].euroscarflet;
              console.log("the earning");
              // console.log(singleEarning);

              if(!isNaN(singleEarning)) {
                   //do some thing if it's a number
                   console.log(singleEarning);
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

  pushCoste: function(myid, newCoste){
        Bookings.update(myid, {
           $set: {costeCoche: newCoste},
        });
  },

  pushCostePresup: function(myid, newCoste){
        Presupuestos.update(myid, {
           $set: {costepre: newCoste},
        });
  },

  pushObserv: function(myid, newCoste){
        Presupuestos.update(myid, {
           $set: {observaciones: newCoste},
        });
  },

  pushprecioPresup: function(myid, newCoste){
        Presupuestos.update(myid, {
           $set: {cotizacion: newCoste},
        });
  },

  pushImporteMulta: function(myid, newCoste){
        Multas.update(myid, {
           $set: {importe: newCoste},
        });
  },

  pushLocalizador: function(myid, newLocalizador){
        Bookings.update(myid, {
           $set: {localizador: newLocalizador},
        });
  },

  pushComision: function(myid, newComision){
        Bookings.update(myid, {
           $set: {comisionEuros: newComision},
        });
  },

  pushPending: function(myid, newPending){
      Bookings.update(myid, {
         $set: {qtyPendiente: newPending},
      });
  },

  pushCarBooking: function(myid, mycar, username){
      Bookings.update(myid._id, {
         $set: {company: mycar},
      });

      Activities.insert({
          "time": new Date(),
          "isPublic": true,
          "author": username,
          "type": 5,
          "desc": username + " asignó "+mycar+" para la reserva de "+myid.nombre+" del "+moment(myid.createdAt).format("DD-MMM")+"",
          "nombreBooking": myid.nombre,
          "fechaBooking": myid.createdAt,
          "recoBooking": myid.recogida,
          "devoBooking": myid.devolucion
      });


  },

  // FROM HERE TO BOTTOM IS OLDER THAN 1.4

  catchNewBookings: function(err, resp){
    //console.log('me han llamado en el servidor');
    var updates = Updates.find().fetch()
    var lastUpdateID = updates[0].myID;

    let hostInfo = {
      "host": myCfConfig.myconf.sqlconfig.host,
      "user": myCfConfig.myconf.sqlconfig.usr,
      "pass": myCfConfig.myconf.sqlconfig.pwd,
      "db": myCfConfig.myconf.sqlconfig.db,
    }
    //lastUpdateID = 1155;
    //console.log(lastUpdateID);

    function getPrecioCobrado(reserva, resDB){
      //console.log('me han llamado para dar el precio cobrado');
      if(resDB.totpaid == undefined){
            reserva.euroscarflet = resDB.order_total;
      } else {
            reserva.euroscarflet = resDB.totpaid;
      }
      return reserva;
    }

    function getClienteInfo(reserva, resDB){
      //Función para coger toda la información relativa al cliente
      //console.log('me han llamado para dar informacion del cliente');

      //var testing = resDB.custdata.split(/[\s:]+/);
      var testing = resDB.custdata.split(/Name:|Nombre:|Last Name:|Apellidos:|e-Mail:|Phone:|Teléfono:|\n/g);

      reserva.nombre = testing[1] + testing[3];
      reserva.emailCliente = testing[5];
      reserva.telefonoCliente = testing[7];

      return reserva;
    }

    function getMomentoRecoDevo(reserva, resDB){
      console.log('me han llamado para trastear con fechas');
      //var momentoReco = moment((resDB.ritiro)*1000).format("DD MMM YYYY hh:mm a");
      //var momentoReco = moment((resDB.ritiro)*1000, "DD MMM YYYY hh:mm a", true).format();
      var momentoReco = new Date(moment((resDB.ritiro)*1000));
      // var momentoReco = moment((resDB.ritiro)*1000).format("YYYY-mm-ddTHH:MM:ssZ");
      console.log(momentoReco);
      reserva.fechareco = momentoReco;

      var momentoDevo = new Date(moment((resDB.consegna)*1000));
      console.log(momentoDevo);
      reserva.fechadevo = momentoDevo;

      var momentoHecha = new Date(moment((resDB.ts)*1000));
      console.log(momentoHecha);
      reserva.fechaReserva = momentoHecha;
      reserva.notas = resDB.coupon;

      return reserva;
    }

    function getLugaresInfo(reserva, resDB, con){
      console.log('me han llamado para ver lugares');

      //Coger id de recogida
      var idLugarReco = resDB.idplace;
      //console.log(idLugarReco);
      //console.log(reserva.nombre);


      con.query('SELECT `name` FROM `carf_vikrentcar_places` WHERE id = ?', idLugarReco, function(err, rows){
        //console.log(rows[0].name);
        reserva.recogida = rows[0].name;

        var idLugarDevo = resDB.idreturnplace;

        con.query('SELECT `name` FROM `carf_vikrentcar_places` WHERE id = ?', idLugarDevo, function(err, rows){
          console.log(rows[0].name);
          reserva.devolucion = rows[0].name;
          insertIntoDB(reserva);
        });


      });
    }

    function getTarifaInfo(reserva, resDB,con){
      console.log('me han llamado para ver tarifas');


      //Coger idtar de la reserva
      var idTarifa = resDB.idtar;
      var idPrecio = "";

      //Coger clave de precio de la tabla DISPCOST
      con.query('SELECT `idprice` FROM `carf_vikrentcar_dispcost` WHERE id = ?', idTarifa, function(err, rows){
          idPrecio = rows[0].idprice;
          //console.log(idPrecio);

          con.query('SELECT `name` FROM `carf_vikrentcar_prices` WHERE id = ?', idPrecio, function(err, rows){
              var nombreTarifa = rows[0].name;
              //console.log(nombreTarifa);
              reserva.tarifa = nombreTarifa;
              getLugaresInfo(reserva, resDB, con);

          });
      });

    }

    function getCocheInfo(reserva, resDB, con){
        console.log('me han llamado para dar la info del coche');
        // Check options 
        //Hay que coger la clave del coche de la reserva

        //Coger clave del coche la reserva
        var idCoche = resDB.idcar;
        if(idCoche == 18 || idCoche == 64){
          //Se ha hecho con el coche para cobrar
          if(idCoche == 18 || idCoche == 64){
            console.log('vehiculo de alquiler');
            reserva.tipo = "Vehiculo de alquiler";
          }else {
            console.log('transfer');
            reserva.tipo = "Transfer Aeropuerto Madrid";
          }
          reserva.tarifa = "Personalizada";
          reserva.euroscarflet = 0;
          getLugaresInfo(reserva, resDB, con);
        } else {
              console.log('coche normal');
              var idCategoria = "";
              console.log(idCoche);

              //Coger clave de categoria de con el id del coche
              con.query('SELECT `idcat` FROM `carf_vikrentcar_cars` WHERE id = ?', idCoche, function(err, rows){
                idCategoria = rows[0].idcat;
                //console.log('su categoria es');
                var nombreCategoria = '';

                  //Coger el nombre de la categoria con el id de la categoria
                  con.query('SELECT `name` FROM `carf_vikrentcar_categories` WHERE id = ?', idCategoria, function(err, rows, nombreCategoria){
                    nombreCategoria = rows[0].name;
                    reserva.tipo = nombreCategoria;
                    console.log(nombreCategoria);
                    console.log(reserva);
                    getTarifaInfo(reserva, resDB, con);
                  });

              });
        }

    }

    function getOptionsInfo(reserva, resDB, con) {
        let allOptions = "";
        let optionsInNotes = "";
        con.query('SELECT * FROM `carf_vikrentcar_optionals`', function(err, rows){
          allOptions = rows.map((opt) =>  ({
            "name": opt.name,
            "id": opt.id,
            "cost": opt.cost
          }));


          let myOpts = resDB.optionals.slice(0, -1).split(";").map((element) => ({
            "id": element.split(":")[0],
            "qty": element.split(":")[1]
          }));
          myOpts.forEach((singleOption) => {
            //get Optional
            let currOpt = allOptions.find((ele) => { return ele.id == singleOption.id});
            let currOptName = currOpt.name;
            let currOptQty = singleOption.qty;
            optionsInNotes = optionsInNotes + currOptName + " x"+singleOption.qty+ " ("+parseInt(currOpt.cost) * parseInt(singleOption.qty)+"€/dia), ";  
          });

          optionsInNotes = optionsInNotes.slice(0, -1);
          optionsInNotes = optionsInNotes.slice(0, -1);

          reserva.notas = reserva.notas + optionsInNotes

          getCocheInfo(reserva, resDB, con)
        });

    }

    function insertIntoDB(reserva){
      //console.log('quieren que meta algo en la BD');
      var Fiber = Npm.require('fibers');
      Fiber(function () {
       Bookings.insert({
         "factura": "SI",
         "procedencia": reserva.procedencia,
         "nombre": reserva.nombre,
         "emailCliente": reserva.emailCliente,
         "telefonoCliente": reserva.telefonoCliente,
         "company": "Concretar",
         "tipo": reserva.tipo,
         "tarifa": reserva.tarifa,
         "recogida": reserva.recogida,
         "fechareco": reserva.fechareco,
         "devolucion": reserva.devolucion,
         "fechadevo": reserva.fechadevo,
         "supdevolucion": "0",
         "supgps": "0",
         "suptransfer": "0",
         "eurosprocedencia": "0",
         "pagada": true,
         "eurosproveedor": "0",
         "userName": "web",
         "euroscarflet": reserva.euroscarflet,
         "notas": reserva.notas,
         "createdAt": reserva.fechaReserva,
         "numRegistro": 0,
         "dias": 2
       }, function(error) {
          if(error)
             console.log(error);
        });

        Updates.remove({});
        Updates.insert({
          "fecha": new Date(),
          "myID": reserva.myID
          //"myID": 1206
        }, function(error) {
           if(error)
              console.log(error);
         });
      }
      //Meteor.call('setLastOrderTime');
    ).run();


    }

    //Conectar a base de datos
    Future = Npm.require('fibers/future');
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
      host     : hostInfo.host,
      user     : hostInfo.user,
      password : hostInfo.pass,
      database : hostInfo.db
    });

    console.log("conectando");
    console.log(connection.host);

    connection.connect(function(err) {
      if (err) {
        console.error('error connecting: ' + err.stack);
        return;
      }

      console.log('connected as id ' + connection.threadId);
      return connection;
    });

    //Elegir todas las reservas posteriores al 1 de Junio y con status de Confirmada

    var confirmed = 'confirmed';

    connection.query('SELECT * FROM `carf_vikrentcar_orders` WHERE STATUS="confirmed" AND idbusy > ?', lastUpdateID, function(err, rows){
    //connection.query('SELECT * FROM `carf_vikrentcar_orders` WHERE STATUS="confirmed" AND ID = 1029', lastUpdateID, function(err, rows){
    //connection.query('SELECT * FROM `carf_vikrentcar_orders` WHERE STATUS="confirmed" AND ID BETWEEN 1025 AND 1033', lastUpdateID, function(err, rows){
      if(err){
        console.log(err);
      }
      if(rows.length == 0){
        console.log("Vacío");
      } else {
        for(i=0;i<rows.length;i++){
        //Para cada reserva
            console.log(rows[i].id);

            // Vamos creando el objeto de reserva
            var reserva = {
              nombre: '',
              emailCliente: '',
              telefonoCliente: '',
              company: 'Concretar',
              tipo: '',
              tarifa: '',
              procedencia: 'Web',
              recogida: '',
              fechareco: '',
              devolucion: '',
              fechadevo: '',
              euroscarflet: '',
              notas: '',
              fechaReserva: '',
              myID: rows[i].idbusy
              // myID: rows[i].id
            }

            //Vamos rellenandolo
            //Primero Información del Cliente
            getClienteInfo(reserva, rows[i]);
            // Luego el precio cobrado
            getPrecioCobrado(reserva, rows[i]);
            // Luego fecha y horas de recogida y devolucion
            getMomentoRecoDevo(reserva, rows[i]);
            //Despues la info del coche
            if(rows[i].optionals != " " || rows[i].optionals != null) {
              getOptionsInfo(reserva, rows[i], connection);
            } else {
              getCocheInfo(reserva, rows[i], connection)
            }
            //getCocheInfo(reserva, rows[i], connection);
        }

      }
    });


  },

  calculaDias: function(f1,f2){
                var a = moment(f1);
                var b = moment(f2);

                var diferencia = a.diff(b, 'days');

                if(diferencia == 0){
                    diferencia = 1;
                }  else {
                    if(moment(b).hour() < moment(a).hour()) {
                        diferencia = diferencia + 1;
                    } else if (moment(b).hour() == moment(a).hour()) {
                        if (moment(b).minute() < moment(a).minute()) {
                            diferencia = diferencia + 1;
                        }
                    }
                }

                return diferencia;
  },

  setPresuSent: function(res, statusPago, username){
      Presupuestos.update(res._id, {
         $set: {sent: statusPago},
      });
  },

  setEstadoMulta: function(res, statusPago, username){
      Multas.update(res._id, {
         $set: {status: statusPago},
      });
  },

  setPago: function(res, statusPago, username){
      console.log("pagando");
      console.log(statusPago);
      console.log(res);
      Bookings.update(res._id, {
         $set: {pagada: statusPago},
      });

      var textPagada = "pendiente";

      if(statusPago == true){
          Bookings.update(res._id, {
             $set: {qtyPendiente: 0},
          });

          var textPagada = "pagada";
      }
      // console.log(Bookings.findOne(id));
      /*Activities.insert({
          "time": new Date(),
          "isPublic": true,
          "author": username,
          "type": 3,
          "desc": username + " marcó como "+textPagada+" la reserva de "+res.nombre+" del "+moment(res.createdAt).format("DD-MMM")+"",
          "nombreBooking": res.nombre,
          "fechaBooking": res.createdAt,
          "recoBooking": res.recogida,
          "devoBooking": res.devolucion
      });*/

  },

  setCancelBooking: function(res, statusCancel, username) {
    Bookings.update(res._id, {
      $set: {
        cancelada: statusCancel
      }
    })
  },

  sendEmail: function (to, from, subject, text) {
      // check([to, from, subject, text], [String]);
      // this.unblock();
      // Email.send({
      //   to: to,
      //   from: from,
      //   subject: subject,
      //   text: text
      // });
      let ownEmail = myCfConfig.myconf.emails.find((el) => el.key == 'dev').value;
      let infoEmail = myCfConfig.myconf.emails.find((el) => el.key == 'cfinfo').value;
      let centralEmail = myCfConfig.myconf.emails.find((el) => el.key == 'cfcentral').value;

      if(text.flagRegalo == 0){
        if(text.flagOrbit == 0){
          //Compilar el 00
          SSR.compileTemplate('htmlEmail', Assets.getText('htmlemail00.html'));
        } else {
          //Compilar el 01
          SSR.compileTemplate('htmlEmail', Assets.getText('htmlemail01.html'));
        }
      } else if (text.flagOrbit == 0) {
        //Compilar el 10
        SSR.compileTemplate('htmlEmail', Assets.getText('htmlemail10.html'));
      }

      if(text.flagRegalo == 1 && text.flagOrbit == 1){
        //Compilar el bueno
        SSR.compileTemplate('htmlEmail', Assets.getText('htmlemail.html'));
      }


      let emailData = text;


          Email.send({
              to: to,
              from: "Carflet Rent a Car <"+infoEmail+">",
              subject: subject,
              html: SSR.render('htmlEmail', emailData)
          });
  },



  calculaTotal: function(q1,q2,q3){
        var sum1;
        var sum2;
        var sum3;

        if(!q1){
            sum1 = 0;
        } else {
            sum1 = parseFloat(q1);
        }

        if(!q2){
            sum2 = 0;
        } else {
            sum2 = parseFloat(q2);
        }

        sum3 = parseFloat(q3);

        return (sum1+sum2+sum3);
  },

  addOficina: function(oficina){
      Oficinas.insert(oficina);
  },

  downloadTareasWorkersOtherYear: function(theYear){
    var Future = Npm.require('fibers/future');
    var futureResponse = new Future();

    var excel = new Excel('xlsx'); // Create an excel object  for the file you want (xlsx or xls)
    var workbook = excel.createWorkbook(); // Create a workbook (equivalent of an excel file)
    var worksheet = excel.createWorksheet(); // Create a worksheet to be added to the workbook

    // Example : writing to a cell
   worksheet.mergeCells(0,0,0,1); // Example : merging files
   worksheet.writeToCell(1,0, 'Fecha');
   worksheet.writeToCell(1,1, 'Tipo');
   worksheet.writeToCell(1,2, 'Worker');
   worksheet.writeToCell(1,3, 'Tarea');
   worksheet.writeToCell(1,4, 'Ciudad');
   worksheet.writeToCell(1,5, 'Coche');
   worksheet.writeToCell(1,6, 'Coste');
   worksheet.writeToCell(1,7, 'Notas');


   worksheet.setColumnProperties([ // Example : setting the width of columns in the file
     { wch: 20 },
     { wch: 30 }
   ]);

   var row = 2;

   var start = moment("01-01-"+theYear+"", "MM-DD-YYYY").toDate();
   var end = moment("01-01-"+(theYear+1)+"", "MM-DD-YYYY").toDate();

   TareasWorkers.find({fecha: {'$gte': start, '$lt': end}},{sort:{fecha: 1}}).forEach(function(tarea) {
       worksheet.writeToCell(row, 0, tarea.fecha);
       worksheet.writeToCell(row, 1, tarea.type);
       worksheet.writeToCell(row, 2, tarea.worker);
       worksheet.writeToCell(row, 3, tarea.tarea);
       worksheet.writeToCell(row, 4, tarea.ciudad);
       worksheet.writeToCell(row, 5, tarea.coche);
       worksheet.writeToCell(row, 6, tarea.precio);
       worksheet.writeToCell(row, 7, tarea.comments);
       row++;
   });

   workbook.addSheet('MySheet', worksheet);

   mkdirp('tmp', Meteor.bindEnvironment(function (err) {
     if (err) {
       console.log('Error creating tmp dir', err);
       futureResponse.throw(err);
     }
     else {
       console.log("No error al crear el directorio temporal");
       var uuid = UUID.v4();
       var filePath = './tmp/' + uuid;
       workbook.writeToFile(filePath);

       temporaryFiles.importFile(filePath, {
         filename : uuid,
         contentType: 'application/octet-stream'
       }, function(err, file) {
         if (err) {
           console.log('error al importar');
           futureResponse.throw(err);
         }
         else {
             console.log('no error al importar');
           futureResponse.return('/gridfs/temporaryFiles/' + file._id);
         }
       });
     }
   }));

   return futureResponse.wait();

 },




  downloadTareasWorkers: function(){
    var Future = Npm.require('fibers/future');
    var futureResponse = new Future();

    var excel = new Excel('xlsx'); // Create an excel object  for the file you want (xlsx or xls)
    var workbook = excel.createWorkbook(); // Create a workbook (equivalent of an excel file)
    var worksheet = excel.createWorksheet(); // Create a worksheet to be added to the workbook

    // Example : writing to a cell
   worksheet.mergeCells(0,0,0,1); // Example : merging files
   worksheet.writeToCell(1,0, 'Fecha');
   worksheet.writeToCell(1,1, 'Tipo');
   worksheet.writeToCell(1,2, 'Worker');
   worksheet.writeToCell(1,3, 'Tarea');
   worksheet.writeToCell(1,4, 'Ciudad');
   worksheet.writeToCell(1,5, 'Coche');
   worksheet.writeToCell(1,6, 'Coste');
   worksheet.writeToCell(1,7, 'Notas');

   var theYear = moment().format('YYYY');
   var start = moment("01-01-"+theYear+"", "MM-DD-YYYY").toDate();
   var end = moment("01-01-"+(parseInt(theYear)+1)+"", "MM-DD-YYYY").toDate();


   worksheet.setColumnProperties([ // Example : setting the width of columns in the file
     { wch: 20 },
     { wch: 30 }
   ]);

   var row = 2;

   TareasWorkers.find({fecha: {'$gte': start, '$lt': end}},{sort:{fecha: 1}}).forEach(function(tarea) {
       worksheet.writeToCell(row, 0, tarea.fecha);
       worksheet.writeToCell(row, 1, tarea.type);
       worksheet.writeToCell(row, 2, tarea.worker);
       worksheet.writeToCell(row, 3, tarea.tarea);
       worksheet.writeToCell(row, 4, tarea.ciudad);
       worksheet.writeToCell(row, 5, tarea.coche);
       worksheet.writeToCell(row, 6, tarea.precio);
       worksheet.writeToCell(row, 7, tarea.comments);
       row++;
   });

   workbook.addSheet('MySheet', worksheet);

   mkdirp('tmp', Meteor.bindEnvironment(function (err) {
     if (err) {
       console.log('Error creating tmp dir', err);
       futureResponse.throw(err);
     }
     else {
       console.log("No error al crear el directorio temporal");
       var uuid = UUID.v4();
       var filePath = './tmp/' + uuid;
       workbook.writeToFile(filePath);

       temporaryFiles.importFile(filePath, {
         filename : uuid,
         contentType: 'application/octet-stream'
       }, function(err, file) {
         if (err) {
           console.log('error al importar');
           futureResponse.throw(err);
         }
         else {
             console.log('no error al importar');
           futureResponse.return('/gridfs/temporaryFiles/' + file._id);
         }
       });
     }
   }));

   return futureResponse.wait();

 },

  updateNumFact: function(){

        console.log("Entra a la llamada numfactura");
        var numActual = 1;

        Bookings.find({},{sort:{fechareco: 1}}).forEach(function(booking) {
            if(booking.factura == "SI"){
                console.log("Se necesita factura. Insertar numero e incrementar");
                console.log(booking.numFactura);
                console.log(booking._id);
                Bookings.update(booking._id, {
                    $set: {numFactura: numActual}
                });

                numActual++;
            }

            else{
                console.log("NO FACTURA");
                Bookings.update(booking._id, {
                    $set: {numFactura: 0}
                });
            }
        });

        return false;
  },



  downloadExcelCustom: function(mode, period, finitial, ffin){
    // console.log("quieren excel");
    var Future = Npm.require('fibers/future');
    var futureResponse = new Future();

    var excel = new Excel('xlsx'); // Create an excel object  for the file you want (xlsx or xls)
    var workbook = excel.createWorkbook(); // Create a workbook (equivalent of an excel file)
    var worksheet = excel.createWorksheet(); // Create a worksheet to be added to the workbook
    var currentYear = moment().format('YYYY');

    if (mode == 1){
        worksheet.writeToCell(0,0, 'Reservas Mensuales en Carflet (Mes '+period+' Año '+currentYear+')');
    }

    if (mode == 2){
        worksheet.writeToCell(0,0, 'Reservas Trimestrales en Carflet ('+period+'T Año '+currentYear+')');
    }

    if (mode == 3){
        worksheet.writeToCell(0,0, 'Reservas Anuales en Carflet ('+period+')');
    }

    if (mode == 4){
        worksheet.writeToCell(0,0, 'Reservas en Carflet ('+period+')');
    }

    if (mode == 5){
        worksheet.writeToCell(0,0, 'Reservas en Carflet ('+period+')');
    }

     // Example : writing to a cell
    worksheet.mergeCells(0,0,0,1); // Example : merging files
    worksheet.writeToCell(1,0, 'Fecha');
    worksheet.writeToCell(1,1, 'Fecha Recogida');
    worksheet.writeToCell(1,2, 'Recogida');
    worksheet.writeToCell(1,3, 'Fecha Devolucion');
    worksheet.writeToCell(1,4, 'Devolucion');
    worksheet.writeToCell(1,5, 'Nombre');
    worksheet.writeToCell(1,6, 'Contacto');
    worksheet.writeToCell(1,7, 'Compañia');
    worksheet.writeToCell(1,8, 'Telf');
    worksheet.writeToCell(1,9, 'Tipo');
    worksheet.writeToCell(1,10, 'Procedencia');
    worksheet.writeToCell(1,11, 'Días');
    worksheet.writeToCell(1,12, 'Prepago');
    worksheet.writeToCell(1,13, 'Coste');
    worksheet.writeToCell(1,14, 'Comision');
    worksheet.writeToCell(1,15, 'Comisionado');
    worksheet.writeToCell(1,16, 'Precio');
    worksheet.writeToCell(1,17, 'Pagada');
    worksheet.writeToCell(1,18, 'Notas');
    worksheet.writeToCell(1,19, 'Localizador');

    worksheet.setColumnProperties([ // Example : setting the width of columns in the file
      { wch: 20 },
      { wch: 30 }
    ]);

    var row = 2;


    // console.log("el año");
    // console.log(currentYear);

    if (mode == 1){
        //mensuales
        var start = moment(parseInt(period)+"-01-"+currentYear+"", "MM-DD-YYYY").toDate();
        if(parseInt(period) == 12){
            // console.log("entra");
            var nextYear = parseInt(currentYear)+1;
            var end = moment("01-01-"+(nextYear)+"", "MM-DD-YYYY").toDate();
        } else {

            var end = moment((parseInt(period)+1)+"-01-"+currentYear+"", "MM-DD-YYYY").toDate();
        }

        console.log(start);
        console.log(end);
        Bookings.find({createdAt: {'$gte': start, '$lt': end}},{sort:{createdAt: 1}}).forEach(function(booking) {
            worksheet.writeToCell(row, 0, booking.createdAt);
            worksheet.writeToCell(row, 1, booking.fechareco);
            worksheet.writeToCell(row, 2, booking.recogida);
            worksheet.writeToCell(row, 3, booking.fechadevo);
            worksheet.writeToCell(row, 4, booking.devolucion);
            worksheet.writeToCell(row, 5, booking.nombre);
            worksheet.writeToCell(row, 6, booking.emailCliente);
            worksheet.writeToCell(row, 7, booking.company);
            worksheet.writeToCell(row, 8, booking.telefonoCliente);
            worksheet.writeToCell(row, 9, booking.tipo);
            worksheet.writeToCell(row, 10, booking.procedencia);
            var dias = Meteor.call('calculaDias', booking.fechadevo, booking.fechareco);
            worksheet.writeToCell(row, 11, dias);
            worksheet.writeToCell(row, 12, booking.qtyPrepago);
            worksheet.writeToCell(row, 13, booking.costeCoche);
            worksheet.writeToCell(row, 14, booking.euroscarflet);
            worksheet.writeToCell(row, 15, booking.comisionPerson);
            worksheet.writeToCell(row, 16, booking.comisionEuros);
            worksheet.writeToCell(row, 17, booking.pagada);
            worksheet.writeToCell(row, 18, booking.notas);
            worksheet.writeToCell(row, 19, booking.localizador);
            worksheet.writeToCell(row, 20, booking.cancelada);
            row++;
        });
    }

    if(mode == 2){
        // console.log("trimestrales");
        var mesIni = 3*period - 2;
        var mesFin = 3*period + 1;
        var start = moment(mesIni+"-01-"+currentYear+"", "MM-DD-YYYY").toDate();
        if(period == 4){
          var end = moment("12-31-"+currentYear+"", "MM-DD-YYYY").toDate();
        } else{
          var end = moment(mesFin+"-01-"+currentYear+"", "MM-DD-YYYY").toDate();
        }

        Bookings.find({createdAt: {'$gte': start, '$lt': end}},{sort:{createdAt: 1}}).forEach(function(booking) {
            worksheet.writeToCell(row, 0, booking.createdAt);
            worksheet.writeToCell(row, 1, booking.fechareco);
            worksheet.writeToCell(row, 2, booking.recogida);
            worksheet.writeToCell(row, 3, booking.fechadevo);
            worksheet.writeToCell(row, 4, booking.devolucion);
            worksheet.writeToCell(row, 5, booking.nombre);
            worksheet.writeToCell(row, 6, booking.emailCliente);
            worksheet.writeToCell(row, 7, booking.company);
            worksheet.writeToCell(row, 8, booking.telefonoCliente);
            worksheet.writeToCell(row, 9, booking.tipo);
            worksheet.writeToCell(row, 10, booking.procedencia);
            var dias = Meteor.call('calculaDias', booking.fechadevo, booking.fechareco);
            worksheet.writeToCell(row, 11, dias);
            worksheet.writeToCell(row, 12, booking.qtyPrepago);
            worksheet.writeToCell(row, 13, booking.costeCoche);
            worksheet.writeToCell(row, 14, booking.euroscarflet);
            worksheet.writeToCell(row, 15, booking.comisionPerson);
            worksheet.writeToCell(row, 16, booking.comisionEuros);
            worksheet.writeToCell(row, 17, booking.pagada);
            worksheet.writeToCell(row, 18, booking.notas);
            worksheet.writeToCell(row, 19, booking.localizador);
            worksheet.writeToCell(row, 20, booking.cancelada);
            row++;
        });

    }

    if(mode == 4){
        // console.log("trimestrales");
        var start = moment(finitial+"-01-"+currentYear+"", "MM-DD-YYYY").toDate();
        if(parseInt(ffin) == 12){
            var end = moment((ffin)+"-31-"+currentYear+"", "MM-DD-YYYY").toDate();
        } else {
            var end = moment((ffin+1)+"-01-"+currentYear+"", "MM-DD-YYYY").toDate();
        }

        Bookings.find({createdAt: {'$gte': start, '$lt': end}},{sort:{createdAt: 1}}).forEach(function(booking) {
            worksheet.writeToCell(row, 0, booking.createdAt);
            worksheet.writeToCell(row, 1, booking.fechareco);
            worksheet.writeToCell(row, 2, booking.recogida);
            worksheet.writeToCell(row, 3, booking.fechadevo);
            worksheet.writeToCell(row, 4, booking.devolucion);
            worksheet.writeToCell(row, 5, booking.nombre);
            worksheet.writeToCell(row, 6, booking.emailCliente);
            worksheet.writeToCell(row, 7, booking.company);
            worksheet.writeToCell(row, 8, booking.telefonoCliente);
            worksheet.writeToCell(row, 9, booking.tipo);
            worksheet.writeToCell(row, 10, booking.procedencia);
            var dias = Meteor.call('calculaDias', booking.fechadevo, booking.fechareco);
            worksheet.writeToCell(row, 11, dias);
            worksheet.writeToCell(row, 12, booking.qtyPrepago);
            worksheet.writeToCell(row, 13, booking.costeCoche);
            worksheet.writeToCell(row, 14, booking.euroscarflet);
            worksheet.writeToCell(row, 15, booking.comisionPerson);
            worksheet.writeToCell(row, 16, booking.comisionEuros);
            worksheet.writeToCell(row, 17, booking.pagada);
            worksheet.writeToCell(row, 18, booking.notas);
            worksheet.writeToCell(row, 19, booking.localizador);
            worksheet.writeToCell(row, 20, booking.cancelada);
            row++;
        });

    }

    if(mode == 5){
        // console.log("trimestrales");
        var start = moment("01-01-"+period+"", "MM-DD-YYYY").toDate();
        var end = moment("01-01-"+(period+1)+"", "MM-DD-YYYY").toDate();

        Bookings.find({createdAt: {'$gte': start, '$lt': end}},{sort:{createdAt: 1}}).forEach(function(booking) {
            worksheet.writeToCell(row, 0, booking.createdAt);
            worksheet.writeToCell(row, 1, booking.fechareco);
            worksheet.writeToCell(row, 2, booking.recogida);
            worksheet.writeToCell(row, 3, booking.fechadevo);
            worksheet.writeToCell(row, 4, booking.devolucion);
            worksheet.writeToCell(row, 5, booking.nombre);
            worksheet.writeToCell(row, 6, booking.emailCliente);
            worksheet.writeToCell(row, 7, booking.company);
            worksheet.writeToCell(row, 8, booking.telefonoCliente);
            worksheet.writeToCell(row, 9, booking.tipo);
            worksheet.writeToCell(row, 10, booking.procedencia);
            var dias = Meteor.call('calculaDias', booking.fechadevo, booking.fechareco);
            worksheet.writeToCell(row, 11, dias);
            worksheet.writeToCell(row, 12, booking.qtyPrepago);
            worksheet.writeToCell(row, 13, booking.costeCoche);
            worksheet.writeToCell(row, 14, booking.euroscarflet);
            worksheet.writeToCell(row, 15, booking.comisionPerson);
            worksheet.writeToCell(row, 16, booking.comisionEuros);
            worksheet.writeToCell(row, 17, booking.pagada);
            worksheet.writeToCell(row, 18, booking.notas);
            worksheet.writeToCell(row, 19, booking.localizador);
            worksheet.writeToCell(row, 20, booking.cancelada);
            row++;
        });

    }

    if(mode == 3){
        console.log("anuales");
        var start = moment("01-01-"+period+"", "MM-DD-YYYY").toDate();
        var end = moment("12-31-"+period+"", "MM-DD-YYYY").toDate();




        if (period < 2017){
            BookingsOld.find({createdAt: {'$gte': start, '$lt': end}},{sort:{createdAt: 1}}).forEach(function(booking) {
                worksheet.writeToCell(row, 0, booking.createdAt);
                worksheet.writeToCell(row, 1, booking.fechareco);
                worksheet.writeToCell(row, 2, booking.recogida);
                worksheet.writeToCell(row, 3, booking.fechadevo);
                worksheet.writeToCell(row, 4, booking.devolucion);
                worksheet.writeToCell(row, 5, booking.nombre);
                worksheet.writeToCell(row, 6, booking.emailCliente);
                worksheet.writeToCell(row, 7, booking.company);
                worksheet.writeToCell(row, 8, booking.telefonoCliente);
                worksheet.writeToCell(row, 9, booking.tipo);
                worksheet.writeToCell(row, 10, booking.procedencia);
                var dias = Meteor.call('calculaDias', booking.fechadevo, booking.fechareco);
                worksheet.writeToCell(row, 11, dias);
                worksheet.writeToCell(row, 12, booking.qtyPrepago);
                worksheet.writeToCell(row, 13, booking.costeCoche);
                worksheet.writeToCell(row, 14, booking.euroscarflet);
                worksheet.writeToCell(row, 15, booking.comisionPerson);
                worksheet.writeToCell(row, 16, booking.comisionEuros);
                worksheet.writeToCell(row, 17, booking.pagada);
                worksheet.writeToCell(row, 18, booking.notas);
                worksheet.writeToCell(row, 19, booking.localizador);
                worksheet.writeToCell(row, 20, booking.cancelada);
                row++;
            });
        } else {
            Bookings.find({createdAt: {'$gte': start, '$lt': end}},{sort:{createdAt: 1}}).forEach(function(booking) {
                worksheet.writeToCell(row, 0, booking.createdAt);
                worksheet.writeToCell(row, 1, booking.fechareco);
                worksheet.writeToCell(row, 2, booking.recogida);
                worksheet.writeToCell(row, 3, booking.fechadevo);
                worksheet.writeToCell(row, 4, booking.devolucion);
                worksheet.writeToCell(row, 5, booking.nombre);
                worksheet.writeToCell(row, 6, booking.emailCliente);
                worksheet.writeToCell(row, 7, booking.company);
                worksheet.writeToCell(row, 8, booking.telefonoCliente);
                worksheet.writeToCell(row, 9, booking.tipo);
                worksheet.writeToCell(row, 10, booking.procedencia);
                var dias = Meteor.call('calculaDias', booking.fechadevo, booking.fechareco);
                worksheet.writeToCell(row, 11, dias);
                worksheet.writeToCell(row, 12, booking.qtyPrepago);
                worksheet.writeToCell(row, 13, booking.costeCoche);
                worksheet.writeToCell(row, 14, booking.euroscarflet);
                worksheet.writeToCell(row, 15, booking.comisionPerson);
                worksheet.writeToCell(row, 16, booking.comisionEuros);
                worksheet.writeToCell(row, 17, booking.pagada);
                worksheet.writeToCell(row, 18, booking.notas);
                worksheet.writeToCell(row, 19, booking.localizador);
                worksheet.writeToCell(row, 20, booking.cancelada);
                row++;
            });
        }
    }

    workbook.addSheet('MySheet', worksheet);

    mkdirp('tmp', Meteor.bindEnvironment(function (err) {
      if (err) {
        console.log('Error creating tmp dir', err);
        futureResponse.throw(err);
      }
      else {
        console.log("No error al crear el directorio temporal");
        var uuid = UUID.v4();
        var filePath = './tmp/' + uuid;
        workbook.writeToFile(filePath);

        temporaryFiles.importFile(filePath, {
          filename : uuid,
          contentType: 'application/octet-stream'
        }, function(err, file) {
          if (err) {
            console.log('error al importar');
            futureResponse.throw(err);
          }
          else {
              console.log('no error al importar');
            futureResponse.return('/gridfs/temporaryFiles/' + file._id);
          }
        });
      }
    }));

    return futureResponse.wait();
  },

  downloadExcelEmails: function(){
    var Future = Npm.require('fibers/future');
    var futureResponse = new Future();
    console.log("Entra en la llamada del server");

    var excel = new Excel('xlsx'); // Create an excel object  for the file you want (xlsx or xls)
    var workbook = excel.createWorkbook(); // Create a workbook (equivalent of an excel file)
    var worksheet = excel.createWorksheet(); // Create a worksheet to be added to the workbook

    var row = 1;

    Bookings.find({}).forEach(function(booking) {
        worksheet.writeToCell(row, 0, booking.emailCliente);
        row++;
    });

    workbook.addSheet('MySheet', worksheet); // Add the worksheet to the workbook

    mkdirp('tmp', Meteor.bindEnvironment(function (err) {
      if (err) {
        console.log('Error creating tmp dir', err);
        futureResponse.throw(err);
      }
      else {
        console.log("No error al crear el directorio temporal");
        var uuid = UUID.v4();
        var filePath = './tmp/' + uuid;
        workbook.writeToFile(filePath);

        temporaryFiles.importFile(filePath, {
          filename : uuid,
          contentType: 'application/octet-stream'
        }, function(err, file) {
          if (err) {
            console.log('error al importar');
            futureResponse.throw(err);
          }
          else {
              console.log('no error al importar');
            futureResponse.return('/gridfs/temporaryFiles/' + file._id);
          }
        });
      }
    }));

    return futureResponse.wait();

  },

  insertFactura: function(fecha, numero){
      console.log("llego");
      HelpersFactura.remove({});
      HelpersFactura.insert({facFecha: fecha, facTodayNumber: numero});
  },

  insertFacturaManagement: function(fecha, numero, tipo, idcomi, nameComi, dirComi, dirComi2, cifComi, precio, fechaEntrega){
      console.log("newInvoice");
      console.log(fecha);
      console.log(numero);
      console.log(tipo);
      console.log(idcomi);
      console.log(nameComi);
      console.log(precio);
      console.log(fechaEntrega);

      Invoices.insert({
        'idComi': idcomi,
        'nameComi': nameComi,
        'dirComi': dirComi,
        'dirComi2': dirComi2,
        'cifComi': cifComi,
        'numFactura': numero,
        'isRecibidaFactura': tipo,
        'precio': precio,
        'fechaFactura': fecha,
        'fechaEntrega': fechaEntrega
      })
  },

  downloadExcelFile : function() {
    var Future = Npm.require('fibers/future');
    var futureResponse = new Future();
    console.log("Entra en la llamada del server");

    var excel = new Excel('xlsx'); // Create an excel object  for the file you want (xlsx or xls)
    var workbook = excel.createWorkbook(); // Create a workbook (equivalent of an excel file)
    var worksheet = excel.createWorksheet(); // Create a worksheet to be added to the workbook
    worksheet.writeToCell(0,0, 'Reservas en Carflet'); // Example : writing to a cell
    worksheet.mergeCells(0,0,0,1); // Example : merging files
    worksheet.writeToCell(1,0, 'Fecha');
    worksheet.writeToCell(1,1, 'Fecha Recogida');
    worksheet.writeToCell(1,2, 'Recogida');
    worksheet.writeToCell(1,3, 'Fecha Devolucion');
    worksheet.writeToCell(1,4, 'Devolucion');
    worksheet.writeToCell(1,5, 'Nombre');
    worksheet.writeToCell(1,6, 'Contacto');
    worksheet.writeToCell(1,7, 'Compañia');
    worksheet.writeToCell(1,8, 'Tipo');
    worksheet.writeToCell(1,9, 'Procedencia');
    worksheet.writeToCell(1,10, 'Días');
    worksheet.writeToCell(1,11, 'Prepago');
    worksheet.writeToCell(1,12, 'Coste');
    worksheet.writeToCell(1,13, 'Precio');
    worksheet.writeToCell(1,14, 'Notas');
    // worksheet.writeToCell(1,15, '€ Carflet');
    // worksheet.writeToCell(1,15, 'Total €');
    // worksheet.writeToCell(1,16, 'Notas');


    worksheet.setColumnProperties([ // Example : setting the width of columns in the file
      { wch: 20 },
      { wch: 30 }
    ]);

    // Example : writing multple rows to file
    var row = 2;
    Bookings.find({}).forEach(function(booking) {
        worksheet.writeToCell(row, 0, booking.createdAt);
        worksheet.writeToCell(row, 1, booking.fechareco);
        worksheet.writeToCell(row, 2, booking.recogida);
        worksheet.writeToCell(row, 3, booking.fechadevo);
        worksheet.writeToCell(row, 4, booking.devolucion);
        worksheet.writeToCell(row, 5, booking.nombre);
        worksheet.writeToCell(row, 6, booking.emailCliente);
        worksheet.writeToCell(row, 7, booking.company);
        worksheet.writeToCell(row, 8, booking.tipo);
        worksheet.writeToCell(row, 9, booking.procedencia);
        var dias = Meteor.call('calculaDias', booking.fechadevo, booking.fechareco);
        worksheet.writeToCell(row, 10, dias);
        worksheet.writeToCell(row, 11, booking.qtyPrepago);
        worksheet.writeToCell(row, 12, booking.costeCoche);
        worksheet.writeToCell(row, 13, booking.euroscarflet);
        worksheet.writeToCell(row, 14, booking.notas);
        // var total = Meteor.call('calculaTotal', booking.eurosprocedencia, booking.eurosproveedor, booking.euroscarflet);
        // worksheet.writeToCell(row, 15, total);
        // worksheet.writeToCell(row, 16, booking.notas);

      row++;
    });

    workbook.addSheet('MySheet', worksheet); // Add the worksheet to the workbook

    mkdirp('tmp', Meteor.bindEnvironment(function (err) {
      if (err) {
        console.log('Error creating tmp dir', err);
        futureResponse.throw(err);
      }
      else {
        console.log("No error al crear el directorio temporal");
        var uuid = UUID.v4();
        var filePath = './tmp/' + uuid;
        workbook.writeToFile(filePath);

        temporaryFiles.importFile(filePath, {
          filename : uuid,
          contentType: 'application/octet-stream'
        }, function(err, file) {
          if (err) {
            console.log('error al importar');
            futureResponse.throw(err);
          }
          else {
              console.log('no error al importar');
            futureResponse.return('/gridfs/temporaryFiles/' + file._id);
          }
        });
      }
    }));

    return futureResponse.wait();
  },

  downloadExcelContactsFile : function() {
    var Future = Npm.require('fibers/future');
    var futureResponse = new Future();
    console.log("Entra en la llamada del server");

    var excel = new Excel('xlsx'); // Create an excel object  for the file you want (xlsx or xls)
    var workbook = excel.createWorkbook(); // Create a workbook (equivalent of an excel file)
    var worksheet = excel.createWorksheet(); // Create a worksheet to be added to the workbook

    var row = 1;

    Contacts.find({}).forEach(function(contact) {
        worksheet.writeToCell(row, 0, contact.email);
        row++;
    });

    workbook.addSheet('MySheet', worksheet); // Add the worksheet to the workbook

    mkdirp('tmp', Meteor.bindEnvironment(function (err) {
      if (err) {
        console.log('Error creating tmp dir', err);
        futureResponse.throw(err);
      }
      else {
        console.log("No error al crear el directorio temporal");
        var uuid = UUID.v4();
        var filePath = './tmp/' + uuid;
        workbook.writeToFile(filePath);

        temporaryFiles.importFile(filePath, {
          filename : uuid,
          contentType: 'application/octet-stream'
        }, function(err, file) {
          if (err) {
            console.log('error al importar');
            futureResponse.throw(err);
          }
          else {
              console.log('no error al importar');
            futureResponse.return('/gridfs/temporaryFiles/' + file._id);
          }
        });
      }
    }));

    return futureResponse.wait();
  }

});
