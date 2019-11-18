// Meteor.publish('bookings',function(){
// //console.log("server", Talk.find().count());
// return Bookings.find();
// });
import { Email } from 'meteor/email'
import { Meteor } from 'meteor/meteor'
import * as myCfConfig from './cfsettings'
import './publishers';
import './bookingsAPI';
import './mailSender';

Meteor.startup(function () {
    var everyHour = new Cron(function() {
        //console.log("it is 30 minutes past the hour");
        Meteor.call("catchNewBookings");
        // Meteor.call("sendDummyEmail");
    }, {
        minute: 30
    });

    var everyDay = new Cron(function() {
        //console.log("it is 24 minutes past the hour");
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
    //console.log("hey");
    let myemauk = myCfConfig.myconf.emails.find((el) => el.key == 'dev').value;
    //console.log(myemauk);
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
     //console.log("nuevo nivel");
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
      // console.log('me han llamado para trastear con fechas');
      //var momentoReco = moment((resDB.ritiro)*1000).format("DD MMM YYYY hh:mm a");
      //var momentoReco = moment((resDB.ritiro)*1000, "DD MMM YYYY hh:mm a", true).format();
      var momentoReco = new Date(moment((resDB.ritiro)*1000));
      // var momentoReco = moment((resDB.ritiro)*1000).format("YYYY-mm-ddTHH:MM:ssZ");
      // console.log(momentoReco);
      reserva.fechareco = momentoReco;

      var momentoDevo = new Date(moment((resDB.consegna)*1000));
      // console.log(momentoDevo);
      reserva.fechadevo = momentoDevo;

      var momentoHecha = new Date(moment((resDB.ts)*1000));
      // console.log(momentoHecha);
      reserva.fechaReserva = momentoHecha;
      reserva.notas = resDB.coupon;

      return reserva;
    }

    function getLugaresInfo(reserva, resDB, con){
      // console.log('me han llamado para ver lugares');

      //Coger id de recogida
      var idLugarReco = resDB.idplace;
      //console.log(idLugarReco);
      //console.log(reserva.nombre);


      con.query('SELECT `name` FROM `carf_vikrentcar_places` WHERE id = ?', idLugarReco, function(err, rows){
        //console.log(rows[0].name);
        reserva.recogida = rows[0].name;

        var idLugarDevo = resDB.idreturnplace;

        con.query('SELECT `name` FROM `carf_vikrentcar_places` WHERE id = ?', idLugarDevo, function(err, rows){
          // console.log(rows[0].name);
          reserva.devolucion = rows[0].name;
          insertIntoDB(reserva);
        });


      });
    }

    function getTarifaInfo(reserva, resDB,con){
      // console.log('me han llamado para ver tarifas');


      //Coger idtar de la reserva
      var idTarifa = resDB.idtar;
      var idPrecio = "";

      //Coger clave de precio de la tabla DISPCOST
      con.query('SELECT `idprice` FROM `carf_vikrentcar_dispcost` WHERE id = ?', idTarifa, function(err, rows){
          idPrecio = rows[0].idprice;
          //// console.log(idPrecio);

          con.query('SELECT `name` FROM `carf_vikrentcar_prices` WHERE id = ?', idPrecio, function(err, rows){
              var nombreTarifa = rows[0].name;
              //console.log(nombreTarifa);
              reserva.tarifa = nombreTarifa;
              getLugaresInfo(reserva, resDB, con);

          });
      });

    }

    function getCocheInfo(reserva, resDB, con){
        // console.log('me han llamado para dar la info del coche');
        // Check options 
        //Hay que coger la clave del coche de la reserva

        //Coger clave del coche la reserva
        var idCoche = resDB.idcar;
        if(idCoche == 18 || idCoche == 64){
          //Se ha hecho con el coche para cobrar
          if(idCoche == 18 || idCoche == 64){
            // console.log('vehiculo de alquiler');
            reserva.tipo = "Vehiculo de alquiler";
          }else {
            // console.log('transfer');
            reserva.tipo = "Transfer Aeropuerto Madrid";
          }
          reserva.tarifa = "Personalizada";
          reserva.euroscarflet = 0;
          getLugaresInfo(reserva, resDB, con);
        } else {
              // console.log('coche normal');
              var idCategoria = "";
              // console.log(idCoche);

              //Coger clave de categoria de con el id del coche
              con.query('SELECT `idcat` FROM `carf_vikrentcar_cars` WHERE id = ?', idCoche, function(err, rows){
                idCategoria = rows[0].idcat;
                //console.log('su categoria es');
                var nombreCategoria = '';

                  //Coger el nombre de la categoria con el id de la categoria
                  con.query('SELECT `name` FROM `carf_vikrentcar_categories` WHERE id = ?', idCategoria, function(err, rows, nombreCategoria){
                    nombreCategoria = rows[0].name;
                    reserva.tipo = nombreCategoria;
                    // console.log(nombreCategoria);
                    // console.log(reserva);
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

    // console.log("conectando");
    // console.log(connection.host);

    connection.connect(function(err) {
      if (err) {
        console.error('error connecting: ' + err.stack);
        return;
      }

      // console.log('connected as id ' + connection.threadId);
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
        // console.log("Vacío");
      } else {
        for(i=0;i<rows.length;i++){
        //Para cada reserva
            // console.log(rows[i].id);

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



  sendEmail: function (to, from, subject, text) {
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










});
