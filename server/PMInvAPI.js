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
})