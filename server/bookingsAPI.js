Meteor.methods({
    pushMatricula: function(myid, newM){
        Bookings.update(myid, {
           $set: {matribooking: newM},
        });
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

    assignDevoWorker: function(idBooking, idWorker, nameWorker){
        Bookings.update({_id: idBooking}, {$set: {devoworker: nameWorker, devoworkerId: idWorker}});
    },

    pushCoste: function(myid, newCoste){
        Bookings.update(myid, {
           $set: {costeCoche: newCoste},
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

    setCancelBooking: function(res, statusCancel, username) {
        Bookings.update(res._id, {
          $set: {
            cancelada: statusCancel
          }
        })
    },

    setPago: function(res, statusPago, username){
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
    },
})