Meteor.methods({
    updateCityForComi: function(myId, myCity){
        Comisionables.update({_id:myId}, {$set: {ciudad: myCity}});
    },
    
    updateLastLiquidacionDate: function(comiId, laFecha){
        Comisionables.update({_id: comiId}, {$set: {lastLiquidacion: laFecha}});
    },

    addOficina: function(oficina){
        Oficinas.insert(oficina);
    },
});