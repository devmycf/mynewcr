Template.pendingBookings.helpers({
    pending: function(){
        var allBookings = Bookings.find({}).fetch()
        var pending = [];

        for(var i = 0; i<allBookings.length; i++){
            if (allBookings[i].company == "Concretar" || allBookings[i].company == "Pendiente" || allBookings[i].pagada == false || typeof allBookings[i].pagada === "undefined"){
                    pending.push(allBookings[i]);
            }
        }
        return pending;
    },

    enterprises: function(){
        return Enterprises.find({});
    },

    flota: function(){
        return Flota.find({});
    },

    comisionables: function(){
        return Comisionables.find({}, {sort:{name: 1}});
    },

    isThisSelected: function(name, company){
       if (name == company){
           return "selected";
       } else {
           return "";
       }
    },

    isSomethingComisoned: function(id){
      // console.log(id);
      var theBooking = Bookings.findOne({_id: id});
      // console.log(theBooking);
      if(theBooking.comisionPerson == "" || theBooking.comisionPerson == "undefined" || theBooking.isComissioned == false){
        return "hide";
      }
    },

    hasAWorker: function(id) {
      // console.log(id);
      if (id != "" && id != null) {
        return true;
      } else {
        return false;
      }
    },


    activeWorkers: function(){
      return Workers.find({isActive: true}).fetch();
    },

    formatCity: function(d){
      return d.slice(0,2).toUpperCase();
    },
    isWithOurCars: function(id){
        // console.log(id);
        var theBooking = Bookings.findOne({_id: id});
        var theFleet = Flota.find({},{fields: {'nombreCoche': 1}}).fetch();
        // console.log(theBooking);
        // console.log(theFleet);
        var currentCar = theBooking.company;
        var our = false;

        for(var i = 0; i<theFleet.length;i++){
            if(currentCar == theFleet[i].nombreCoche){
                our = true;
            }
        }

        return our;
    },

    isCompleted: function(id){
        var theBooking = Bookings.findOne({_id: id});

            if(theBooking.company == "Concretar" || theBooking.company == "Pendiente" || theBooking.pagada == false || typeof theBooking.pagada === "undefined"){
                return false;
            } else {
                return true;
            }

    },

    isPartialPrepaid: function(pre){
       if (pre == "" || pre == null){
           return false;
       } else {
           return true;
       }
    }
});
