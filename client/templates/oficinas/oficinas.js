Template.oficinas.helpers({
    initializeCalendars: function(){
        $(".datepicker").each(function(){
          console.log($(this));
          $(this).datepicker({
            locale: 'es',
            weekStart: 1,
            format: 'dd-mm-yyyy'
          });
        })
    },

    selectedOfiId: function(){
        return Oficinas.findOne(Session.get("selectedOfiId"));
    },

    enterprises: function(){
        return Enterprises.find({});
    },

    comisionables: function(){
        return Comisionables.find({}, {sort:{name: 1}});
    },

    ciudades: function(){
        return Ciudades.find({}, {sort:{nombre: 1}});
    },

    isPending: function(){
      if(this.pendienteLiquidar){
        return "rowpend";
      } else {
        return "";
      }
    },

    comipendientes: function(){
        return Comisionables.find({pendienteLiquidar:true}, {sort:{name:1}});
    },

    isRawLiquidacion: function(idComisionable, nombreComisionable, fecha){
        var today = new Date();
        var liquidables = Bookings.find({comisionPerson:nombreComisionable, fechareco: {$gte: fecha}, fechareco: {$lte: today}}).fetch().length;
    },

    bookingsPorLiquidar: function(idComisionable, nombreComisionable, fecha){
        // Ojo con la fecha
        var today = new Date();
        var toLiquidar = Bookings.find({comisionPerson:nombreComisionable, fechareco: {$gte: fecha, $lte: today}});
        return toLiquidar;
    },

    comisionableToLiquidar: function(){
        return Session.get("selectedComiName");
    },

    hasPendingBookings: function(idComisionable, nombreComisionable, fecha){
      var today = new Date();
      var toLiquidar = Bookings.find({comisionPerson:nombreComisionable, fechareco: {$gte: fecha, $lte: today}}).fetch();
      if(toLiquidar.length > 0){
        return true;
      } else {
        return false;
      }
    },

    hasUpcomingPending: function(idComisionable, nombreComisionable, fecha){
      var today = new Date();
      var toLiquidar = Bookings.find({comisionPerson:nombreComisionable, fechareco: {$gte: today}}).fetch();
      if(toLiquidar.length > 0){
        return true;
      } else {
        return false;
      }
    }
});

Template.oficinas.rendered = function() {
    var mytemplate = this;

    mytemplate.subscribe('comisionables', function(){
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
}

Template.oficinas.events({
    "click .available_cities .citytag": function(){
      var selectedCityId = this._id;
      var selectedCityNombre = this.nombre;
      var newSelectedCity = $(".citytemp").clone().removeClass("citytemp hide");
      $(newSelectedCity).attr("city-id", selectedCityId);
      $(newSelectedCity).attr("city-key", selectedCityNombre);
      $(newSelectedCity).find("p").html(selectedCityNombre);
      $(".selected_cities").append(newSelectedCity);

      //En available cambia la ciudad
      $(".available_cities").find(".citytag[city-id="+selectedCityId+"]").addClass("is-selected");

      //En selected quita el All
      $(".selected_cities").find(".all-hook").addClass("hide");
    },

    "click .selected_cities .citytag": function(){
      var selectedCityId = this._id;
      var selectedCityNombre = this.nombre;
    },

    "click .ofirow": function(){
        Session.set("selectedOfiId", this._id);
    },

    "click .comipendpanel": function(){
        Session.set("selectedComiId", this._id);
        Session.set("selectedComiName", this.name);
        Session.set("selectedLastLiquidacion", this.lastLiquidacion);
    },

    "click .confirmLiquidacionBtn": function(){
      var updatedDate = new Date();
      var theComisId = Session.get("selectedComiId");
      var theComisLastLiquid = Session.get("selectedLastLiquidacion");
      var today = new Date();
      var toLiquidar = Bookings.find({comisionId:theComisId, fechareco: {$gte: today}}).fetch();
      if(toLiquidar.length > 0){
        //Hay reservas futuras, pero ¿las habia pasadas?
        var oldBookings = Bookings.find({comisionId:theComisId, fechareco: {$gte: theComisLastLiquid, $lte: today}}).fetch();
        if(oldBookings.length == 0){
          // Solo hay reservas futuras -> No actualizar la fecha, ni cambiar el flag
          $('#confirmLiquidacion').modal('toggle');
        } else {
          // Habia reservas pendientes, pero tambien futuras -> mantener el flag, pero cambiar la fecha
          Comisionables.update({_id: theComisId}, {$set:{lastLiquidacion: updatedDate}}, function(error, result){
            if(result){
              $('#confirmLiquidacion').modal('toggle');
              // alert ("comisionable liquidado")
            } else {
              console.log(error);
            }
          });
        }
      } else {
        // No hay reservas futuras, pero ¿las habia pasadas?
        var oldBookings = Bookings.find({comisionId:theComisId, fechareco: {$gte: theComisLastLiquid}}).fetch();
        if(oldBookings.length == 0){
          // No habia reservas de ningun tipo -> cambia flag a false, pero manten la fecha
          Comisionables.update({_id: theComisId}, {$set:{pendienteLiquidar: false}}, function(error, result){
            if(result){
              $('#confirmLiquidacion').modal('toggle');
              // alert ("comisionable liquidado")
            } else {
              console.log(error);
            }
          });
        } else {
          // Habia reservas por liquidar, pero no queda ninguna futura. Caso normal -> cambia el flag a false y actualiza la fecha
          Comisionables.update({_id: theComisId}, {$set:{pendienteLiquidar: false, lastLiquidacion: updatedDate}}, function(error, result){
            if(result){
              $('#confirmLiquidacion').modal('toggle');
              // alert ("comisionable liquidado")
            } else {
              console.log(error);
            }
          });
        }
      }
      // Check futuras
      // if(Template.oficinas.__helpers.get('hasUpcomingPending').call()){
      //   console.log("tiene futuras");
      // } else {
      //   console.log("no tiene");
      // }

    },

    "submit #new-comisionable": function(e){
      e.preventDefault();
      var nombre = $("#com_name").val();
      var fecha = $("#last-liquidacion").datepicker('getDate');
      // console.log(fecha);
      Comisionables.insert({name: nombre, pendienteLiquidar: false, lastLiquidacion: fecha}, function(error, result){
        if(result){
          alert("comisionable creado");
          $("#com_name").val("");
          $("#last-liquidacion").val("");
        } else {
          alert("Error!");
          console.log(error);
        }
      });
    },

    "change .hook-comi": function(e){
        console.log("wea");
        var currentId = this._id;
        console.log(currentId);
        var updatedDate = $("tr[comi-id="+currentId+"]").find(".datepicker").datepicker('getDate');
        console.log(updatedDate);
        // var newCoste = $(e.target).val();
        // // console.log(newCoste);
        Meteor.call("updateLastLiquidacionDate", currentId, updatedDate);
        // Meteor.call("test");
    },

    "click .delete-ofi": function(){
        if(confirm('¿Estás seguro de eliminar esta oficina?')){
            Oficinas.remove(this._id);
            FlashMessages.sendSuccess("Reserva Eliminada", { autoHide: true, hideDelay: 3000 });
        }
    },

    'submit #newofi': function(e){
        e.preventDefault();
        var nombre = $("#nombre").val();
        var lugar = $("#lugar").val();
        var calle = $("#calle").val();
        var cp = $("#cp").val();
        var ciudad = $("#ciudad").val();
        var direccion = {
            "lugar": lugar,
            "calle": calle,
            "cp": cp,
            "ciudad": ciudad
        }

        console.log(direccion);

        var lj = $("#h-lj").val();
        var v = $("#h-v").val();
        var s = $("#h-s").val();
        var d = $("#h-d").val();

        var tipo = $('input[name=optradio]:checked').val();

        console.log(tipo);
        var horario = {
            "LJ": lj,
            "V": v,
            "S": s,
            "D": d
        }

        console.log(horario);

        // var empresas = []
        // var empresa = $('input[name=entradio]:checked').val();
        // var telf = $("#telf").val();
        // var infoempresa = {
        //     "nombre": empresa,
        //     "telefono": telf
        // }
        //
        // console.log(infoempresa);
        //
        // empresas.push(infoempresa);
        //
        // console.log(empresas);


        var oficina = {
            "nombre": nombre,
            "direccion": {
                "lugar": lugar,
                "calle": calle,
                "cp": cp,
                "ciudad": ciudad
            },
            "horario": {
                "LJ": lj,
                "V": v,
                "S": s,
                "D": d
            }
        }

        Meteor.call("addOficina", oficina);

        console.log("sent");

    }
});
