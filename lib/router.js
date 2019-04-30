import { Meteor } from 'meteor/meteor';

Router.configure({
    layoutTemplate: 'layout'
});



Router.map(function(){
    // Bookings Route
    this.route('bookings',{
        path: '/bookings',
        template: 'bookings',
        onBeforeAction: function(pause){
            if(Meteor.userId()){
                this.layout('layout');
                this.render('bookings');
            } else {
                this.layout('outLayout');
                this.render('login');
            }
        }
    });

    this.route('/bookingsmonth', {
      path: '/thebookings/:_year/month/:_month',
      data: function(){
        var parameters = {
          'month': this.params._month,
          'year': this.params._year,
          'quarter': this.params._quarter,
          'type': 'M',
        };
        return parameters;
      },
      onBeforeAction: function(pause){
          if(Meteor.userId()){
              this.layout('layout');
              this.render('thebookings');
          } else {
              this.layout('outLayout');
              this.render('login');
          }
      }
    });


    this.route('/bookingstrim', {
      path: '/thebookings/:_year/trim/:_quarter',
      data: function(){
        var parameters = {
          'month': this.params._month,
          'year': this.params._year,
          'quarter': this.params._quarter,
          'type': 'Q',
        };
        return parameters;
      },
      onBeforeAction: function(pause){
          if(Meteor.userId()){
              this.layout('layout');
              this.render('thebookings');
          } else {
              this.layout('outLayout');
              this.render('login');
          }
      }
    });

    this.route('/bookingsyear', {
      path: '/thebookings/year/:_year',
      data: function(){
        var parameters = {
          'month': this.params._month,
          'year': this.params._year,
          'quarter': this.params._quarter,
          'type': 'Y',
        };
        return parameters;
      },
      onBeforeAction: function(pause){
          if(Meteor.userId()){
              this.layout('layout');
              this.render('thebookings');
          } else {
              this.layout('outLayout');
              this.render('login');
          }
      }
    });

    this.route('/bookingsupcoming', {
      path: '/thebookings/upcoming',
      data: function(){
        var parameters = {
          'month': this.params._month,
          'year': this.params._year,
          'quarter': this.params._quarter,
          'type': 'U',
        };
        return parameters;
      },
      onBeforeAction: function(pause){
          if(Meteor.userId()){
              this.layout('layout');
              this.render('thebookings');
          } else {
              this.layout('outLayout');
              this.render('login');
          }
      }
    });

    this.route('/bookingspending', {
      path: '/thebookings/pending',
      data: function(){
        var parameters = {
          'month': this.params._month,
          'year': this.params._year,
          'quarter': this.params._quarter,
          'type': 'P',
        };
        return parameters;
      },
      onBeforeAction: function(pause){
          if(Meteor.userId()){
              this.layout('layout');
              this.render('thebookings');
          } else {
              this.layout('outLayout');
              this.render('login');
          }
      }
    });

    this.route('dashboard', {
        path: '/',
        template: 'dashboard',
        onBeforeAction: function(pause){
            if(Meteor.userId()){
                this.layout('layout');
                this.render('dashboard');
            } else {
                this.layout('outLayout');
                this.render('login');
            }
        }
    });

    this.route('returnbookings', {
        path: '/returnbook',
        template: 'returnBookings',
        onBeforeAction: function(pause){
            if(Meteor.userId()){
                this.layout('layout');
                this.render('returnBookings');
            } else {
                this.layout('outLayout');
                this.render('login');
            }
        }
    });

    this.route('excelfactory');
    //About Route
    this.route('about');
    this.route('contratos');
    this.route('facturas');
    this.route('contacts',{
      path: '/contacts',
      template: 'contacts',
      data: function(){
        templateData = {
          contacts: Contacts.find().fetch().reverse()
        };
        return templateData;
      }
    });
    this.route('flota',{
      path: '/flota',
      template: 'flota',
      onBeforeAction: function(pause){
          if(Meteor.userId()){
              this.layout('layout');
              this.render('flota');
          } else {
              this.layout('outLayout');
              this.render('login');
          }
      },
      data: function(){
        templateData = {
          flota: Flota.find().fetch()
        };
        return templateData;
      }
    });

    this.route('workersPast',{
        path: '/workerspast',
        template: 'workerspast',
        onBeforeAction: function(pause){
            if(Meteor.userId()){
                this.layout('layout');
                this.render('workerspast');
            } else {
                this.layout('outLayout');
                this.render('login');
            }
        },
        data: function(){
            var theYear = moment().format('YYYY') - 1;
            var start = moment("01-01-"+theYear+"", "MM-DD-YYYY").toDate();
            var end = moment("01-01-"+(theYear+1)+"", "MM-DD-YYYY").toDate();

          templateData = {
            workers: Workers.find({}, {sort: {isActive:-1}}).fetch(),
            tareaspast: TareasWorkers.find({fecha: {'$gte': start, '$lt': end}},{sort:{fecha:1}}).fetch()
          };
          return templateData;
        }
      });
  

    this.route('workers',{
      path: '/workers',
      template: 'workers',
      onBeforeAction: function(pause){
          if(Meteor.userId()){
              this.layout('layout');
              this.render('workers');
          } else {
              this.layout('outLayout');
              this.render('login');
          }
      },
      data: function(){
        var theYear = moment().format('YYYY');
        var start = moment("01-01-"+theYear+"", "MM-DD-YYYY").toDate();
        var end = moment("01-01-"+(parseInt(theYear)+1)+"", "MM-DD-YYYY").toDate();



        templateData = {
          workers: Workers.find({}, {sort: {isActive:-1}}).fetch(),
          tareasworkers: TareasWorkers.find({fecha: {'$gte': start, '$lt': end}},{sort:{fecha:1}}).fetch()
        };
        return templateData;
      }
    });

    this.route('presupuestos',{
      path: '/presupuestos',
      template: 'presupuestos',
      onBeforeAction: function(pause){
          if(Meteor.userId()){
              this.layout('layout');
              this.render('presupuestos');
          } else {
              this.layout('outLayout');
              this.render('login');
          }
      },
      data: function(){
        templateData = {
          presupuestos: Presupuestos.find({},{sort:{fechacotizacion:-1}}).fetch(),
          // tareasworkers: TareasWorkers.find({},{sort:{fecha:-1}}).fetch()
        };
        return templateData;
      }
    });

    this.route('oficinas',{
      path: '/oficinas',
      template: 'oficinas',
      onBeforeAction: function(pause){
          if(Meteor.userId()){
              this.layout('layout');
              this.render('oficinas');
          } else {
              this.layout('outLayout');
              this.render('login');
          }
      },
    });

    this.route('email',{
        path: '/email/:_id',
        template: 'email',
        data: function() { return Bookings.findOne(this.params._id)}
    });

    this.route('owncontract', {
        path: '/owncontract',
        template: 'contratos'
    });

    this.route('tools',{
        path: '/tools',
        template: 'tools'
    });

    this.route('stats',{
        path: '/stats',
        template: 'stats'
    });


    this.route('recinvoices',{
      path: '/recinvoices',
      template: 'recinvoices'
    });

    this.route('emitinvoices',{
      path: '/emitinvoices',
      template: 'emitinvoices'
    });

});



/*Router.route('/buildPDF', function () {
 var param1 = this.params._id;
 console.log(param1);

  var doc = new PDFDocument({
    size: 'A4',
    margins: {
      top: 50,
      bottom: 0,
      left: 50,
      right: 50,
    }
  });


  doc.rect(0, 370, 598, 210)
    .fill('#22829f', 'even-odd');

  doc.fontSize(25).fillColor('white');
  doc.text('some text', 50, 390, {
    align: 'center',
    width: 500
  });


  this.response.writeHead(200, {
    'Content-type': 'application/pdf',
    'Content-Disposition': 'attachment; filename=sometitle.pdf'
  });
  this.response.end(doc.outputSync());
}, {
  where: 'server'
});*/


/* Router.route('/getPDF', function() {

     console.log("Dale");
 var doc = new PDFDocument({size: 'A4', margin: 50});

 doc.fontSize(12);
 doc.text('PDFKit is simple', 10, 30, {align: 'center', width: 200});
 this.response.writeHead(200, {
 'Content-type': 'application/pdf',
 'Content-Disposition': "attachment; filename=factura.pdf"
 });
 this.response.end( doc.outputSync() );
 }, {where: 'server'});*/
