Template.contacts.helpers({
    selectedContactDoc: function(){
        return Contacts.findOne(Session.get("selectedContactId"));
    }
});


Template.contacts.events({
    "click .contactrow": function(){
        Session.set("selectedContactId", this._id);
    },
    "submit #contactModal .modal-body": function(event){
        //$('#contactModal').modal('hide');
        FlashMessages.sendSuccess("Contacto Creado", { autoHide: true, hideDelay: 3000 });
        //Prevent submit
        return false;

    },
    "click .delete-booking": function(){
        if(confirm('¿Estás seguro de eliminar esta reserva?')){
            Contacts.remove(this._id);
            FlashMessages.sendSuccess("Contacto Eliminado", { autoHide: true, hideDelay: 3000 });
        }
    },

    "click .downloadExcelContacts": function () {
        Meteor.call('downloadExcelContactsFile', function(err, fileUrl) {
          console.log(fileUrl);
          var link = document.createElement("a");
          link.download = 'ListadoContactos.xlsx';
          link.href = fileUrl;
          link.click();
        });
    },

    "submit .modal-up": function(event){
        $('#updatecontactModal').modal('hide');
        FlashMessages.sendSuccess("Contacto Actualizado", { autoHide: true, hideDelay: 3000 });
        //Prevent submit
        return false;
    }
});
