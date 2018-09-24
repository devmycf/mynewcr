Template.monthlyBookings.helpers({
 bookingsThisMonth: function(){
   var mesIni = this.mes;
   var mesFin = mesIni + 1;
   if(mesIni == 12){
       var start = moment("12-01-2018", "MM-DD-YYYY").toDate();
       var end = moment("12-31-2018", "MM-DD-YYYY").toDate();
   } else {
       var start = moment(mesIni+"-01-2018", "MM-DD-YYYY").toDate();
       var end = moment(mesFin+"-01-2018", "MM-DD-YYYY").toDate();
   }

   return Bookings.find({createdAt: {'$gte': start, '$lt': end}},{sort:{fechareco: 1}});
 },

 bookingsThisMonthCounter: function(){
   var mesIni = this.mes;
   var mesFin = mesIni + 1;
   if(mesIni == 12){
       var start = moment("12-01-2018", "MM-DD-YYYY").toDate();
       var end = moment("12-31-2018", "MM-DD-YYYY").toDate();
   } else {
       var start = moment(mesIni+"-01-2018", "MM-DD-YYYY").toDate();
       var end = moment(mesFin+"-01-2018", "MM-DD-YYYY").toDate();
   }

   return Bookings.find({createdAt: {'$gte': start, '$lt': end}},{sort:{fechareco: 1}}).fetch().length;
 },

 getMes: function(){
   return this.nombMes;

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

 isSomethingComisoned: function(id){
   // console.log(id);
   var theBooking = Bookings.findOne({_id: id});
   // console.log(theBooking);
   if(theBooking.comisionPerson == "" || theBooking.comisionPerson == "undefined" || theBooking.isComissioned == false){
     return "hide";
   }
 },

 isThisSelected: function(name, company){
    if (name == company){
        return "selected";
    } else {
        return "";
    }
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

 isThisSelected: function(name, company){
    if (name == company){
        return "selected";
    } else {
        return "";
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

 isCompleted: function(id){
     var theBooking = Bookings.findOne({_id: id});
     console.log("·fgfdsg");
     console.log(theBooking);

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
})
