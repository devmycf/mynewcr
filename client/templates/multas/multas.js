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
            FlashMessages.sendSuccess("Multa añadida", { autoHide: true, hideDelay: 3000 });
        },
        onError: function(formType, error) {
          console.log('Error!!!');
          console.log(error);
          FlashMessages.sendError("Error en la creacion", { autoHide: true, hideDelay: 3000 });
        }
    },
    editMulta: {
        onSuccess: function(formType, result) {
            $('#updateMultaModal').modal('toggle');
            FlashMessages.sendSuccess("Multa Actualizada", { autoHide: true, hideDelay: 3000 });
        },
        onError: function(formType, error) {
          console.log('Error!!!');
          console.log(error);
          FlashMessages.sendError("Error en la creacion", { autoHide: true, hideDelay: 3000 });
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

        var newpagada = !this.isPagada;
        
        Meteor.call("setPagadaMulta", this, newpagada, userAct)
    },

    "click .status-envio": function(){
        // console.log(this);
        var newStatus;
        var userAct = Meteor.user().username;

        var newEnv = !this.isEnviada;
        
        Meteor.call("setEnviadaMulta", this, newEnv, userAct)
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
  