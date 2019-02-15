Template.workers.helpers({
    // workers: function(){
    //     return Workers.find();
    // },

    formatDate: function(date){
        return moment(date).format("DD-MMM-YYYY")
    },

    getMyMonth: function(date){
        return moment(date).format("M")
    },

    getWorkerInitials: function(name){
        narray = name.split(" ");
        var initials = "";
        for (var i = 0; i<narray.length; i++){
            if (narray.length > 1){
                initials = initials + narray[i].charAt(0);
            } else {
                initials = narray[i].charAt(0) + narray[i].charAt(1);
            }
        }
        return initials;
    },

    getMonthDebtByWorker: function(mes, worker){
      var currentYear = moment().format('YYYY');
      var start = moment(parseInt(mes)+"-01-"+currentYear+"", "MM-DD-YYYY").toDate();
      if(parseInt(mes) == 12){
          var nextYear = parseInt(currentYear)+1;
          var end = moment("01-01-"+(nextYear)+"", "MM-DD-YYYY").toDate();
      } else {
          var end = moment((parseInt(mes)+1)+"-01-"+currentYear+"", "MM-DD-YYYY").toDate();
      }
        var TaskByMonth = TareasWorkers.find({"worker": worker, "fecha": {$gte: start, $lt: end}}).fetch();
        console.log(TaskByMonth);
        var theDebt = 0;
        TaskByMonth.forEach(function(task, i){
          theDebt = theDebt + parseFloat(task.precio)
        });
        console.log(theDebt);

        return theDebt;
    },

    getGlobalMonthlyDebt: function(mes){
      var currentYear = moment().format('YYYY');
      var start = moment(parseInt(mes)+"-01-"+currentYear+"", "MM-DD-YYYY").toDate();
      var nextYear = parseInt(currentYear)+1;
      if(parseInt(mes) == 12){
          var end = moment("01-01-"+(nextYear)+"", "MM-DD-YYYY").toDate();
      } else {
          var end = moment((parseInt(mes)+1)+"-01-"+currentYear+"", "MM-DD-YYYY").toDate();
      }

      if(parseInt(mes) == 0){

        start = moment("01-01-"+currentYear+"", "MM-DD-YYYY").toDate();
        var end = moment("01-01-"+nextYear+"", "MM-DD-YYYY").toDate();
        var TaskByMonth = TareasWorkers.find({"fecha": {$gte: start, $lt: end}}).fetch();
      } else {
        var TaskByMonth = TareasWorkers.find({"fecha": {$gte: start, $lt: end}}).fetch();
      }

        console.log(TaskByMonth);
        var theDebt = 0;
        TaskByMonth.forEach(function(task, i){
          theDebt = theDebt + parseFloat(task.precio);
          theDebt = Math.round(theDebt * 100) / 100;
        });
        console.log(theDebt);

        return theDebt;
    },

    getMyTaskColor: function(tipo){
      switch (tipo) {
        case "Lavado": return "#3fb2b8";
          break;
        case "Entrega": return "#6e3fb8";
          break;
        case "Recogida": return "#3fb864";
          break;
        case "Gasolina": return "#b8933f";
          break;
        case "Taxi": return "#b83f6c";
          break;
        case "Autobus": return "#3f4eb8";
          break;
        case "Parking": return "#b83f9f";
          break;
        case "Peaje": return "#6f231c";
          break;
        case "Ruedas": return "#525154";
          break;
        case "Taller": return "#ff5e00";
          break;
        case "Efectivo": return "#333333";
          break;
        case "Aceite": return "#ded819";
          break;

      }
    },

    tipotarea: function(){
        return [
          {
            "name": "Lavado",
          },
          {
            "name": "Gasolina",
          },
          {
            "name": "Entrega",
          },
          {
            "name": "Recogida",
          },
          {
            "name": "Taxi",
          },
          {
            "name": "Efectivo",
          }
        ];
    },

    flota: function(){
        return Flota.find({});
    },

    updateTask: function(){
        var myType = $(".worker-single.opened").find(".inner-form2").find("select[name='type']").val();
        var myCar = $(".worker-single.opened").find(".inner-form2").find("select[name='coche']").val();
        var myCity = $(".worker-single.opened").find(".inner-form2").find("input[name='ciudad']").val();
        var tarea = myType + " de " + myCar + " en " + myCity;
        $(".worker-single.opened").find(".inner-form2").find("input[name='tarea']").val(tarea);
        console.log(myCar);
    }
});

AutoForm.hooks({
  insertTareaWorker: {
    onSuccess: function(formType, result) {
      $('.worker-list').removeClass('opened');
      $('.worker-single').removeClass('opened');
    },
    onError: function(formType, error) {
      console.log('Error!!!');
      console.log(error);
    }
},
  newTaskWorker: {
    onSuccess: function(formType, result) {
      console.log("sadfsdf");
      $('.worker-list').removeClass('opened');
      $('.worker-single').removeClass('opened');
    },
    onError: function(formType, error) {
      console.log('Error!!!');
      console.log(error);
    }
},
insertWorkerForm: {
    onSuccess: function(formType, result) {
        $('#newWorkerModal').modal('toggle');
    },
    onError: function(formType, error) {
      console.log('Error!!!');
      console.log(error);
    }
}
});

// Template.workers.rendered=function() {
// 	$('.my-datepicker').datepicker({
//     format: "dd/mm/yyyy",
//     weekStart: 1,
//     language: "es",
//     orientation: "top auto"
//   });
// }

Template.workers.events({
  
  'click #allTasksExcel': function(){
      Meteor.call("downloadTareasWorkers", function(err, fileUrl){
          var link = document.createElement("a");
              link.download = 'ListadoTareas.xlsx';
          link.href = fileUrl;
          link.click();
      });
  },

  'click #pastTasksExcel': function(){
    var theyear = moment(new Date()).format('YYYY') - 1;
    Meteor.call("downloadTareasWorkersOtherYear", theyear, function(err, fileUrl){
        var link = document.createElement("a");
            link.download = 'ListadoTareas'+theyear+'.xlsx';
        link.href = fileUrl;
        link.click();
    });
},
    'click .worker-action': function(e){
        // console.log($(this));
        // console.log($(e.target));
        $(e.target).closest(".worker-single").addClass("opened");
        $(e.target).closest(".worker-list").addClass("opened");

        var worker = $(e.target).closest(".worker-single").find(".worker-name").html();
        var city = $(e.target).closest(".worker-single").find(".worker-city").html();


        var typesel = $(e.target).closest(".worker-single").find("form").find("select[name='type']").val();
        var typecoche = $(e.target).closest(".worker-single").find("form").find("select[name='coche']").val();
        $(e.target).closest(".worker-single").find("form").find("input[name='worker']").val(worker);
        $(e.target).closest(".worker-single").find("form").find("input[name='ciudad']").val(city);
        $(e.target).closest(".worker-single").find("form").find("input[name='tarea']").val(typesel+" de "+typecoche+ " en "+ city);

    },

    "blur .cteTask": function(e){
        // console.log("wea");
        var currentId = this._id;
        var newCoste = $(e.target).val();
        // console.log(newCoste);
        Meteor.call("pushCosteTask", currentId, newCoste);
        // Meteor.call("test");
    },

    'submit #newTaskWorker': function(event){
        var type = event.target.type.value;
        var ciudad = event.target.ciudad.value;
        var coche = event.target.coche.value;
        var fecha = event.target.fecha.value;
        var fechafo = fecha.toString().split("/");
        var fechafin = new Date(fechafo[2], fechafo[1] - 1, fechafo[0]);
        // fecha = moment(fecha).format("DD-MM-YYYY");
        var precio = event.target.precio.value;
        var tarea = event.target.tarea.value;
        var comments = event.target.comments.value;
        var worker = $(event.target).find("input[name='worker']").val();
        var tareastructure = {
          "worker": worker,
          "type": type,
          "ciudad": ciudad,
          "coche": coche,
          "fecha": fechafin,
          "precio": precio,
          "tarea": tarea,
          "comments": comments,
        }
        Meteor.call("insertTask", tareastructure, function(error, result){
          if(error) {
            alert("Error")
          } else {
            alert ("Tarea Creada");
          }
        });
    },

    'click .overlay-full': function(){
        $('.worker-list').removeClass('opened');
        $('.worker-single').removeClass('opened');
    },

    'change select[name="type"]': function(){
        Template.workers.__helpers.get('updateTask').call();
    },
    'change select[name="coche"]': function(){
        Template.workers.__helpers.get('updateTask').call();
    },

    'keyup input[name="ciudad"]': function(){
        Template.workers.__helpers.get('updateTask').call();
    },

    "click .delete-booking": function(){
        var theTask = TareasWorkers.findOne({_id: this._id});
        var theType = theTask.type;
        var theBooking = theTask.idBooking;
        if(confirm('¿Estás seguro de eliminar esta tarea?')){

            if(theType == "Entrega"){
              Meteor.call("resetRecoWorker", theBooking);
            } else if (theType == "Recogida") {
              Meteor.call("resetDevoWorker", theBooking);
            } else {
              TareasWorkers.remove(this._id);
            }

            FlashMessages.sendSuccess("Tarea Eliminada", { autoHide: true, hideDelay: 3000 });
        }
    },

    'click .worker:not(.worker-reactive)': function(e){
        function getMyDebt(miworker, mimes){
          console.log("mi deuda");
          console.log(miworker, mimes);
          var currentYear = moment().format('YYYY');
          var nextYear = parseInt(currentYear)+1;
          var start = moment(parseInt(mimes)+"-01-"+currentYear+"", "MM-DD-YYYY").toDate();
          if(parseInt(mimes) == 12){
              var end = moment("01-01-"+(nextYear)+"", "MM-DD-YYYY").toDate();
          } else {
              var end = moment((parseInt(mimes)+1)+"-01-"+currentYear+"", "MM-DD-YYYY").toDate();
          }
    
          var TaskByMonth = TareasWorkers.find({"worker": miworker, "fecha": {$gte: start, $lt: end}}).fetch();
    
            console.log(TaskByMonth);
            var theDebt = 0;
            TaskByMonth.forEach(function(task, i){
              theDebt = theDebt + parseFloat(task.precio);
              theDebt = Math.round(theDebt * 100) / 100;
            });
            console.log(theDebt);
    
            $(".months-filter li a[filter-month = '"+mimes+"']").find("p").html(theDebt+"€");
        }

        function getAllWorkersDebt(){
          for(var i = 1; i < 13; i++){
            var currentYear = moment().format('YYYY');
            var nextYear = parseInt(currentYear) +1;
            var start = moment(parseInt(i)+"-01-"+currentYear+"", "MM-DD-YYYY").toDate();
            var end = moment("01-01-"+(nextYear)+"", "MM-DD-YYYY").toDate();

            var TaskByMonth = TareasWorkers.find({"worker": miworker, "fecha": {$gte: start, $lt: end}}).fetch();
            var theDebt = 0;
            TaskByMonth.forEach(function(task, i){
              theDebt = theDebt + parseFloat(task.precio);
              theDebt = Math.round(theDebt * 100) / 100;
            });
            console.log(theDebt);
    
            $(".months-filter li a[filter-month = '"+i+"']").find("p").html(theDebt+"€");
          }
        }

        Session.set("selectedWorkerId", this._id);
        if(!$(e.target).hasClass("worker-remove")){
          $(".worker").removeClass("worker-selected");
          $(e.target).addClass("worker-selected");
          var filterWorker = $(e.target).attr("worker-trigger");
          var isAll = $(e.target).attr("is-all");
          $("h2").html("Tareas "+filterWorker);


          var numRows = $("tbody").find("tr");

          if(isAll == "true"){
              $("tbody").find("tr").removeClass("hide");
          } else {
              for(var i = 0; i<numRows.length; i++){
                  if($(numRows[i]).attr("worker-catcher") == filterWorker){
                      $(numRows[i]).removeClass("hide");
                  } else {
                      $(numRows[i]).addClass("hide");
                  }
              }
          }

          $(".months-filter").find("a[filter-month='0']").click();

          if(isAll == "true"){
            getAllWorkersDebt();
          } else {
            for(var i = 1; i < 13; i++){
              getMyDebt(filterWorker, i);
            }
          }

          // var theMonth = Template.workers.__helpers.get('getMonthDebtByWorker', filterWorker, '5').call();
          // console.log("wea");
        } else {
          var worker = $(e.target).parent().attr("worker-trigger");
          $("#confirmInactiveLabel").html("Desactivar worker " + worker);
        }
    },

    'click .months-filter a': function(e){
      $(".months-filter").find("a").removeClass("month-selected");
      $(e.target).addClass("month-selected");
      var the_month = $(e.target).attr("filter-month");
      var the_worker = $(".worker-selected").attr("worker-trigger");
      var numRows = $("tbody").find("tr");
        if(the_worker == "All Workers"){
          $("tbody").find("tr").addClass("hide")
          for(var i = 0; i<numRows.length; i++){
            if($(numRows[i]).attr("worker-month") == the_month || the_month == "0"){
              $(numRows[i]).removeClass("hide");
            }
          }
        } else {
          for(var i = 0; i<numRows.length; i++){
            if($(numRows[i]).attr("worker-catcher") == the_worker){
              $(numRows[i]).removeClass("hide");
              if($(numRows[i]).attr("worker-month") == the_month || the_month == "0"){ 
                $(numRows[i]).removeClass("hide");
              } else {
                $(numRows[i]).addClass("hide");
              }
            } else {
              $(numRows[i]).addClass("hide");
            }
          }
        }
    },

    'click #confirmInactiveWorkerBtn': function(e){
        var currentWorker = Session.get("selectedWorkerId");
        // console.log("eliminar a " + currentWorker);
        Meteor.call("setWorkerInactive", currentWorker);
          $('#confirmInactive').modal('toggle');
    },

    'click .worker-reactive': function(e){
        var currentWorker = Session.get("selectedWorkerId");
        Meteor.call("setWorkerActive", currentWorker);
        $(".worker[worker-id="+currentWorker+"]").click();
    }

});
