Meteor.methods({
    insertTask:function(taskjson){
        TareasWorkers.insert({'type': taskjson.type, 'worker': taskjson.worker, 'tarea': taskjson.tarea, 'precio': taskjson.precio, 'coche': taskjson.coche, 'comments': taskjson.comments, 'ciudad': taskjson.ciudad, 'fecha': taskjson.fecha});
    },
    
    pushCosteTask: function(myid, newCoste){
        TareasWorkers.update(myid, {
            $set: {precio: newCoste},
        });
    },
    
    setWorkerInactive: function(id){
        Workers.update({_id: id}, {$set: {isActive: false}});
    },

    setWorkerActive: function(id){
        Workers.update({_id: id}, {$set: {isActive: true}});
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
    }
})