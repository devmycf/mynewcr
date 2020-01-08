Template.flota.helpers({
  bookingFlotaSchema: function() {
    return Schema.bookingFlota;
  },
  flota: function(){
      return Flota.find({});
  },

  comis: function(){
    return Comisionables.find({});
  },

  noKey: function(coche, ordKey) {
    var theKey = Llaves.findOne({'idFlota': coche, 'ordinalInFlota': ordKey});
    if (theKey.locationName == '-'){
      return 'selected';
    } else {
      return '';
    }
  },

  inHouse: function(coche, ordKey) {
    var theKey = Llaves.findOne({'idFlota': coche, 'ordinalInFlota': ordKey});
    if (theKey.locationName == 'Oficinas Carflet'){
      return 'selected';
    } else {
      return '';
    }
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
              {label: "K", value: "L"},
              {label: "Furgonetas", value: "Furgonetas"}
          ]
        }
      ];
  },

  whichLocationTypeCode: function(car, numkey){

    var theKeyLoc = Llaves.findOne({'idFlota': car, 'ordinalInFlota': numkey});
    if(theKeyLoc.locationName == '-' || theKeyLoc.locationId == '-') {
      return 'not-defined';
    } else if (theKeyLoc.locationName == 'Oficinas Carflet') {
      return 'house';
    } else {
      return 'somewhere';
    }
  },

  keyLocationName: function(car, numkey) {
    var theKeyLoc = Llaves.findOne({'idFlota': car, 'ordinalInFlota': numkey});
    return theKeyLoc.locationName;
  },

  isThisSelected: function(name, car, ncar, ord){
    var theKey = Llaves.findOne({'idFlota': car, 'ordinalInFlota': ord});
    if(theKey.locationName == name){
      return "selected";
    } else {
      return "";
    }
 },


  getImagenPath: function(img){
    return "img/flota/"+img+".jpg";
  },

  selectedFlotaDoc: function(){
      return Flota.findOne(Session.get("selectedFlotaId"));
  },

  getNombreCoche: function(){
    var coche = Flota.findOne(Session.get("selectedFlotaId"));
    if(coche != null){
      return coche.nombreCoche;
    }
  },

  // libreHoy: function(coche){
  //   var companyfix = "Carflet "+coche;
  //   var reservasCoche = Bookings.find({'company': companyfix}).fetch();
  //   var today = new Date();
  //   var libreToday = true
  //   for(i=0; i<reservasCoche.length;i++){
  //     if (moment(today).isAfter(reservasCoche[i].fechareco) && moment(today).isBefore(reservasCoche[i].fechadevo) ){
  //       libreToday = false;
  //     }
  //   }
  //
  //   return libreToday;
  // },

  getCurrentUbicacion: function(coche){
    //Mirar si esta ocupado
    var companyfix = coche;
    var reservasCoche = Bookings.find({'company': companyfix}).fetch();
    var today = new Date();
    var libreToday = true;
    for(i=0; i<reservasCoche.length;i++){
      if (moment(today).isAfter(reservasCoche[i].fechareco) && moment(today).isBefore(reservasCoche[i].fechadevo) ){
        libreToday = false;
        if (reservasCoche[i].recogida != reservasCoche[i].devolucion){
          return "Transito entre "+reservasCoche[i].recogida+" y "+reservasCoche[i].devolucion;
        } else {
          return "Transito en "+reservasCoche[i].recogida;
        }

      }
      if (moment(today).isSame(reservasCoche[i].fechareco) || moment(today).isSame(reservasCoche[i].fechadevo) ){
        libreToday = false;
        return "Transito entre "+reservasCoche[i].recogida+" y "+reservasCoche[i].devolucion;
      }
    }


    if(libreToday){
      //Esta libre hoy, buscar ultima reserva
      var ultimaReserva = Bookings.find({'company': companyfix},{sort:{fechadevo: -1}}).fetch();

    }
    //Si está ocupado -> Ubicación -> Insert tránsito entre recogida y devolución


    //Si está libre -> hay que mirar la última reservasCoche
    //Si el lastUbicacionUpdate es posterior a la fecha de devolución de esa reserva -> mostrar el campo ubicación de la base de datos

    //Si el lastUbicacionUpdate es anterior a la fecha de devolución de esa reserva -> insertar como ubicacion el lugar de devolución

  },

  isAvailable: function(coche) {
      var companyfix = coche;
      var reservasCoche = Bookings.find({'company': companyfix}).fetch();
      var today = new Date();
      var libreToday = true
      for(i=0; i<reservasCoche.length;i++){
        if (moment(today).isAfter(reservasCoche[i].fechareco) && moment(today).isBefore(reservasCoche[i].fechadevo) ){
          libreToday = false;
        }
        if (moment(today).isSame(reservasCoche[i].fechareco) || moment(today).isSame(reservasCoche[i].fechadevo) ){
          libreToday = false;
        }
      }


      if(libreToday){
        return true;
      } else {
        return false;
      }
  },

  getAvailColor: function(coche){

    var companyfix = coche;
    var reservasCoche = Bookings.find({'company': companyfix}).fetch();
    var today = new Date();
    var libreToday = true
    for(i=0; i<reservasCoche.length;i++){
      if (moment(today).isAfter(reservasCoche[i].fechareco) && moment(today).isBefore(reservasCoche[i].fechadevo) ){
        libreToday = false;
      }
      if (moment(today).isSame(reservasCoche[i].fechareco) || moment(today).isSame(reservasCoche[i].fechadevo) ){
        libreToday = false;
      }
    }


    if(libreToday){
      return "#29cc73";
    } else {
      return "#cc2929";
    }
},

nextBookingPickupDate: function(coche){
    var companyfix = coche;
    var now = new Date();
    var reservasCoche = Bookings.find({'company': companyfix, fechareco: {'$gte': now}},{sort:{fechareco: -1}}).fetch();
    var the_return;
    if(reservasCoche.length > 0){
        the_return = moment(reservasCoche[0].fechareco).format("DD/MM/YYYY HH:MM");
    } else {
        the_return = "Sin resevas";
    }

    return the_return;
},

currentBookingReleaseDate: function(coche){
    var companyfix = coche;
    var now = new Date();
    var reservasCoche = Bookings.find({'company': companyfix},{sort:{fechareco: -1}}).fetch();
    var libreToday = true;
    var the_current;
    for(i=0; i<reservasCoche.length;i++){
      if (moment(now).isAfter(reservasCoche[i].fechareco) && moment(now).isBefore(reservasCoche[i].fechadevo) ){
        libreToday = false;
        the_current = reservasCoche[i];
      }
      if (moment(now).isSame(reservasCoche[i].fechareco) || moment(now).isSame(reservasCoche[i].fechadevo) ){
        libreToday = false;
        the_current = reservasCoche[i];
      }
    }

    return moment(the_current.fechadevo).format("DD/MM/YYYY HH:MM");
},

  // getCurrentLocation: function(coche){
  //   var companyfix = "Carflet "+coche;
  //   var reservasCoche = Bookings.find({'company': companyfix}).fetch();
  //   var today = new Date();
  //   var libreToday = true;
  //   for(i=0; i<reservasCoche.length;i++){
  //     if (moment(today).isAfter(reservasCoche[i].fechareco) && moment(today).isBefore(reservasCoche[i].fechadevo) ){
  //       libreToday = false;
  //       var currentLoc = "Tránsito entre "+reservasCoche[i].recogida+" y "+reservasCoche[i].devolucion+;
  //     }
  //   }
  //
  //
  //   if(libreToday){
  //     return
  //   } else {
  //     return "#cc2929";
  //   }
  // }
});


Template.flota.rendered = function()
{

        var mytemplate = this;

        mytemplate.subscribe('flota', function(){
          // Wait for the data to load using the callback
          Tracker.afterFlush(function () {
            // Use Tracker.afterFlush to wait for the UI to re-render
            // then use highlight.js to highlight a code snippet
            $('.datepicker').each(function(){
              $(this).datepicker({
                locale: 'es',
                weekStart: 1,
                format: 'dd-mm-yyyy'
              });
            });
          });
        });
    this.$('.datetimepicker').datetimepicker({
      language: 'es'
    });
    $('#reservasCalendar').fullCalendar({
        lang: 'es',
        weekends: true, // will hide Saturdays and Sundays
        displayEventEnd: true,
        nextDayThreshold: "00:00:00",
        dayClick: function(date, jsEvent, view) {

            // alert('Clicked on: ' + date.format());
            //
            // alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
            //
            // alert('Current view: ' + view.name);
            //
            // // change the day's background color just for fun
            // $(this).css('background-color', 'red');

        },

        eventMouseover: function( event, jsEvent, view ) {
            // console.log(event);
            // console.log(jsEvent);

            var tooltip = '<div class="tooltiptopicevent" style="width:auto;height:auto;background:'+event.color+';color:#ffffff;position:absolute;z-index:10001;padding:10px 10px 10px 10px ;  line-height: 200%;">' + event.coche + '<br>' + event.cliente + ' (' +event.procedencia + ') [ '+event.euroscarflet+'€ ]<br> '+event.de+' -> '+event.a+'<br>'+moment(event.start).format('DD/MM/YYYY, HH:mm')+' ->'+moment(event.end).format('DD/MM/YYYY, HH:mm')+'</div>';


            $("body").append(tooltip);
            $(this).mouseover(function (e) {
                $(this).css('z-index', 10000);
                $('.tooltiptopicevent').fadeIn('500');
                $('.tooltiptopicevent').fadeTo('10', 1.9);
            }).mousemove(function (e) {
                $('.tooltiptopicevent').css('top', e.pageY + 10);
                $('.tooltiptopicevent').css('left', e.pageX + 10);
            });

        },

        eventMouseout: function(event, jsEvent, view) {
            $(this).css('z-index', 8);
            $(".tooltiptopicevent").remove();
        },
        // events: [
        //   {
        //       title  : 'event1',
        //       start  : '2016-07-01'
        //   },
        //   {
        //       title  : 'event2',
        //       start  : '2016-07-05',
        //       end    : '2016-07-07'
        //   },
        //   {
        //       title  : 'event3',
        //       start  : '2016-07-09T12:30:00',
        //       allDay : false // will make the time show
        //   }
        // ]

        // events: function(start, end, timezone, callback) {
        //         var events = [];
        //         var reservasEvents = Bookings.find({'company': 'Carflet Kya Rio'});
        //
        //         reservasEvents.forEach(function (reserva_Event) {
        //             events.push({
        //             title: 'Kya Rio',
        //             start: reserva_Event.fechareco,
        //             end: moment(reserva_Event.fechadevo).add(1, 'days')
        //         });
        //    });
        //   callback(events);
        // }

        events: function(start, end, timezone, callback) {
                var events = [];
                var flota = Flota.find({}).fetch();
                for(i=0;i<flota.length;i++){
                  var companyfix = flota[i].nombreCoche;
                  var reservasCoche = Bookings.find({'company': companyfix, 'cancelada': false});
                  reservasCoche.forEach(function (reserva_Event) {
                      // console.log(reserva_Event);
                      events.push({
                        title: flota[i].nombreCoche +' '+ reserva_Event.recogida + '-' + reserva_Event.devolucion,
                        start: reserva_Event.fechareco,
                        end: reserva_Event.fechadevo,
                        color: flota[i].color,
                        euroscarflet: reserva_Event.euroscarflet,
                        cliente: reserva_Event.nombre,
                        coche: flota[i].nombreCoche,
                        procedencia: reserva_Event.procedencia,
                        de: reserva_Event.recogida,
                        a: reserva_Event.devolucion
                      });
                  });
                }
          callback(events);
        }
    });

    Tracker.autorun( () => {
      $( '#reservasCalendar' ).fullCalendar( 'refetchEvents' );
      // console.log('auto');
    });
}

Template.flota.events({
  "change .hook-lastitv": function(e){
    var currentId = this._id;
    var currentName = this.nombreCoche;
    var updatedDate = $(".card[name-coche='"+currentName+"']").find(".datepicker").datepicker('getDate');

    Meteor.call("updateLastITV", currentName, updatedDate);
  },

  "click .key__trigger": function(e){
    $(e.target).closest("li").find(".key-selector").removeClass("hide");
    $(".overlay-flota").addClass("opened");
    $(e.target).closest(".card").addClass("card--opened");
  },

  "click .overlay-flota": function(e) {
    $(".overlay-flota").removeClass("opened");
    $(".key-selector").addClass("hide");
  },

  "change .hook-oilChange": function(e) {
    var currentId = this._id;
    var currentName = this.nombreCoche;
    var updatedKm = $(".card[name-coche='"+currentName+"']").find(".hook-oilChange").val();

    Meteor.call("updateOilChange", currentName, updatedKm);
  },

  "change .hook-damages": function(e) {
    var currentId = this._id;
    var currentName = this.nombreCoche;
    var updatedDamages = $(".card[name-coche='"+currentName+"']").find(".hook-damages").val();

    Meteor.call("updateDamage", currentName, updatedDamages);
  },

  "change .llave-selector": function(e) {

    var theCar = $(e.target).attr("data-car");
    var theCarN = $(e.target).closest(".card").attr("name-coche");
    var theKey = $(e.target).attr("data-key");
    var theLoc = $(e.target).val();
    var theLocN = $('option:selected', $(e.target)).html();

    var myLlave = Llaves.find({'idFlota': theCar}).fetch().filter(llave => llave.ordinalInFlota == theKey);

    var myId = myLlave[0]._id;


    Meteor.call("updateKeyLoc", myId, theLoc, theLocN, function(error, result){
      if(error){
          FlashMessages.sendError("No se pudo enviar cambiar la llave)", { autoHide: true, hideDelay: 3000 });
      } else {
          FlashMessages.sendSuccess("Llave "+theKey+" del "+theCarN+" actualizada a "+theLocN+"", { autoHide: true, hideDelay: 3000 });
      }
      $(".overlay-flota").removeClass("opened");
      $(".key-selector").addClass("hide");
    });
  },


  "click .card": function(){
      Session.set("selectedFlotaId", this._id);
      // console.log(this._id);
  },

  "submit #newCarfletBooking": function(event){
      // function checkAvailability (coche, rec, dev){
      //     var companyfix = "Carflet "+coche.nombreCoche;
      //     var reservasCoche = Bookings.find({'company': companyfix}).fetch();
      //     console.log(reservasCoche);
      //     var libre = true;
      //     for(i=0; i<reservasCoche.length;i++){
      //       if ( moment(rec).isBefore(reservasCoche[i].fechareco) ){
      //         //La fecha nueva es anterior a la t1 -> comprobar que la devolucion tambien lo sea
      //         if( moment(dev).isAfter(reservasCoche[i].fechareco, 'day') || moment(dev).isSame(reservasCoche[i].fechadevo, 'day')){
      //           // recogida nueva anterior a la t1 y devo nueva posterior a t1 -> Se solapan
      //           libre = false;
      //         }
      //       }
      //
      //       if ( moment(rec).isAfter(reservasCoche[i].fechareco, 'day')){
      //         //La recogida nueva es posterior a t1 -> comprobar que tambien lo es a t2
      //         if( moment(rec).isBefore(reservasCoche[i].fechadevo, 'day') || moment(rec).isSame(reservasCoche[i].fechadevo, 'day')){
      //           libre = false;
      //         }
      //       }
      //
      //       if ( moment(rec).isSame(reservasCoche[i].fechareco, 'day') ){
      //         libre = false;
      //       }
      //     }
      //
      //     if( libre == true){
      //       return true;
      //     } else {
      //       return false;
      //     }
      // }
      // var nombreCliente = event.target.nombreCliente.value;
      // var carLugarReco = event.target.recogidalugar.value;
      // var carFechaReco = event.target.recogidafecha.value;
      // var carLugarDevo = event.target.devolucionlugar.value;
      // var carFechaDevo = event.target.devolucionfecha.value;
      //
      // console.log(carLugarReco);
      // console.log(carFechaReco);
      // console.log(carLugarDevo);
      // console.log(carFechaDevo);
      //
      // var coche = Flota.findOne(Session.get("selectedFlotaId"));
      // var nameCoche = coche.nombreCoche;
      //
      // if (checkAvailability(coche, carFechaReco, carFechaDevo)){
      //   console.log('esta libre');
      //   //Insertar en BD
      //   Bookings.insert({
      //     "factura": "SI",
      //     "procedencia": "Central de Reservas",
      //     "nombre": nombreCliente,
      //     "emailCliente": "Pendiente",
      //     "telefonoCliente": "Pendiente",
      //     "company": "Carflet "+coche.nombreCoche,
      //     "tipo": coche.categoria,
      //     "tarifa": "Pendiente",
      //     "recogida": carLugarReco,
      //     "fechareco": carFechaReco,
      //     "devolucion": carLugarDevo,
      //     "fechadevo": carFechaDevo,
      //     "supdevolucion": "0",
      //     "supgps": "0",
      //     "suptransfer": "0",
      //     "eurosprocedencia": "0",
      //     "eurosproveedor": "0",
      //     "userName": "web",
      //     "euroscarflet": "Pendiente",
      //     "notas": "Pendiente",
      //     "createdAt": new Date(),
      //     "numRegistro": 0,
      //     "dias": 2
      //   }, function(error) {
      //      if(error)
      //         console.log(error);
      //    });
      //    FlashMessages.sendSuccess("Reserva creada", { autoHide: true, hideDelay: 3000 });
      //    $('#reservasCalendar').fullCalendar( 'refetchEvents' );
      //
      // } else {
      //   console.log ('esta ocupado');
      //   // Sacar aviso
      //   FlashMessages.sendError("El coche está ocupado en esas fechas", { autoHide: true, hideDelay: 3000 });
      // }
      // //Prevent submit
      // return false;

  },

  "submit #addCoche": function(event){

    //   console.log(event.currentTarget.nombreCoche.value);
      var nombreCoche = event.currentTarget.nombreCoche.value;
      var categoria = event.currentTarget.categoria.value;
      var color = event.currentTarget.color.value;
      var year = event.currentTarget.año.value;
      var pasajeros = event.currentTarget.pasajeros.value;
      var maletas = event.currentTarget.maletas.value;
      var imagen = event.currentTarget.imagen.value;
      var ubicacion = event.currentTarget.ubicacion.value;


      Flota.insert({
        "nombreCoche": nombreCoche,
        "categoria": categoria,
        "color": color,
        "año": year,
        "pasajeros": pasajeros,
        "maletas": maletas,
        "imagen": imagen,
        "ubicacion": ubicacion
      }, function(error) {
         if(error)
            console.log(error);
       });

  },

  "submit #bookingFromFlota": function(event){
      function checkAvailability (coche, rec, dev){
          var companyfix = "Carflet "+coche.nombreCoche;
          var reservasCoche = Bookings.find({'company': companyfix}).fetch();
          // console.log(reservasCoche);
          var libre = true;
          for(i=0; i<reservasCoche.length;i++){
            if ( moment(rec).isBefore(reservasCoche[i].fechareco) ){
              //La fecha nueva es anterior a la t1 -> comprobar que la devolucion tambien lo sea
              if( moment(dev).isAfter(reservasCoche[i].fechareco) || moment(dev).isSame(reservasCoche[i].fechadevo)){
                // recogida nueva anterior a la t1 y devo nueva posterior a t1 -> Se solapan
                libre = false;
              }
            }

            if ( moment(rec).isAfter(reservasCoche[i].fechareco)){
              //La recogida nueva es posterior a t1 -> comprobar que tambien lo es a t2
              if( moment(rec).isBefore(reservasCoche[i].fechadevo) || moment(rec).isSame(reservasCoche[i].fechadevo)){
                libre = false;
              }
            }

            if ( moment(rec).isSame(reservasCoche[i].fechareco) ){
              libre = false;
            }
          }

          if( libre == true){
            return true;
          } else {
            return false;
          }
      }
      var nombreCliente = event.target.nombreCliente.value;
      var carLugarReco = event.target.lugarRecogida.value;
      var carFechaReco = new Date(event.target.momentoRecogida.value);
      var carLugarDevo = event.target.lugarDevolucion.value;
      var carFechaDevo = new Date(event.target.momentoDevolucion.value);

      // console.log(carLugarReco);
      // console.log(carFechaReco);
      // console.log(carLugarDevo);
      // console.log(carFechaDevo);

      var coche = Flota.findOne(Session.get("selectedFlotaId"));
      var nameCoche = coche.nombreCoche;

      if (checkAvailability(coche, carFechaReco, carFechaDevo)){
        console.log('esta libre');
        //Insertar en BD
        Bookings.insert({
          "factura": "SI",
          "procedencia": "Central de Reservas",
          "nombre": nombreCliente,
          "emailCliente": "Pendiente",
          "telefonoCliente": "Pendiente",
          "company": "Carflet "+coche.nombreCoche,
          "tipo": coche.categoria,
          "tarifa": "Pendiente",
          "recogida": carLugarReco,
          "fechareco": carFechaReco,
          "devolucion": carLugarDevo,
          "fechadevo": carFechaDevo,
          "pagada" : false,
          "supdevolucion": "0",
          "supgps": "0",
          "suptransfer": "0",
          "eurosprocedencia": "0",
          "eurosproveedor": "0",
          "userName": "web",
          "euroscarflet": "Pendiente",
          "notas": "Pendiente",
          "createdAt": new Date(),
          "numRegistro": 0,
          "dias": 2
        }, function(error) {
           if(error)
              console.log(error);
         });
         FlashMessages.sendSuccess("Reserva creada", { autoHide: true, hideDelay: 3000 });
         $('#newCarfletBooking').modal('hide');
         $('#reservasCalendar').fullCalendar( 'refetchEvents' );

      } else {
        console.log ('esta ocupado');
        // Sacar aviso
        FlashMessages.sendError("El coche está ocupado en esas fechas", { autoHide: true, hideDelay: 3000 });
      }
      //Prevent submit
      return false;

  },
});
