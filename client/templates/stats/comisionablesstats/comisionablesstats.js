Template.comisionablesstats.helpers({
    comisCurrentYear: function() {
        var currentYear = moment().format('YYYY');
        var start = moment("01-01-"+currentYear+"", "MM-DD-YYYY").toDate();
        var nextYear = parseInt(currentYear)+1;
        var end = moment("01-01-"+nextYear+"", "MM-DD-YYYY").toDate();
        console.log("oye");
        console.log(start);
        console.log(end);

        var theComis = Bookings.find({"fechareco": {$gte: start, $lt: end}, "isComissioned": true}, {fields:  {comisionPerson: 1, comisionId: 1, comisionEuros: 1, comisionDate: 1, fechareco: 1}}).fetch();
        console.log(theComis);

        var comisGroups = Bookings.find({
                    "fechareco": {$gte: start, $lt: end}, 
                    "isComissioned": true
                }, 
                {
                    fields:  {
                        "comisionPerson": 1, 
                        "comisionId": 1, 
                        "comisionEuros": 1, 
                        "comisionDate": 1, 
                        "fechareco": 1
                    }
                }).fetch();

        var mycomisGroups = _.groupBy(comisGroups, "comisionPerson");
        console.log(mycomisGroups);

        return theComis;
    }
});

Template.comisionablesstats.onRendered(function () {
    var svg = d3.select("#d3-comistats").append("svg")
    .attr("width", "600px")
    .attr("height", "600px")
    .append("g")
})