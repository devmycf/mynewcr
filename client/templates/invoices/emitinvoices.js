Template.emitinvoices.helpers({
    emitInvoices: function(){
        console.log("sdaf");
        return Invoices.find({'isRecibidaFactura': false}).fetch()
    }
});