Template.multas.helpers({
    isPendiente: function(sent){
        return sent == 0;
    },
    isSent: function(sent){
        return sent == 1;
    },

    selectedMultaDoc: function(){
        return Multas.findOne(Session.get("selectedMultaId"));
    },
});

AutoForm.hooks({
    addMulta: {
        onSuccess: function(formType, result) {
            $('#addMultaModal').modal('toggle');
        },
        onError: function(formType, error) {
          console.log('Error!!!');
          console.log(error);
        }
    },
    editMulta: {
        onSuccess: function(formType, result) {
            $('#updateMultaModal').modal('toggle');
        },
        onError: function(formType, error) {
          console.log('Error!!!');
          console.log(error);
        }
    },
});


Template.multas.events({
    "click .multarow": function(){
        Session.set("selectedMultaId", this._id);
    },
    "click .status-pago": function(){
        // console.log(this);
        var newStatus;
        var userAct = Meteor.user().username;
        var newestado = this.status + 1;

        (newestado == 3)? newestado = 0: newestado = newestado;

        Meteor.call("setEstadoMulta", this, newestado, userAct);
    },
  
    "blur .ctePresup": function(e){
        // console.log("wea");
        var currentId = this._id;
        var newCoste = $(e.target).val();
        // console.log(newCoste);
        Meteor.call("pushImporteMulta", currentId, newCoste);
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
  
    "click .delete-booking": function(){
        var theMulta = Multas.findOne({_id: this._id});
  
        if(confirm('¿Estás seguro de eliminar esta multa?')){
            Multas.remove(this._id);
            FlashMessages.sendSuccess("Multa Eliminada", { autoHide: true, hideDelay: 3000 });
        }
    },
  });
  