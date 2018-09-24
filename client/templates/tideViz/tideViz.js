Template.tideViz.helpers({
    tides: function(){
        return Tides.find().fetch();
    },
    getCurrentMonthYear: function(){
        return moment(new Date()).format("MMMM YYYY");
    },

    getCurrentTide: function(){
        return Template.tools.__helpers.get('getCurrentTide').call();
    },
    getCurrentTideClass: function(){
        var arrayClasses = ["zeroish", "firstish", "secondish", "thirdish", "forthish", "fifthish"];
        var myTide = Template.tools.__helpers.get('getCurrentTide').call();
        return arrayClasses[myTide];
    },
    getCurrentTideClassColor: function(){
        var arrayClasses = ["zeroish-c", "firstish-c", "secondish-c", "thirdish-c", "forthish-c", "fifthish-c"];
        var myTide = Template.tools.__helpers.get('getCurrentTide').call();
        return arrayClasses[myTide];
    },
    getTideTop: function(){
        var myTide = Template.tools.__helpers.get('getCurrentTide').call();
        if(myTide == 5){
            return 100 - (myTide/5)*100 + 10;
        } else {
            return 100 - (myTide/5)*100;
        }

    },

    getMyCurrentWidth: function(){
        var nextTideLevel = Template.tideViz.__helpers.get('getNextThreshold').call();
        var currentTideLevel = Template.tideViz.__helpers.get('getCurrentThreshold').call();
        var currentExpense = Template.tools.__helpers.get('getCurrentMonthDevExpenses').call();
        var multiplier = (currentExpense - currentTideLevel) / (nextTideLevel - currentTideLevel);
        return parseInt(36 * multiplier);
    },
    getCurrentThreshold: function(){
        var ourTide = Template.tools.__helpers.get('getCurrentTide').call();
        if(ourTide == 0){
                return "0"
        } else {
                ourTide = Tides.findOne({level: ourTide});
                return ourTide.threshold;
        }
    },
    getNextThreshold: function(){
        var ourTide = Template.tools.__helpers.get('getCurrentTide').call();
        if (ourTide != null ){
            if(ourTide == 5) {
                return "indeterminado";
            } else {
                ourTide = ourTide + 1;
                ourTide = Tides.findOne({level: ourTide})
                return ourTide.threshold;
            }
        }
    }
});
