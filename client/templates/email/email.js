Template.email.rendered = function (){
  $('#rootwizard').bootstrapWizard({
      tabClass: 'nav nav-pills',
      onNext: function(tab, navigation, index) {
          if(index == 5){
            var text = $('#recogidainfo').val();
            $('#inforecofin').html(text.replace(/\n\r?/g, "<br>"));
            var text = $('#recogidahoras').val();
            $('#infohorariorecofin').html(text.replace(/\n\r?/g, "<br>"));
            var text = $('#devoinfo').val();
            $('#infodevofin').html(text.replace(/\n\r?/g, "<br>"));
            var text = $('#codigores').val();
            $('#codresfin').html(text);
            var text = $('#cuponreg').val();
            $('#cuponfin').html(text);
            var text = $('#cuponorbit').val();
            $('#cuponorfin').html(text);
            var text = $("#importecupon").val();
            $("#importecuponfin").html(text);
            if($(".otraempresa").is(':checked')){
              $('#empresafin').html($('#otraempresa').val());
            } else{
              $('#empresafin').html($('input[name=empresas]:checked').val());
            }

          }
      },
      onTabShow: function(tab, navigation, index) {
        var $total = navigation.find('li').length;
        var $current = index+1;
        var $percent = ($current/$total) * 100;
        $('#rootwizard').find('.bar').css({width:$percent+'%'});
      }
  });

  this.$('.radio').first().addClass('active');
  if($(".otraempresa").is(':checked')){
      $("#otraempresa").removeClass('hidden');
  }

}

Template.registerHelper('empresaReserva', function(lugarRecogida){
      var ofi = Oficinas.findOne({"nombre": lugarRecogida});
      ofi.empresas[0].defecto = "true"
      return ofi.empresas;
});

Template.registerHelper('getTipoOfiReco', function(lugarRecogida){
      var ofi = Oficinas.findOne({"nombre": lugarRecogida});
      return ofi.tipo;
});

Template.registerHelper('getAddress', function(lugar){
      var ofi = Oficinas.findOne({"nombre": lugar});
      return ofi.direccion.lugar +"\n"+ ofi.direccion.calle +"\n"+ ofi.direccion.cp +"\n"+ ofi.direccion.ciudad +"\n"+ ofi.empresas[0].telefono;
});

Template.registerHelper('getHorario', function(lugar){
      var ofi = Oficinas.findOne({"nombre": lugar});
      return "Lunes a Jueves: " + ofi.horario.LJ +"\n"+
             "Viernes: " + ofi.horario.V +"\n"+
             "Sábado: " + ofi.horario.S +"\n"+
             "Domingo: " + ofi.horario.D;
});

Template.email.events({
  'click .radio': function(event){
      if($(".otraempresa").is(':checked')){
          $("#otraempresa").removeClass('hidden');
      }
      else{
          $("#otraempresa").addClass('hidden');
      }
  },

  'click .checkregalo': function(event){
      if($(".checkregalo").is(':checked')){
          $("#cuponcol").removeClass('hidden');
      }
      else{
          $("#cuponcol").addClass('hidden');
      }
  },

  'click .checkorbyt': function(event){
      if($(".checkorbyt").is(':checked')){
          $("#orbytcol").removeClass('hidden');
      }
      else{
          $("#orbytcol").addClass('hidden');
      }
  },

  'click .sendEmail': function(event){
    console.log('dale');
    var emailhtml = Blaze.toHTMLWithData(Template.emailTemplate);

    var arrayInfoReco = $('#inforecofin').html().split("<br>");
    var arrayInfoDevo = $('#infodevofin').html().split("<br>");
    var arrayHoraReco = $('#infohorariorecofin').html().split("<br>");

    var flagReg = 1;
    var flagOr = 1;

    if($("#cuponcol").hasClass('hidden')){
      flagReg = 0;
    }

    if($("#orbytcol").hasClass('hidden')){
      flagOr = 0;
    }


    var emailData = {
      empresa: $('#empresafin').html(),
      ofiReco: $('#recoofi').html(),
      ofiDevo: $('#devoofi').html(),
      infoReco:  arrayInfoReco,
      infoDevo: arrayInfoDevo,
      horarioReco: arrayHoraReco,
      horaReco: $('#horaReco').html(),
      codigoReserva: $('#codresfin').html(),
      cupon: $('#cuponfin').html(),
      importedelcupon: $('#importecuponfin').html(),
      orbyt: $('#cuponorfin').html(),
      flagRegalo: flagReg,
      flagOrbit: flagOr
    }

    console.log(emailData);

    var destinatario = $('#mailCli').html();

    Meteor.call('sendEmail',
            destinatario,
            'info@carflet.es',
            'Confirmación de Reserva en Carflet Rent a Car',
            emailData);

    Meteor.call('sendEmail',
                'info@carflet.es',
                'info@carflet.es',
                'Confirmación de Reserva en Carflet Rent a Car',
                emailData);

    FlashMessages.sendSuccess("Email Enviado", { autoHide: true, hideDelay: 3000 });
  }
});
