Template.excelfactory.helpers({
    currentMonth: function(){
        var today = new Date();
        var month = moment(today).month();
        console.log(month);
        var Months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        var monthCurated = Months[month];
        return monthCurated;
    },

    currentTrimestre: function(){
        var today = new Date();
        var month = moment(today).month();

        if (month < 4) {
            return "Primer Trimestre";
        } else if (month > 3 && month < 7 ) {
            return "Segundo Trimestre";
        } else if (month > 9) {
            return "Tercer Trimestre";
        } else {
            return "Cuarto Trimestre";
        }
    },

    currentYear: function() {
        var today = new Date();
        var year = moment(today).year();
        return year;
    }
});

Template.excelfactory.events({
    'click .choose-toogle': function(e){
        $(e.target).parent().addClass("opened");
    },

    'click .overlay-excel': function(){
        $('.choose').removeClass('opened');
    },

    'click ul li': function(e){
        var allOptions = $(e.target).parent().children('li');
        allOptions.removeClass('selected');
        $(e.target).addClass('selected');
        var padre = $(e.target).closest('.choose');
        var target = $(e.target).closest('.choose').children('a');
        $(e.target).closest('.choose').children('a').html($(e.target).html());
        //$(this).closest('choose').siblings().find('choose-toogle').html($(this).html());
        $('.choose').removeClass('opened');
    },

    'click #trigger-m': function(){
        $(".js_only_month_trim").removeClass('hide');
        $('.choose-t').addClass('hide');
        $('.choose-y').addClass('hide');
        $('.choose-m').removeClass('hide');
        $('#custom').addClass('hide');
        $("#not-custom").removeClass('hide');
    },

    'click #trigger-t': function(){
        $(".js_only_month_trim").removeClass('hide');
        $('.choose-m').addClass('hide');
        $('.choose-y').addClass('hide');
        $('.choose-t').removeClass('hide');
        $('#custom').addClass('hide');
        $("#not-custom").removeClass('hide');
    },

    'click #trigger-y': function(){
        $('.choose-t').addClass('hide');
        $('.choose-m').addClass('hide');
        $('.choose-y').removeClass('hide');
        $('#custom').addClass('hide');
        $("#not-custom").removeClass('hide');
        $(".js_only_month_trim").addClass("hide");
    },

    'click #trigger-c': function(){
        $('.choose-t').addClass('hide');
        $('.choose-m').addClass('hide');
        $('#not-custom').addClass('hide');
        $("#custom").removeClass('hide');
    },

    'click #lastYear': function(){
        var mode = 5,
            period = 0,
            finitial = 0,
            ffin = 0;

        var lastYearNum = moment().format('YYYY') - 1;

        Meteor.call("downloadExcelCustom", mode, lastYearNum, finitial, ffin, function(err, fileUrl){
            var link = document.createElement("a");
                link.download = 'ListadoReservas'+lastYearNum+'.xlsx';
            link.href = fileUrl;
            link.click();
        });
    },

    'submit form': function(e){
        e.preventDefault();
        var mode,
            period;

        var finitialTemp, ffinitialTemp, finitial, ffin;

        switch ($(".choose-mode").text()) {
            case "Mensuales": mode = 1;
            break;
            case "Trimestrales": mode = 2;
            break;
            case "Anuales": mode = 3;
            break;
            case "entre estas fechas": mode = 4;
        }

        if (mode == 1) {
            var month = $(".choose-month").text();
            switch (month) {
                case "Enero": period = 1;
                break;
                case "Febrero": period = 2;
                break;
                case "Marzo": period = 3;
                break;
                case "Abril": period = 4;
                break;
                case "Mayo": period = 5;
                break;
                case "Junio": period = 6;
                break;
                case "Julio": period = 7;
                break;
                case "Agosto": period = 8;
                break;
                case "Septiembre": period = 9;
                break;
                case "Octubre": period = 10;
                break;
                case "Noviembre": period = 11;
                break;
                case "Diciembre": period = 12;
                break;

            }
        }

        if (mode == 2) {
            var trim = $(".choose-trim").text();
            switch (trim) {
                case "Primer Trimestre": period = 1;
                break;
                case "Segundo Trimestre": period = 2;
                break;
                case "Tercer Trimestre": period = 3;
                break;
                case "Cuarto Trimestre": period = 4;
                break;
            }
        }

        if (mode == 3) {
            period = $(".choose-year").text();
        }

        if (mode == 4){
            finitialTemp = $(".choose-mes-ini").text();
            ffinTemp = $(".choose-mes-fin").text();


            switch (finitialTemp) {
                case "Enero": finitial = 1;
                break;
                case "Febrero": finitial = 2;
                break;
                case "Marzo": finitial = 3;
                break;
                case "Abril": finitial = 4;
                break;
                case "Mayo": finitial = 5;
                break;
                case "Junio": finitial = 6;
                break;
                case "Julio": finitial = 7;
                break;
                case "Agosto": finitial = 8;
                break;
                case "Septiembre": finitial = 9;
                break;
                case "Octubre": finitial = 10;
                break;
                case "Noviembre": finitial = 11;
                break;
                case "Diciembre": finitial = 12;
                break;

            }

            switch (ffinTemp) {
                case "Enero": ffin = 1;
                break;
                case "Febrero": ffin = 2;
                break;
                case "Marzo": ffin = 3;
                break;
                case "Abril": ffin = 4;
                break;
                case "Mayo": ffin = 5;
                break;
                case "Junio": ffin = 6;
                break;
                case "Julio": ffin = 7;
                break;
                case "Agosto": ffin = 8;
                break;
                case "Septiembre": ffin = 9;
                break;
                case "Octubre": ffin = 10;
                break;
                case "Noviembre": ffin = 11;
                break;
                case "Diciembre": ffin = 12;
                break;

            }

            period = finitialTemp + "-" + ffinTemp;
        }

        console.log(mode);
        console.log(period);

        Meteor.call("downloadExcelCustom", mode, period, finitial, ffin, function(err, fileUrl){
            var link = document.createElement("a");
            if (mode == 1) {
                link.download = 'ListadoReservas'+month+'-'+$(".choose-year").text()+'.xlsx';
            }
            if (mode == 2) {
                link.download = 'ListadoReservas'+period+'T-'+$(".choose-year").text()+'.xlsx';
            }
            if (mode == 3) {
                link.download = 'ListadoReservas'+period+'.xlsx';
            }

            if (mode == 4){
                link.download = 'ListadoReservas'+finitialTemp+'-'+ffinTemp+'.xlsx';
            }

            link.href = fileUrl;
            link.click();
        });
    }

});
