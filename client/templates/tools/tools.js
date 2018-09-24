Template.tools.helpers({
    incomes: function(){
        return Incomes.find();
    },

    lastExpenses: function(){
        // {sort: {fechareco: 1}}
        return DevExpenses.find({}, {sort: {time: -1}, limit: 20});
    },

    selectedComiId: function(){
        return Comisionables.findOne(Session.get("selectedComiId"));
    },

    myComis: function(){
      return Comisionables.find();
    },

    ciudadesUnicas: function(){
        var ciudades=  _.uniq(Comisionables.find({}, {
            sort: {ciudad: 1}, fields: {ciudad: true}
        }).fetch().map(function(x) {
            return x.ciudad;
        }), true);

        return ciudades;
    },

    isCityMissing:function(ciudad){
        var theCity = Ciudades.findOne({nombre: ciudad});
        console.log("citiesdsfs");
        console.log(theCity);
        if(theCity == null){
            return true
        } else {
            return false
        }
    },

    getMySuggested: function(all){
      var n = all.split(" ");
      var city = n[n.length - 1];
      city = city.toLowerCase();
      // city = city.replace(/\w\S*/g, function(txt){
      //   return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
      return city.charAt(0).toUpperCase() + city.substr(1);
    },

    formatActDate: function(fecha){
        // console.log("user");
        // console.log(Meteor.user().username);
        return moment(fecha).format("D-MMM-YYYY")
    },

    formatActTime: function(fecha){
        return moment(fecha).format("HH:mm")
    },

    lastActivities: function(){
        return Activities.find();
    },

    // formatMonth: function(m){
    //     return moment().month(parseInt(m)).format("MMM");
    // },

    currentMonthIncome: function(){
        var mesIni = this.mes;
        var mesFin = mesIni + 1;
        var start = moment(mesIni+"-01-2017", "MM-DD-YYYY").toDate();
        var end = moment(mesFin+"-01-2017", "MM-DD-YYYY").toDate();
        var currentMonthBookings = Bookings.find({createdAt: {'$gte': start, '$lt': end}}, {fields: {'euroscarflet': 1}});
        return currentMonthBookings;
    },

    getTide: function(lev){
        var tide = Tides.findOne({level: lev});
        return tide.threshold;
    },

    getCurrentMonth: function(){
        var today = new Date();
        return moment(today).format("MMM YYYY");
    },


    getCurrentTide: function(){
            var theLevel = Template.tools.__helpers.get('getCurrentMonthDevExpenses').call();
            var currentTide = -1;
            for (var i = 0; i<6;i++){
                var checkTide = Tides.findOne({level: i});
                if(checkTide != null){
                    if (theLevel > checkTide.threshold || theLevel == checkTide.threshold){
                        currentTide++;
                    }
                }
            }

            if(currentTide == -1) {
                currentTide = 0;
            }

            if(currentTide != null){
                return currentTide;
            }            
    },

    getToNext: function(){
        var theLevel = Template.tools.__helpers.get('getCurrentMonthDevExpenses').call();
        var theTide = Template.tools.__helpers.get('getCurrentTide').call();

        var nextTide = Tides.findOne({level: theTide+1});
        nextTide = nextTide.threshold;

        return nextTide - theLevel;
    },

    getCurrentMonthDevExpenses: function(){
        var today = new Date();
        var currentMonth = parseInt(moment(today).format("MM")).toString();
        var currentYear = moment(today).format("YYYY").toString();
        // console.log("mes");
        // console.log(currentYear);
        // // console.log();
        var myExpenses = DevExpenses.find({
            "$and": [
                {"month": currentMonth},
                {"year": currentYear}
            ]}).fetch();
        // console.log(myExpenses);
        var monthExpenses = 0;
        for(var i = 0; i<myExpenses.length;i++){
            monthExpenses = monthExpenses + myExpenses[i].amount;
        }

        return monthExpenses;
    }
});

Template.tools.events({
        "click .triggerInMap": function(e){
            var theCity = $(e.target).attr("data-val");
            console.log(theCity);
            Ciudades.insert({nombre: theCity}, function(error, result){
                if(result){
                  alert("Ciudad Creada");
                } else {
                  alert("Error!");
                  console.log(error);
                }
              });
        },

        "click #create_pdf": function () {

            function foo(mydata){
                console.log(mydata);
            }

            var docDefinition = {
                content: [
                    'First paragraph'
                ]
              };

            var data;
            pdfMake.createPdf(docDefinition).getBase64(function(encodedString) {
                data = encodedString;
                Meteor.call("sendPDFEmail", data);
            });
           
        },

        "click .comirow": function(){
            Session.set("selectedComiId", $(this).attr("data-id"));
        },
        "click #create_income": function(){
            console.log("create");
            console.log(this.currentMonthIncome);
        },

        "click .triggerCity": function(){
          var theId = this._id;
          var theCity = $("tr[data-id="+theId+"").find("input").val();
          console.log(theCity);
          Meteor.call("updateCityForComi", theId, theCity);
        },

        "click #create_company": function(){
            var nombre = $("#name_enterprise").val();
            console.log(nombre)
            Enterprises.insert({name: nombre});
            // Enterprises.insert({name: })
        },

        "click .dailyTrigger": function () {
            Meteor.call('sendTest');
        },

        "click #add_expense": function() {
            var new_expense = $("input[name=new_expense]").val();
            var new_concept = $("input[name=new_expense_concept]").val();
            var till_next = parseInt($(".till_next").html());
            console.log(new_expense);
            if(new_expense > till_next || new_expense == till_next){
                $('#confirmExpense').modal('show');
            } else {
                Meteor.call("addNewExpense", new_expense, new_concept);
            }

        },

        "click #confirmExpenseBtn": function(){
            var getExpense = $("input[name=new_expense]").val();
            Meteor.call("addNewExpense", getExpense);
            var currentTide = parseInt($("#myCurrentTide").html());
            var newTide = currentTide + 1;
            console.log("new tide");
            console.log(newTide);
            Meteor.call("sendEmailTideRise", newTide);
            // Aqui habría que notificar
            $('#confirmExpense').modal('hide');
        },

        "click #set_tides": function (){
            var first = $("input[name=first_level]").val();
            var second = $("input[name=second_level]").val();
            var third = $("input[name=third_level]").val();
            var forth = $("input[name=forth_level]").val();
            var fifth = $("input[name=fifth_level]").val();

            // console.log(first);
            // console.log(second);
            // console.log(third);
            // console.log(forth);
            // console.log(fifth);

            //check each one is lower than the next
            if(first < second && second < third && third < forth && forth < fifth){
                Meteor.call('setTides', first, second, third, forth, fifth);
            } else {
                alert('error en la correlacion de tides');
                location.reload();
            }
        }
});
