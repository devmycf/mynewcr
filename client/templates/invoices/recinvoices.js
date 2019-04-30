Template.recinvoices.helpers({
    comi: function() {
        return Comisionables.find({}, {sort:{name: 1}});
    }
});