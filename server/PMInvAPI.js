Meteor.methods({
    pushCompanyPresup: function(preId, the_company){
        Presupuestos.update({_id: preId}, {$set: {company: the_company}});
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
  
    setPagadaMulta: function(res, status, username) {
        Multas.update(res._id, {
            $set: {isPagada: status},
        });
    },
  
    setEnviadaMulta: function(res, status, username) {
        Multas.update(res._id, {
            $set: {isEnviada: status},
        });
    },

    updateNumFact: function(){
        // DEPRECATED
        var numActual = 1;

        Bookings.find({},{sort:{fechareco: 1}}).forEach(function(booking) {
            if(booking.factura == "SI"){
                Bookings.update(booking._id, {
                    $set: {numFactura: numActual}
                });

                numActual++;
            }

            else{
                // console.log("NO FACTURA");
                Bookings.update(booking._id, {
                    $set: {numFactura: 0}
                });
            }
        });

        return false;
    },

    insertFactura: function(fecha, numero){
        console.log("llego");
        HelpersFactura.remove({});
        HelpersFactura.insert({facFecha: fecha, facTodayNumber: numero});
    },
  
    insertFacturaManagement: function(fecha, numero, tipo, idcomi, nameComi, dirComi, dirComi2, cifComi, precio, fechaEntrega){
  
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
})