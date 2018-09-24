Meteor.subscribe("bookings");
//Ahora el meteor subscribe de bookings está en el template

// handle = Meteor.subscribeWithPagination('bookings', 5);
Meteor.subscribe("contacts");
Meteor.subscribe("updates");
Meteor.subscribe("flota");
Meteor.subscribe("helpersfactura");
Meteor.subscribe("oficinas");
Meteor.subscribe("incomes");
Meteor.subscribe("enterprises");
Meteor.subscribe("devexpenses");
Meteor.subscribe("activities");
Meteor.subscribe("workers");
Meteor.subscribe("tareasworkers");
Meteor.subscribe("presupuestos");
Meteor.subscribe("tides");
Meteor.subscribe("comisionables");
Meteor.subscribe("ciudades");


Meteor.startup(function () {
    AccountsEntry.config({
      homeRoute: '/',
      dashboardRoute: '/',
      passwordSignupFields: 'USERNAME_AND_EMAIL'
    });

    Accounts.ui.config({
        passwordSignupFields: 'USERNAME_AND_EMAIL'
    });


});
