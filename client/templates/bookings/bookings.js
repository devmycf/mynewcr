// var handle;
// handle = Meteor.subscribeWithPagination('bookings', 5);
Template.bookings.helpers({
    // bookings: function(){
    //     return Bookings.find({},{sort:{fechareco: -1}});
    // },

    ultimaReservaTime: function(){
        var ultimaActualizacion = Updates.find({}).fetch();
        return moment(ultimaActualizacion[0].fecha).format('MMMM Do YYYY, h:mm:ss a');
        // var lastBooking = Bookings.find({userName: "web"},{sort:{fechaReserva: -1}}).fetch();
        // console.log(lastBooking);
        // console.log(lastBooking[0].createdAt);
        // return moment(lastBooking[0].createdAt).format('MMMM Do YYYY, h:mm:ss a');
    },

    numPending: function(){
        var allBookings = Bookings.find({}).fetch()
        // console.log(allBookings);
        var pending = [];

        for(var i = 0; i<allBookings.length; i++){
            if (allBookings[i].company == "Concretar" || allBookings[i].company == "Pendiente" || allBookings[i].pagada == false || typeof allBookings[i].pagada === "undefined"){
                    pending.push(allBookings[i]);
            }
        }
        return pending.length;
    },

    tipocoche: function () {
        return [
          {
            optgroup: "Tipo Vehículo",
            options: [
                {label: "A", value: "A"},
                {label: "B", value: "B"},
                {label: "C", value: "C"},
                {label: "E", value: "E"},
                {label: "F", value: "F"},
                {label: "G", value: "G"},
                {label: "H", value: "H"},
                {label: "I", value: "I"},
                {label: "J", value: "J"},
                {label: "L", value: "K"},
                {label: "K", value: "L"}
            ]
          }
        ];
    },

    companyname: function () {
        return [
          {
            optgroup: "Compañía",
            options: [
                {label: "Concretar", value: "Concretar"},
                {label: "Avis", value: "Avis"},
                {label: "Europcar", value: "Europcar"},
                {label: "Enterprise", value: "Enterprise"},
                {label: "Sixt", value: "Sixt"},
                {label: "Motos", value: "Motos"},
                {label: "Carflet Kya Rio", value: "Carflet Kya Rio"},
                {label: "Carflet Hyundai i30", value: "Carflet Hyundai i30"},
                {label: "Carflet Seat Ibiza", value: "Carflet Seat Ibiza"},
                {label: "Carflet Lancia", value: "Carflet Lancia"},
                {label: "Carflet Dacia Sandero", value: "Carflet Dacia Sandero"}
            ]
          }
        ];
    },

    selectedBookingDoc: function(){
        return Bookings.findOne(Session.get("selectedBookingId"));
    },

    isPartialPrepaid: function(pre){
       if (pre == "" || pre == null){
           return false;
       } else {
           return true;
       }
    }

/*    tarifaname2: function () {
        return [
          {
            optgroup: "Tarifa",
            options: [
                {label: "Basica", value: "Basica"},
                {label: "Ampliada", value: "Ampliada"}
            ]
          }
        ];
    }*/
});


Template.bookings.rendered = function() {
  // Meteor.call('catchNewBookings', function(err, resp){
  //   if(err) {
  //     console.log('Error en la funcion de actualización');
  //     console.log(err);
  //   }
  //
  //   console.log('Todo bien llegó al cliente');
  // });

  this.$('.datetimepicker').datetimepicker({
    language: 'es',
    locale: moment.local('es'),
    format: 'dd/MM/YYYY HH:mm'
  });

}
Template.bookings.events({
        "click .load-more": function(){
          handle.loadNextPage();
          // console.log('claro');
        },

        "click .createContract": function(e){
            var currentId = this._id;
            // console.log(currentId);
            var booking = Bookings.find({"_id": currentId}).fetch();
            var bookingCar = booking[0].company;
            var infoCar = Flota.find({"nombreCoche": bookingCar}).fetch();
            // console.log(infoCar);
            Session.set("currentCar", infoCar[0]);
            Session.set("currentBooking", booking[0]);
            Router.go('owncontract');
        },

        "blur .qtypending": function(e){
            // console.log("now");
            var currentId = this._id;
            // console.log(currentId);
            var newPending = $(e.target).val();
            // console.log(newPending);
            Meteor.call("pushPending", currentId, newPending);
            // Meteor.call("test");
        },

        "blur .cteCoche": function(e){
            // console.log("wea");
            var currentId = this._id;
            if($(e.target).val() != ""){
                var newCoste = $(e.target).val();
                // console.log(newCoste);
                Meteor.call("pushCoste", currentId, newCoste);
            }
            // Meteor.call("test");
        },

        "blur .cteComision": function(e){
            var currentId = this._id;
            var newComision = $(e.target).val();
            Meteor.call("pushComision", currentId, newComision);
        },

        "click .trigger-reco": function(e){
            var currentId = this._id;
            $(e.target).closest(".workercont").toggleClass("activo");
            // Change icon if abled -> disabled and viceversa

            if(!$(e.target).closest(".workercont").hasClass("activo")){
              Meteor.call("resetRecoWorker", currentId);
            }
        },

        "click .trigger-devo": function(e){
            var currentId = this._id;
            $(e.target).closest(".workercont").toggleClass("activo");
            // Change icon if abled -> disabled and viceversa
            if(!$(e.target).closest(".workercont").hasClass("activo")){
              Meteor.call("resetDevoWorker", currentId);
            }
        },

        "change .ente-comisionado": function(e){
            var currentBooking = this._id;
            var comiID = $(e.target).val();
            var comiName = $(e.target).find("option:selected").attr("name");

            if(comiID == 0){
              // console.log("lo");
              $(e.target).closest(".col-comision").find(".cteComision").addClass("hide");
              Meteor.call("resetComisionPerson", currentBooking);
            } else {
              $(e.target).closest(".col-comision").find(".cteComision").removeClass("hide");
              Meteor.call("assignComisionPerson", currentBooking, comiID, comiName);
            }
        },

        "change .recoWorker": function(e){
            var currentBooking = this._id;
            var workerID = $(e.target).val();
            var workerName = $(e.target).find("option:selected").attr("name");
            // console.log(workerID);

            if (workerID == 0){
              console.log("no worker");
              Meteor.call("resetRecoWorker", currentBooking);
            } else {
              console.log("hay worker");
              Meteor.call("assignRecoWorker", currentBooking, workerID, workerName);

              var tareasThisBooking = TareasWorkers.find({idBooking: currentBooking}).fetch();

              if(tareasThisBooking.length > 0){
                var flagIsReco = 0;
                for(var i = 0; i<tareasThisBooking.length; i++){
                   if (tareasThisBooking[i].type == "Entrega"){
                      //update Tareas Booking
                      flagIsReco = 1;
                      Meteor.call("updateRecoDevoWorker", tareasThisBooking[i]._id, workerID, workerName);
                   }
                }
                if (flagIsReco == 0){
                  var thisBooking = Bookings.findOne({_id: currentBooking});

                  Meteor.call("insertRecoWorker", thisBooking, workerID, workerName);
                }
              } else {
                  var thisBooking = Bookings.findOne({_id: currentBooking});

                  Meteor.call("insertRecoWorker", thisBooking, workerID, workerName);
              }
            }
        },

        "change .devoWorker": function(e){
            var currentBooking = this._id;
            var workerID = $(e.target).val();
            var workerName = $(e.target).find("option:selected").attr("name");

            if (workerID == 0){
              Meteor.call("resetDevoWorker", currentBooking);
            } else {
              Meteor.call("assignDevoWorker", currentBooking, workerID, workerName);

              var tareasThisBooking = TareasWorkers.find({idBooking: currentBooking}).fetch();

              if(tareasThisBooking.length > 0){
                var flagIsDevolucion = 0;
                for(var i = 0; i<tareasThisBooking.length; i++){
                   if (tareasThisBooking[i].type == "Recogida"){
                      //update Tareas Booking
                      flagIsDevolucion = 1;
                      Meteor.call("updateRecoDevoWorker", tareasThisBooking[i]._id, workerID, workerName);
                   }
                }

                if (flagIsDevolucion == 0){
                  var thisBooking = Bookings.findOne({_id: currentBooking});

                  Meteor.call("insertDevoWorker", thisBooking, workerID, workerName);
                }
              } else {
                  var thisBooking = Bookings.findOne({_id: currentBooking});

                  Meteor.call("insertDevoWorker", thisBooking, workerID, workerName);
              }
            }

        },

        "blur .localizador": function(e){
            var currentId = this._id;
            if($(e.target).val() != ""){
                var newLocalizador = $(e.target).val();
                // console.log(newLocalizador);
                Meteor.call("pushLocalizador", currentId, newLocalizador);
            }
            // Meteor.call("test");
        },

        "click .status-pago": function(){
            // console.log(this);
            var newStatus;
            var userAct = Meteor.user().username;
            if(this.pagada){
                //set not
                // console.log("ya pagada");
                newStatus = false;
            } else {
                // console.log("no pagada");
                newStatus = true;
            }
            Meteor.call("setPago", this, newStatus, userAct);
        },

        "change .bookingCar": function(e){
            // console.log("yeah");
            // var currentId = this._id;
            var currentId = this;
            var userAct = Meteor.user().username;
            var newCar = $(e.target).val();
            // console.log(newCar);
            Meteor.call("pushCarBooking", currentId, newCar, userAct);
        },

        "click .bookingrow": function(){
            Session.set("selectedBookingId", this._id);
        },

        "click .actualizarfactura": function(){
                Meteor.call('updateNumFact', function(err,response) {
                    if(err) {
                        Session.set('serverDataResponse', "Error:" + err.reason);
                        return;
                    }
                    Session.set('serverDataResponse', response);
		        });
        },

        "click .sendConfirmationMail": function() {
          // console.log("A enviar");

        },


        "click .downloadExcel": function () {
            Meteor.call('downloadExcelFile', function(err, fileUrl) {
              // console.log(fileUrl);
              var link = document.createElement("a");
              link.download = 'ListadoReservas.xlsx';
              link.href = fileUrl;
              link.click();
            });
        },

        "click .cargaReservas": function () {
            Meteor.call('catchNewBookings', function(err, resp){
              if(err) {
                // console.log('Error en la funcion de actualización');
                // console.log(err);
              }

              // console.log('Todo bien llegó al cliente');
            });
        },

        "click .downloadExcelEmailsClientes": function () {
            Meteor.call('downloadExcelEmails', function(err, fileUrl) {
              // console.log(fileUrl);
              var link = document.createElement("a");
              link.download = 'ListadoEmails.xlsx';
              link.href = fileUrl;
              link.click();
            });
        },

        "click .delete-booking": function(){
            if(confirm('¿Estás seguro de eliminar esta reserva?')){
                Bookings.remove(this._id);
                FlashMessages.sendSuccess("Reserva Eliminada", { autoHide: true, hideDelay: 3000 });
            }
        },

        "submit .modal-insert": function(event){
            $('#bookingModal').modal('hide');
            FlashMessages.sendSuccess("Reserva Creada", { autoHide: true, hideDelay: 3000 });
            //Prevent submit
            return false;

        },

        "submit .modal-up": function(event){
            $('#updatebookingModal').modal('hide');
            FlashMessages.sendSuccess("Reserva Actualizada", { autoHide: true, hideDelay: 3000 });
            //Prevent submit
            return false;
        },

        "click .downloadPdf": function(){
            var bookingsNames = Bookings.find().map(function(i){
                return i.nombre
            });

            function diasdiferencia (fecha1,fecha2){
                                var a = moment(fecha1);
                                var b = moment(fecha2);

                                var diferencia = b.diff(a, 'days');

                            if(diferencia == 0){
                                diferencia = 1;
                            }

                            return diferencia;
            };

            function parseSuplementoReco(sup){
                var suplementoInt = 0;
                if(sup == "0"){
                    suplementoInt = 0;
                }

                if(sup == "Local: 20€"){
                    suplementoInt = 20;
                }

                if(sup == "Nacional: 50€"){
                    suplementoInt = 50;
                }

                return(suplementoInt);
            };

            function getTextSuplementoReco(supint){
                var texto = "";

                if(supint == 0){
                    texto = "Suplemento de Recogida - Devolución";
                }

                if(supint == 20){
                    texto = "Suplemento Recogida-Devolución Regional";
                }

                if(supint == 50){
                    texto = "Suplemento Recogida-Devolución Nacional";
                }

                return(texto);
            };

            function parseSuplementoGPS(sup){
                var suplementoInt = 0;
                if(sup == "0"){
                    suplementoInt = 0;
                }

                if(sup == "GPS Propio: 10€"){
                    suplementoInt = 10;
                }

                if(sup == "GPS Ajeno: 15€"){
                    suplementoInt = 15;
                }

                return(suplementoInt);
            };

            function getTextSuplementoGps(supint){
                var texto = "";

                if(supint == 0){
                    texto = "Suplemento GPS";
                }

                if(supint == 10){
                    texto = "Suplemento GPS Propio";
                }

                if(supint == 15){
                    texto = "Suplemento GPS Ajeno";
                }

                return(texto);
            };

            function parseTransfer(sup){
                var suplementoInt = 0;
                if(sup == "0"){
                    suplementoInt = 0;
                }

                if(sup == "Transfer Hotel Cádiz: 5€"){
                    suplementoInt = 5;
                }

                if(sup == "Transfer Hotel: 10€"){
                    suplementoInt = 10;
                }

                if(sup == "Entrega en Hotel: 15€"){
                    suplementoInt = 15;
                }

                if(sup == "Transfer Aeropuerto: 65€"){
                    suplementoInt = 65;
                }

                return(suplementoInt);
            };

            function getTextTransfer(supint){
                var texto = "";

                if(supint == 0){
                    texto = "Transfer hotel o aeropuerto";
                }

                if(supint == 5){
                    texto = "Transfer Hotel Cádiz";
                }

                if(supint == 10){
                    texto = "Transfer Hotel";
                }

                if(supint == 15){
                    texto = "Entrega en Hotel";
                }

                if(supint == 65){
                    texto = "Transfer Aeropuerto";
                }

                return(texto);
            };
            /*
            function parseSuplemento(sup){
                var suplementoInt = 0;
                if(sup == 0){
                    suplementoInt = 0;
                }

                if(sup == "Local: 20€"){
                    suplementoInt = 20;
                }

                if(sup == "Nacional: 50€"){
                    suplementoInt = 50;
                }

            };

           function calculaImpuesto(sup){
                var tasa = 0.21;
                var impuesto;

                impuesto = sup/tasa;

                return(impuesto);
            };

            function calculaBase(sup){
                var tasa = 0.21;
                var base;

                base = tasa*sup;

                return(base);
            }
            */
            var bookingToPdf = Bookings.findOne(this._id);
            var nombreBooking = bookingToPdf.nombre;
            var emailCliente = bookingToPdf.emailCliente;
            var telefonoCliente = bookingToPdf.telefonoCliente;
            var numeroFactura = bookingToPdf.numFactura;
            var fechaReserva = moment(bookingToPdf.createdAt).format('DD-MM-YYYY');
            var coche = bookingToPdf.tipo;
            var fechaRecogida = moment(bookingToPdf.fechareco).format('DD-MM-YYYY');
            var fechaDevolucion = moment(bookingToPdf.fechadevo).format('DD-MM-YYYY');
            var ciudadRecogida = bookingToPdf.recogida;
            var ciudadDevolucion = bookingToPdf.devolucion;
            var tarifa = bookingToPdf.tarifa;
            var dias = diasdiferencia(bookingToPdf.fechareco,bookingToPdf.fechadevo);
            var suplementoRecoInt = parseSuplementoReco(bookingToPdf.supdevolucion);
            var suplementoRecoText = getTextSuplementoReco(suplementoRecoInt);

            var suplementoGpsInt = parseSuplementoGPS(bookingToPdf.supgps);
            var suplementoGpsText = getTextSuplementoGps(suplementoGpsInt);
            var gpsTotal = dias*suplementoGpsInt;

            var transferInt = parseTransfer(bookingToPdf.suptransfer);
            var transferText = getTextTransfer(transferInt);

            var tarifasolo = bookingToPdf.euroscarflet - suplementoRecoInt - suplementoGpsInt - transferInt;
            var euros = bookingToPdf.euroscarflet;

            var notas = bookingToPdf.notas;

            if(typeof notas === 'undefined'){
                notas = "Sin observaciones";
            };

            // Formatear Precios Base, IVA Y Precio Total DEL ALQUILER SIN SUPLEMENTOS
            var costeInt = parseFloat(tarifasolo);
            var precioBase = Math.round(costeInt/1.21 * 100) / 100;
            var IVARepercutido = Math.round((costeInt-precioBase)*100)/100;


            // Formatear fila de Suplemento Recogida-Devolución
            if(suplementoRecoInt == 0){
              //Hay que vaciar la fila
              var diasSupReco = "-";
              var baseSupReco = "-";
              var IVASupReco = "-";
              var TotalSupReco = "-";
            }
            else{
              var diasSupReco = dias;
              var TotalSupReco = parseFloat(suplementoRecoInt);
              var baseSupReco = Math.round(TotalSupReco/1.21 * 100) / 100;
              var IVASupReco = Math.round((TotalSupReco-baseSupReco)*100)/100;
            }

            // Formatear fila de Suplemento GPS
            if(suplementoGpsInt == 0){
              var diasSupGPS = "-";
              var baseSupGPS = "-";
              var IVASupGPS = "-";
              var TotalSupGPS = "-";
            }
            else {
              var diasSupGPS = dias;
              var TotalSupGPS = parseFloat(gpsTotal);
              var baseSupGPS = Math.round(TotalSupGPS/1.21 * 100) / 100;
              var IVASupGPS = Math.round((TotalSupGPS-baseSupGPS)*100)/100;
            }

            // Formatear fila de Suplemento Transfer
            if(transferInt == 0){
              var diasTransfer = "-";
              var baseTransfer = "-";
              var IVATransfer = "-";
              var TotalTransfer = "-";
            }
            else {
              var diasTransfer = dias;
              var TotalTransfer = parseFloat(transferInt);
              var baseTransfer = Math.round(TotalTransfer/1.21 * 100) / 100;
              var IVATransfer = Math.round((TotalTransfer-baseTransfer)*100)/100;
            }

            // Formatear fila de totales
            var TotalCobrar = parseFloat(euros);
            var baseTotal = Math.round(TotalCobrar/1.21 * 100) / 100;
            var IVATotal = Math.round((TotalCobrar-baseTotal)*100)/100;





            // Define the pdf-document
            var docDefinition = {
                content: [


                    { text: 'Factura', style: 'header' },

                            {
                                image: 'data:image/png;base64,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',
                                width: 120
                            },

                    {
                        alignment: 'justify',
                        columns: [
                            {
                                text: 'Carflet Rent a Car S.L\n C/Canarias 40 local 2 \n 28045 MADRID \n SPAIN \n Tel. (34) 616 970 491 \n 2o Tel. (34) 609 36 53 24 \n N.I.F: B-87129219 \n RM Madrid, T-2552, Sec 8°, F68, Hoja M-44527',
                                style: 'address'
                            },

                            {
                                alignment: 'right',
                                text: 'Nombre: '+nombreBooking+'\n eMail: '+emailCliente+'\n Telf: '+telefonoCliente+'\n Notas: '+notas+'', style: 'cliente',
                            },

                        ],

                        style: 'columnasInfoCliente'
                    },



                    {
                        alignment: 'center',
                        columns: [
                            {
                                text: 'Número de Factura'
                            },
                            {
                                text: 'Fecha de Reserva'
                            }
                        ],

                        style: 'headerColumnasInfo'
                    },

                    {
                        alignment: 'center',
                        columns: [
                            {
                                text: ''+numeroFactura+''
                            },
                            {
                                text: ''+fechaRecogida+''
                            }
                        ],

                        style: 'contentColumnasInfo'
                    },

                    {
                        text: [
                            { text: 'Coche Alquilado: ', style: 'epigrafe'},
                            { text: 'Tipo '+coche+''}
                        ]
                    },




                    {
                        alignment: 'center',
                        margin: [0,20,0,0],
                        columns: [
                            {
                                text: 'Fecha de Recogida'
                            },
                            {
                                text: 'Lugar de Recogida'
                            },
                            {
                                text: 'Fecha de Devolución'
                            },
                            {
                                text: 'Lugar de Devolución'
                            }
                        ],

                        style: "headerColumnasInfo"
                    },

                    {
                        alignment: 'center',
                        columns: [
                            {
                                text: ''+fechaRecogida+''
                            },
                            {
                                text: ''+ciudadRecogida+''
                            },
                            {
                                text: ''+fechaDevolucion+''
                            },
                            {
                                text: ''+ciudadDevolucion+''
                            }
                        ],

                        style: 'contentColumnasInfo'
                    },

                    {
                        text: [
                            { text: 'Detalles de Reserva: ', style: 'epigrafe'}
                        ]
                    },

                    {
                        margin: [0,20,0,0],
                        table: {
                            widths: [200, 30, '*', '*', '*'],
                            body: [
                                [{ text: '', style: 'tableHeader' }, { text: 'Días', alignment: 'center', style: 'tableHeader' }, { text: 'Precio Base', style: 'tableHeader' }, { text: 'IVA (21%)', style: 'tableHeader' }, { text: 'Total', style: 'tableHeader' }],
                                [{ text: 'Alquiler de Coche Tipo '+coche+'\n Tarifa '+tarifa+'', style: 'tableContent'},{text: ''+dias+'', alignment: 'center', style: 'tableContent'},{text: 'EUR '+precioBase+'', style: 'tableContent'},{text: 'EUR '+IVARepercutido+'', style: 'tableContent'},{text: 'EUR '+costeInt+'', style: 'tableContent'}],
                                // [{ text: ''+suplementoRecoText+'', style: 'tableContent'},{text: ''+diasSupReco+'', alignment: 'center', style: 'tableContent'},{text: 'EUR '+baseSupReco+'', style: 'tableContent'},{text: 'EUR '+IVASupReco+'', style: 'tableContent'},{text: 'EUR '+TotalSupReco+'', style: 'tableContent'}],
                                // [{ text: ''+suplementoGpsText+'', style: 'tableContent'},{text: ''+diasSupGPS+'', alignment: 'center', style: 'tableContent'},{text: 'EUR '+baseSupGPS+'', style: 'tableContent'},{text: 'EUR '+IVASupGPS+'', style: 'tableContent'},{text: 'EUR '+TotalSupGPS+'', style: 'tableContent'}],
                                // [{ text: ''+transferText+'', style: 'tableContent'},{text: ''+diasTransfer+'', alignment: 'center', style: 'tableContent'},{text: 'EUR '+baseTransfer+'', style: 'tableContent'},{text: 'EUR '+IVATransfer+'', style: 'tableContent'},{text: 'EUR '+TotalTransfer+'', style: 'tableContent'}],
                                [{ text: 'Total', bold: 'true', style: 'tableFooter' }, { text: '', style: 'tableFooter' }, { text: 'EUR '+baseTotal+'', style: 'tableFooter' }, { text: 'EUR '+IVATotal+'', style: 'tableFooter' }, { text: 'EUR '+TotalCobrar+'', bold:'true', style: 'tableFooter' }]
                            ]
                        },
                        layout: {
                          hLineWidth: function(i, node) {
                              return (i === 0 || i === node.table.body.length) ? 1 : 1;
                          },
                          vLineWidth: function(i, node) {
                              return (i === 0 || i === node.table.widths.length) ? 1 : 1;
                          },
                          hLineColor: function(i, node) {
                              return (i === 0 || i === node.table.body.length) ? 'gray' : 'gray';
                          },
                          vLineColor: function(i, node) {
                              return (i === 0 || i === node.table.widths.length) ? 'gray' : 'gray';
                          },
                          // paddingLeft: function(i, node) { return 4; },
                          // paddingRight: function(i, node) { return 4; },
                          // paddingTop: function(i, node) { return 2; },
                          // paddingBottom: function(i, node) { return 2; }
                      }
                    },


                    {
                        margin: [0,300,0,0],
                        text: [
                            { text: 'CONTRATO DE ALQUILER: TERMINOS Y CONDICIONES \n ', alignment: 'left', bold:'true', fontSize: 7}
                        ]
                    },

                    {
                        text: [
                            { text: '1. Su acuerdo con nosotros: \n ', style: 'epigrafeContrato'},
                            { text: 'Cuando usted firma en el ticket del bono de Carflet Rent a Car S.L. del Banco Sabadell acepta los términos y condiciones establecidos en el presente contrato de alquiler (Acuerdo), que consta de las Páginas 1, 2 y 3. Por favor, lea cuidadosamente este Acuerdo. Si hay algo que no entienda, por favor pregunte a cualquier miembro de nuestro personal.\n Nosotros y usted somos las únicas partes de este Acuerdo y usted es responsable de cumplir con todos los términos del presente Acuerdo, aunque otra persona (como una compañía de seguros, un hotel ó una Agencia de Viajes) pueda haber gestionado el alquiler, negociado ciertos términos ó pagado por la totalidad ó parte de la factura de alquiler.\n Le aseguramos que nuestro Vehículo (el Vehículo) es apto para circular y adecuado para el alquiler al inicio del periodo de alquiler.\n Este Acuerdo es el Acuerdo completo entre usted y nosotros respecto del alquiler y no puede ser alterado salvo acuerdo por escrito firmado por usted y nosotros.\n', style: 'contrato'},
                            { text: '2. Periodo de Alquiler: \n ', style: 'epigrafeContrato'},
                            { text: 'Estamos de acuerdo en que puede tener el Vehículo hasta la fecha de devolución indicada en la Página 1. Podemos acordar ampliar el alquiler, pero el periodo de alquiler no puede ser superior a tres meses. Si acordamos ampliar el alquiler, podemos requerirle el pago de un depósito adicional. Con las siguientes condiciones, usted puede optar por devolver el Vehículo antes de la fecha de devolución acordada en la Página 1 en el horario habitual de la oficina y con ello dar por terminado de forma anticipada este Acuerdo (y el período de alquiler se reducirá en consecuencia). Si usted prepaga el coste del alquiler para aprovechar una tarifa con “oferta especial”, acepta que no procederá ningún reembolso por la terminación anticipada, de lo contrario estará obligado a pagar la tarifa estándar por día (así como cualquier otro cargo aplicable mencionado en el presente Acuerdo) para los días o fracción durante el cuál alquiló el ¨Vehículo. Nuestras tarifas estándar cambian con frecuencia, y aparecen publicadas en nuestro sitio web www.carflet.es (Sitio Web). Pueden ser superiores a las tarifas diarias originalmente acordadas con nosotros. Asimismo, el coste medio diario de otros cargos aplicables (como productos de cobertura) para el período de alquiler reducido puede ser mayor. También perderá cualquier beneficio u “oferta especial” (por ejemplo, las tarifas de fin de semana que dependen de la contratación del Vehículo durante un periodo mínimo determinado). Por lo tanto, antes de elegir devolver el vehículo de forma anticipada, debe ponerse en contacto con nosotros para determinar los gastos revisados a pagar. Si usted no desea pagar dichos cargos, usted no tendrá derecho de modificar o dar por terminado el Acuerdo tal como se describe en este apartado, salvo acuerdo específico con nosotros. Cualquier cambio en la fecha de devolución afectará a los cargos mencionados en el párrafo 5, pero salvo acuerdo expreso, la terminación anticipada no afectará a los respectivos derechos y obligaciones de las partes en virtud de este Acuerdo. Cualquier gestión administrativa llevada a cabo por nosotros como resultado de una ampliación del periodo de alquiler acordado (incluyendo sin limitación, cambios en nuestros registros, procesos de facturación, referencias de documentos o fechas) no afectará sus responsabilidades con nosotros, en los términos y condiciones de este Acuerdo.\n\n', style: 'contrato'},
                            { text: '3. Sus responsabilidades: \n ', style: 'epigrafeContrato'},
                            { text: 'a) Debe cuidar el Vehículo y las llaves. Siempre debe cerrar el Vehículo, estacionarlo adecuadamente, de forma segura, y asegurar todas sus partes.\n b) No debe permitir a nadie alterar ni reparar el Vehículo sin nuestro permiso. Si le damos permiso, sólo le haremos un reembolso si usted tiene una factura del trabajo realizado.\n c) Debe inspeccionar el vehículo antes de tomar posesión de él. \n d) Debe dejar de utilizar el vehículo y ponerse en contacto con nosotros, tan pronto sea posible, cuando detecte un fallo en el Vehículo.\n e) Debe devolvernos el Vehículo durante el horario de apertura mostrado en la Página 1. Un miembro de nuestro personal debe ver el vehículo para comprobar que está en buenas condiciones. Si hemos acordado que puede devolver el Vehículo fuera del horario de apertura, usted seguirá siendo el responsable del Vehículo y su estado has que sea inspeccionado de nuevo por un miembro de nuestro personal. \n f) Debe comprobar que no ha dejado ninguna pertenencia personal en el Vehículo antes de devolverlo. \n g) Al firmar la declaración de responsabilidad de la Página 1, reconoce que usted será responsable como si fuera propietario del Vehículo para: \n    - Cualquier sanción impuesta por la infracción del Real Decreto Legislativo 339/1990, o el que se aprueba el Texto Articulado de la Ley sobre Tráfico, Circulación de Vehículos a Motor y Seguridad Vial.\n    - Cualquier sanción impuesta por la infracción de la Ley 8/2004, por el que se aprueba el texto refundido de la Ley sobre Responsabilidad Civil y Seguro en la Circulación de Vehículos a Motor. \n    - Cualquier delito definido por los artículos 379-385 (ambos incluidos) del Código Penal español. \n\n', style: 'contrato'},
                            { text: '4. Uso del Vehículo: \n ', style: 'epigrafeContrato'},
                            { text: 'El vehículo no debe utilizarse: \n a) Por cualquier persona que no sea usted o cualquier otro conductor indicado en el contrato.\nb) Por cualquier persona sin un permiso de conducir válido para la clase ó uso del Vehículo alquilado, o cualquier persona menos de 21 años. \nc) Para el transporte de viajeros por cuenta ajena o cualquier otra actividad que implique subarriendo. \nd) Para cualquier propósito ilegal o para causar deliberadamente lesiones, pérdidas o daños a la propiedad o a las personas.\n e) En carreras, como coche de seguridad, pruebas de fiabilidad del vehículo, velocidad o para enseñar a alguien a conducir. \n f) Bajo la influencia de alcohol o drogas.\n g) Para desprecintar o manipular el cuentakilómetros, debiendo comunicarnos inmediatamente cualquier avería en el mismo.\n h) Para llevar más pasajeros que cinturones de seguridad o transportar niños sin los sistemas de retención legalmente requeridos. \n i) Si el Vehículo es un vehículo comercial, para transportar mercancías con peso superior al máximo autorizado para el vehículo, ni mercancías deficientemente distribuidas o mal sujetas, ni para efectuar servicios de carga fraccionada,entendiéndose por tal las expediciones en que haya más de un solo remitente y/o más de un solo consignatario.\n j) Para salir fuera de la Unión Europea, realizar traslados a islas, entre islas, ni a Ceuta y Melilla a menos que se haya obtenido previamente de nuestra parte autorización escrita.\n k) Para empujar o remolcar otros vehículos o remolques.\n l) Fuera de la red vial nacional o vías pavimentadas. \n m) Para transportar pescado, carne, frutas, verduras, animales vivos o muertos, cualquier tipo de liquido envasado o sustancias peligrosas o nocivas. \n n) De forma temeraria. \n o) En cualquier parte de un aeródromo, pista de aterrizaje, aeropuerto o instalación militar con zona de despegue, aterrizaje, traslado o aparcamiento de aviones y dispositivos aéreos, incluidas las carreteras asociadas al servicio, áreas de recarga de combustible, áreas de estacionamiento de equipo de tierra, plataformas, áreas de mantenimiento y hangares, salvo que el Vehículo posea los correspondientes permisos oficiales y autorización por nuestra parte.\n\n', style: 'contrato'},
                            { text: '5. Pagos: \n ', style: 'epigrafeContrato'},
                            { text: 'a) Para todos los conceptos diarios designados como “/ día” en la Página 1: \n - Si la Página 1 indica “día = periodo de 24 horas”, un día es cada período de 24 horas consecutivas. \n - Si la Página 1 indica “dia = día natural”, un dia es cada día completo de calendario o fracción.\n - Todos los cargos son por un mínimo de 1 día. \n b) Para todos los conceptos designados como “/ semana” o “ / mes” en la Página1:\n - Si la Página 1 indica “/ semana” una semana es 7 días consecutivos a partir de la hora de inicio del alquiler.\n - Si la Página 1 indica “/ mes”, un mes es 30 días consecutivos a partir de la hora de inicio del alquiler.\n c) Usted acepta pagarnos los siguiente cargos como se muestran en la Página 1:\n - Los cargos por el tiempo del periodo de alquiler.\n - El cargo de kilometraje por todos los kilómetros que excedan de los kilómetros gratuitos indicados en la Página 3, permitidos en el periodo de alquiler.\n -  Cargo por Salida al extranjero, si autorizamos la salida del vehículo de España.\n Los cargos por cualquier Accesorio opcional (tales como el dispositivo GPS,asientos para niños, bacas u otros accesorios), servicios o productos opcionales que usted acepta, incluyendo CDW o EP.\n - Un cargo de repostaje de combustible según la tarifa indicada en las páginas oficiales del gobierno de España, basado en el consumo, por la diferencia de combustible si el Vehículo es devuelto con menos combustible que cuando se alquiló. No recibirá ningún reembolso si el Vehículo es devuelto con más combustible que cuando lo alquiló.\n d) Obligaciones adicionales.- Usted deberá pagarnos cuando lo solicitemos:\n - El importe de toda clase de multas, gastos judiciales, derivados de aparcamientos indebidos, tasas de congestión, infracciones de Tráfico y normas de obligado cumplimiento que sean dirigidas contra el Vehículo, usted, cualquier otro conductor autorizado o nosotros mismos salvo que haya sida causado por culpa nuestra.\n - Un cargo administrativo razonable por la gestión de cualquier multa o denuncia contra el Vehículo, usted o nosotros durante el periodo de alquiler, salvo que haya sido causado por nuestra culpa.\n - Los costes incurridos, incluyendo los honorarios razonables de abogados permitidos por ley, por la gestión del cobro de pagos adeudados por usted bajo este Acuerdo.\n - Un cargo razonable de recogida si el Vehículo no se devuelve en la oficina de alquiler original indicada en la Página 1.\n e) En el caso de daños, pérdida o robo del vehículo o cualquier parte o accesorios, deberá pagarnos, cuando lo solicitemos, los daños y cargos previstos en nuestro contrato salvo que haya sido causado por nuestra culpa. Solo nosotros tenemos el derecho y la responsabilidad de reparar el Vehículo y, salvo que ya haya pagado conforme a nuestra Tabla de Cargos de Reparación, trataremos de reparar y gestionar la reclamación al seguro lo más rápido posible. Su responsabilidad por daños, pérdida o robo del Vehículo puede ser reducida por la compara de la Exención Parcial de Daños (CDW) o Exención de Franquicia (EP).\n f) Tendrá que pagar el IVA y el resto de los impuestos aplicables (si los hay) a cualquier de los cargos mencionados en este párrafo 5.\n g) Usted es responsable de todos los cargos, incluso si usted ha pedido a otra persona que sea responsable de ellos o hemos facturado a un tercero. Usted acepta que calculemos y cobremos los cargos finales a su tarjeta de crédito o débito, si esa es la forma de depósito o garantía que se ha utilizado, como se muestra en la Página 1. Todos los cargos están sujetos a inspección final. Haremos todo lo posible para comunicarle, previamente al cobro en su tarjeta de crédito y/o débito, los cargos finales generados después de la finalización del Acuerdo.', style: 'contrato'},
                        ]
                    },

                    {
                        alignment: 'justify',
                        margin: [0,10,0,0],
                        columns: [
                            {
                                text: 'Carflet Rent a Car S.L',
                                fontSize: 8
                            },

                            {
                                text: 'info@carflet.es',
                                fontSize: 8,
                                alignment: 'center'
                            },

                            {
                                text: 'www.carflet.com',
                                fontSize: 8,
                                alignment: 'right'
                            },

                        ],
                    },
                ],

                styles: {
                  tableFooter: {
                    fillColor: '#f5f5f5',
                    fontSize: 12
                  },
                  tableContent: {
                    fontSize: 10
                  },
                  tableHeader: {
                    fillColor: '#C5E1EB',
                    fontSize: 12
                  },

                  epigrafeContrato: {
                      bold: true,
                      alignment: 'left',
                      fontSize: 7
                  },

                  contrato: {
                    fontSize: 6.5,
                    alignment: 'justify',
                  },
                    header: {
                        fontSize: 14,
                        alignment: 'center'
                    },

                    address: {
                        fontSize: 8
                    },

                    cliente: {
                        fontSize: 12
                    },

                    columnasInfoCliente: {
                        margin: [0,20,0,25]
                    },

                    headerColumnasInfo: {
                        fontSize: 12,
                        bold: true,
                    },

                    contentColumnasInfo: {
                        margin: [0,0,0,35],
                        fontSize: 11
                    },

                    epigrafe: {
                        bold: true,
                        alignment: 'left',
                    }

                }
            };

            // Start the pdf-generation process
            // pdfMake.createPdf(docDefinition).open();
            pdfMake.createPdf(docDefinition).download("Reserva en Carflet "+nombreBooking+"");
        }


});
