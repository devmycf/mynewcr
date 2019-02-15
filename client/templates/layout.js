//Formate Date
Template.registerHelper('formatDate', function(date){
    return moment(date).format('DD-MM-YYYY \n HH:mm');
});

Template.registerHelper('formatDateOnly', function(date){
    return moment(date).format('DD-MM-YYYY');
});

Template.registerHelper('formatDateMail', function(date){
    return moment(date).format('dddd, D MMMM YYYY, HH:mm');
});

//Formate Day
Template.registerHelper('getDay', function(date){
    return moment(date).date();
});

//Formate Month
Template.registerHelper('getMonth', function(date){
    return moment(date).format('MMM');
});

//Formate Month
Template.registerHelper('getMonthNumber', function(date){
    return moment(date).format('MM');
});

//Formate Year
Template.registerHelper('getYear', function(date){
    return moment(date).format('YYYY');
    // return "2017";
});

Template.registerHelper('getPastYear', function(date){
    return moment(date).format('YYYY') - 1;
    // return "2017";
});

//Formate Year
Template.registerHelper('getTrim', function(date){
    return moment(date).format('Q');
});

//Formate Year
Template.registerHelper('currentMonthBookings', function(){
  var mesIni = moment(new Date()).format("M");
  var mesFin = parseInt(moment(new Date()).format("M"))+1;
  var year = moment(new Date()).format('YYYY');
  // console.log("month");
  // console.log(mesIni);
  // console.log(mesFin);
  if(mesIni == 12){
      var start = moment("12-01-"+year+"", "MM-DD-YYYY").toDate();
      var end = moment("01-01-"+parseInt(year)+1+"", "MM-DD-YYYY").toDate();
  } else {
      var start = moment(mesIni+"-01-"+year+"", "MM-DD-YYYY").toDate();
      var end = moment(mesFin+"-01-"+year+"", "MM-DD-YYYY").toDate();
  }

  return Bookings.find({createdAt: {'$gte': start, '$lt': end}},{sort:{fechareco: 1}}).fetch().length;
});

//Days of difference
Template.registerHelper('getNumberDays', function(date1, date2){
    var a = moment(date1);
    var b = moment(date2);

    var diferencia = a.diff(b, 'days');

    if(diferencia == 0){
        diferencia = 1;
    }

    return diferencia;
});

//Total amount
Template.registerHelper('getTotalAmount', function(eurproced, eurprovee, eurcarflet){
    var sum1;
    var sum2;
    var sum3;

    if(!eurproced){
        sum1 = 0;
    } else {
        sum1 = parseFloat(eurproced);
    }

    if(!eurprovee){
        sum2 = 0;
    } else {
        sum2 = parseFloat(eurprovee);
    }

    sum3 = parseFloat(eurcarflet);

    return (sum1+sum2+sum3);
});

Template.registerHelper('formatEuros', function(toformat){
    if(!toformat){
        return("-");
    }

    else{
        return(toformat+"€");
    }
});

//Suplementos
Template.registerHelper('getSuplementoDev', function(supdevolucion){
    var suplementos = "";
    if(supdevolucion == 0){
        suplementos = "";
    }
    else{
        suplementos = supdevolucion;
    }

    return(suplementos);
});

Template.registerHelper('getSuplementoGPS', function(supgps){
    var suplementos = "";
    if(supgps == 0){
        suplementos = "";
    }
    else{
        suplementos = supgps;
    }

    return(suplementos);
});

Template.registerHelper('getSuplementoTransfer', function(suptransfer){
    var suplementos = "";
    if(suptransfer == 0){
        suplementos = "";
    }
    else{
        suplementos = suptransfer;
    }

    return(suplementos);
});

Template.registerHelper('isAdmin', function(){
    if(Meteor.user() && Meteor.user().username.toString().includes("eneas")){
        return true;
    }
});

Template.registerHelper('isFounder', function(){
    if(Meteor.user() && (Meteor.user().username === 'eva' || Meteor.user().username === 'eva maria' || Meteor.user().username === 'diego')){
        return true;
    }
});


Template.registerHelper('isAdminOrFounder', function(){
    if(Meteor.user() && (Meteor.user().username === 'eva' || Meteor.user().username === 'eva maria' || Meteor.user().username === 'diego' || Meteor.user().username.includes("eneas"))){
        return true;
    }
});


// Template.registerHelper('getOficinaReco', function(){
//     return ('aqui va el cacharro');
// });
