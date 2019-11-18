import { Meteor } from 'meteor/meteor'

Meteor.publish("bookings", function(){
    return Bookings.find();
});

Meteor.publish("ciudades", function(){
    return Ciudades.find();
});

Meteor.publish("contacts", function(){
    return Contacts.find();
});

Meteor.publish("updates", function(){
    return Updates.find();
});

Meteor.publish("helpersfactura", function(){
    return HelpersFactura.find();
});

Meteor.publish("flota", function(){
    return Flota.find();
});

Meteor.publish("oficinas", function(){
    return Oficinas.find();
});

Meteor.publish("incomes", function(){
    return Incomes.find();
});

Meteor.publish("enterprises", function(){
    return Enterprises.find();
});

Meteor.publish("devexpenses", function(){
    return DevExpenses.find();
});

Meteor.publish("activities", function(){
    return Activities.find({}, {limit: 30});
});

Meteor.publish("workers", function(){
    return Workers.find();
});

Meteor.publish("presupuestos", function(){
    return Presupuestos.find();
});

Meteor.publish("tareasworkers", function(){
    return TareasWorkers.find();
});

Meteor.publish("tides", function(){
    return Tides.find();
});

Meteor.publish("comisionables", function(){
    return Comisionables.find();
});

Meteor.publish("llaves", function(){
  return Llaves.find();
});

Meteor.publish("invoices", function(){
  return Invoices.find();
});

Meteor.publish("multas", function(){
  return Multas.find();
});