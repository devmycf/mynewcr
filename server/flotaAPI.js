Meteor.methods({
    updateLastITV: function(carName, laFecha){
        Flota.update({nombreCoche: carName}, {$set: {lastITV: laFecha}});
    },

    updateOilChange: function(carName, km) {
        Flota.update({nombreCoche: carName}, {$set: {oilChange: km}});
    },

    updateDamage: function(carName, dam) {
        Flota.update({nombreCoche: carName}, {$set: {damages: dam}});
    },
});