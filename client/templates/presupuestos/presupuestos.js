Template.presupuestos.helpers({
  formatDate: function(date){
      return moment(date).format("DD-MMM-YYYY")
  },

  enterprises: function(){
      return Enterprises.find({});
  },

  isThisSelected: function(name, company){
     if (name == company){
         return "selected";
     } else {
         return "";
     }
  },

  flota: function(){
      return Flota.find({});
  },

  isSent: function(sent){
    console.log("in");
    console.log(sent);
    if(sent != true){
      return "pend-sent"
    }
  }
  // create: function(){
  //
  // },
  // rendered: function(){
  //
  // },
  // destroyed: function(){
  //
  // },
});

AutoForm.hooks({
insertPresupForm: {
    onSuccess: function(formType, result) {
        $('#newPresupModal').modal('toggle');
    },
    onError: function(formType, error) {
      console.log('Error!!!');
      console.log(error);
    }
}
});

Template.presupuestos.events({
  "click .status-pago": function(){
      // console.log(this);
      var newStatus;
      var userAct = Meteor.user().username;
      if(this.sent){
          newStatus = false;
      } else {
          newStatus = true;
      }
      Meteor.call("setPresuSent", this, newStatus, userAct);
  },

  "change .companyPresup": function(e){
      // console.log("yeah");
      // var currentId = this._id;
      var currentId = this._id;
      var newCar = $(e.target).val();
      // console.log(newCar);
      Meteor.call("pushCompanyPresup", currentId, newCar);
  },

  "blur .ctePresup": function(e){
      // console.log("wea");
      var currentId = this._id;
      var newCoste = $(e.target).val();
      // console.log(newCoste);
      Meteor.call("pushCostePresup", currentId, newCoste);
      // Meteor.call("test");
  },

  "blur .observ": function(e){
      // console.log("wea");
      var currentId = this._id;
      var newCoste = $(e.target).val();
      // console.log(newCoste);
      Meteor.call("pushObserv", currentId, newCoste);
      // Meteor.call("test");
  },

  "blur .precioPresup": function(e){
      // console.log("wea");
      var currentId = this._id;
      var newCoste = $(e.target).val();
      // console.log(newCoste);
      Meteor.call("pushprecioPresup", currentId, newCoste);
      // Meteor.call("test");
  },

  "click .delete-booking": function(){
      var theTask = Presupuestos.findOne({_id: this._id});

      if(confirm('¿Estás seguro de eliminar este presupuesto?')){
          Presupuestos.remove(this._id);
          FlashMessages.sendSuccess("Presupuesto Eliminado", { autoHide: true, hideDelay: 3000 });
      }
  },
});
