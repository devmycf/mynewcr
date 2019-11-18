Meteor.methods({
    downloadTareasWorkersOtherYear: function(theYear){
        var Future = Npm.require('fibers/future');
        var futureResponse = new Future();
    
        var excel = new Excel('xlsx'); // Create an excel object  for the file you want (xlsx or xls)
        var workbook = excel.createWorkbook(); // Create a workbook (equivalent of an excel file)
        var worksheet = excel.createWorksheet(); // Create a worksheet to be added to the workbook
    
        // Example : writing to a cell
       worksheet.mergeCells(0,0,0,1); // Example : merging files
       worksheet.writeToCell(1,0, 'Fecha');
       worksheet.writeToCell(1,1, 'Tipo');
       worksheet.writeToCell(1,2, 'Worker');
       worksheet.writeToCell(1,3, 'Tarea');
       worksheet.writeToCell(1,4, 'Ciudad');
       worksheet.writeToCell(1,5, 'Coche');
       worksheet.writeToCell(1,6, 'Coste');
       worksheet.writeToCell(1,7, 'Notas');
    
    
       worksheet.setColumnProperties([ // Example : setting the width of columns in the file
         { wch: 20 },
         { wch: 30 }
       ]);
    
       var row = 2;
    
       var start = moment("01-01-"+theYear+"", "MM-DD-YYYY").toDate();
       var end = moment("01-01-"+(theYear+1)+"", "MM-DD-YYYY").toDate();
    
       TareasWorkers.find({fecha: {'$gte': start, '$lt': end}},{sort:{fecha: 1}}).forEach(function(tarea) {
           worksheet.writeToCell(row, 0, tarea.fecha);
           worksheet.writeToCell(row, 1, tarea.type);
           worksheet.writeToCell(row, 2, tarea.worker);
           worksheet.writeToCell(row, 3, tarea.tarea);
           worksheet.writeToCell(row, 4, tarea.ciudad);
           worksheet.writeToCell(row, 5, tarea.coche);
           worksheet.writeToCell(row, 6, tarea.precio);
           worksheet.writeToCell(row, 7, tarea.comments);
           row++;
       });
    
       workbook.addSheet('MySheet', worksheet);
    
       mkdirp('tmp', Meteor.bindEnvironment(function (err) {
         if (err) {
           console.log('Error creating tmp dir', err);
           futureResponse.throw(err);
         }
         else {
           // console.log("No error al crear el directorio temporal");
           var uuid = UUID.v4();
           var filePath = './tmp/' + uuid;
           workbook.writeToFile(filePath);
    
           temporaryFiles.importFile(filePath, {
             filename : uuid,
             contentType: 'application/octet-stream'
           }, function(err, file) {
             if (err) {
               console.log('error al importar');
               futureResponse.throw(err);
             }
             else {
                 // console.log('no error al importar');
               futureResponse.return('/gridfs/temporaryFiles/' + file._id);
             }
           });
         }
       }));
    
       return futureResponse.wait();
    
     },
    downloadTareasWorkers: function(){
        var Future = Npm.require('fibers/future');
        var futureResponse = new Future();
    
        var excel = new Excel('xlsx'); // Create an excel object  for the file you want (xlsx or xls)
        var workbook = excel.createWorkbook(); // Create a workbook (equivalent of an excel file)
        var worksheet = excel.createWorksheet(); // Create a worksheet to be added to the workbook
    
        // Example : writing to a cell
       worksheet.mergeCells(0,0,0,1); // Example : merging files
       worksheet.writeToCell(1,0, 'Fecha');
       worksheet.writeToCell(1,1, 'Tipo');
       worksheet.writeToCell(1,2, 'Worker');
       worksheet.writeToCell(1,3, 'Tarea');
       worksheet.writeToCell(1,4, 'Ciudad');
       worksheet.writeToCell(1,5, 'Coche');
       worksheet.writeToCell(1,6, 'Coste');
       worksheet.writeToCell(1,7, 'Notas');
    
       var theYear = moment().format('YYYY');
       var start = moment("01-01-"+theYear+"", "MM-DD-YYYY").toDate();
       var end = moment("01-01-"+(parseInt(theYear)+1)+"", "MM-DD-YYYY").toDate();
    
    
       worksheet.setColumnProperties([ // Example : setting the width of columns in the file
         { wch: 20 },
         { wch: 30 }
       ]);
    
       var row = 2;
    
       TareasWorkers.find({fecha: {'$gte': start, '$lt': end}},{sort:{fecha: 1}}).forEach(function(tarea) {
           worksheet.writeToCell(row, 0, tarea.fecha);
           worksheet.writeToCell(row, 1, tarea.type);
           worksheet.writeToCell(row, 2, tarea.worker);
           worksheet.writeToCell(row, 3, tarea.tarea);
           worksheet.writeToCell(row, 4, tarea.ciudad);
           worksheet.writeToCell(row, 5, tarea.coche);
           worksheet.writeToCell(row, 6, tarea.precio);
           worksheet.writeToCell(row, 7, tarea.comments);
           row++;
       });
    
       workbook.addSheet('MySheet', worksheet);
    
       mkdirp('tmp', Meteor.bindEnvironment(function (err) {
         if (err) {
           console.log('Error creating tmp dir', err);
           futureResponse.throw(err);
         }
         else {
           // console.log("No error al crear el directorio temporal");
           var uuid = UUID.v4();
           var filePath = './tmp/' + uuid;
           workbook.writeToFile(filePath);
    
           temporaryFiles.importFile(filePath, {
             filename : uuid,
             contentType: 'application/octet-stream'
           }, function(err, file) {
             if (err) {
               console.log('error al importar');
               futureResponse.throw(err);
             }
             else {
                 // console.log('no error al importar');
               futureResponse.return('/gridfs/temporaryFiles/' + file._id);
             }
           });
         }
       }));
    
       return futureResponse.wait();
    
     },
    
    
      downloadExcelCustom: function(mode, period, finitial, ffin){
        // console.log("quieren excel");
        var Future = Npm.require('fibers/future');
        var futureResponse = new Future();
    
        var excel = new Excel('xlsx'); // Create an excel object  for the file you want (xlsx or xls)
        var workbook = excel.createWorkbook(); // Create a workbook (equivalent of an excel file)
        var worksheet = excel.createWorksheet(); // Create a worksheet to be added to the workbook
        var currentYear = moment().format('YYYY');
    
        if (mode == 1){
            worksheet.writeToCell(0,0, 'Reservas Mensuales en Carflet (Mes '+period+' Año '+currentYear+')');
        }
    
        if (mode == 2){
            worksheet.writeToCell(0,0, 'Reservas Trimestrales en Carflet ('+period+'T Año '+currentYear+')');
        }
    
        if (mode == 3){
            worksheet.writeToCell(0,0, 'Reservas Anuales en Carflet ('+period+')');
        }
    
        if (mode == 4){
            worksheet.writeToCell(0,0, 'Reservas en Carflet ('+period+')');
        }
    
        if (mode == 5){
            worksheet.writeToCell(0,0, 'Reservas en Carflet ('+period+')');
        }
    
         // Example : writing to a cell
        worksheet.mergeCells(0,0,0,1); // Example : merging files
        worksheet.writeToCell(1,0, 'Fecha');
        worksheet.writeToCell(1,1, 'Fecha Recogida');
        worksheet.writeToCell(1,2, 'Recogida');
        worksheet.writeToCell(1,3, 'Fecha Devolucion');
        worksheet.writeToCell(1,4, 'Devolucion');
        worksheet.writeToCell(1,5, 'Nombre');
        worksheet.writeToCell(1,6, 'Contacto');
        worksheet.writeToCell(1,7, 'Compañia');
        worksheet.writeToCell(1,8, 'Telf');
        worksheet.writeToCell(1,9, 'Tipo');
        worksheet.writeToCell(1,10, 'Procedencia');
        worksheet.writeToCell(1,11, 'Días');
        worksheet.writeToCell(1,12, 'Prepago');
        worksheet.writeToCell(1,13, 'Coste');
        worksheet.writeToCell(1,14, 'Comision');
        worksheet.writeToCell(1,15, 'Comisionado');
        worksheet.writeToCell(1,16, 'Precio');
        worksheet.writeToCell(1,17, 'Pagada');
        worksheet.writeToCell(1,18, 'Notas');
        worksheet.writeToCell(1,19, 'Localizador');
    
        worksheet.setColumnProperties([ // Example : setting the width of columns in the file
          { wch: 20 },
          { wch: 30 }
        ]);
    
        var row = 2;
    
    
        // console.log("el año");
        // console.log(currentYear);
    
        if (mode == 1){
            //mensuales
            var start = moment(parseInt(period)+"-01-"+currentYear+"", "MM-DD-YYYY").toDate();
            if(parseInt(period) == 12){
                // console.log("entra");
                var nextYear = parseInt(currentYear)+1;
                var end = moment("01-01-"+(nextYear)+"", "MM-DD-YYYY").toDate();
            } else {
    
                var end = moment((parseInt(period)+1)+"-01-"+currentYear+"", "MM-DD-YYYY").toDate();
            }
    
            //console.log(start);
            //console.log(end);
            Bookings.find({createdAt: {'$gte': start, '$lt': end}},{sort:{createdAt: 1}}).forEach(function(booking) {
                worksheet.writeToCell(row, 0, booking.createdAt);
                worksheet.writeToCell(row, 1, booking.fechareco);
                worksheet.writeToCell(row, 2, booking.recogida);
                worksheet.writeToCell(row, 3, booking.fechadevo);
                worksheet.writeToCell(row, 4, booking.devolucion);
                worksheet.writeToCell(row, 5, booking.nombre);
                worksheet.writeToCell(row, 6, booking.emailCliente);
                worksheet.writeToCell(row, 7, booking.company);
                worksheet.writeToCell(row, 8, booking.telefonoCliente);
                worksheet.writeToCell(row, 9, booking.tipo);
                worksheet.writeToCell(row, 10, booking.procedencia);
                var dias = Meteor.call('calculaDias', booking.fechadevo, booking.fechareco);
                worksheet.writeToCell(row, 11, dias);
                worksheet.writeToCell(row, 12, booking.qtyPrepago);
                worksheet.writeToCell(row, 13, booking.costeCoche);
                worksheet.writeToCell(row, 14, booking.euroscarflet);
                worksheet.writeToCell(row, 15, booking.comisionPerson);
                worksheet.writeToCell(row, 16, booking.comisionEuros);
                worksheet.writeToCell(row, 17, booking.pagada);
                worksheet.writeToCell(row, 18, booking.notas);
                worksheet.writeToCell(row, 19, booking.localizador);
                worksheet.writeToCell(row, 20, booking.cancelada);
                row++;
            });
        }
    
        if(mode == 2){
            // console.log("trimestrales");
            var mesIni = 3*period - 2;
            var mesFin = 3*period + 1;
            var start = moment(mesIni+"-01-"+currentYear+"", "MM-DD-YYYY").toDate();
            if(period == 4){
              var end = moment("12-31-"+currentYear+"", "MM-DD-YYYY").toDate();
            } else{
              var end = moment(mesFin+"-01-"+currentYear+"", "MM-DD-YYYY").toDate();
            }
    
            Bookings.find({createdAt: {'$gte': start, '$lt': end}},{sort:{createdAt: 1}}).forEach(function(booking) {
                worksheet.writeToCell(row, 0, booking.createdAt);
                worksheet.writeToCell(row, 1, booking.fechareco);
                worksheet.writeToCell(row, 2, booking.recogida);
                worksheet.writeToCell(row, 3, booking.fechadevo);
                worksheet.writeToCell(row, 4, booking.devolucion);
                worksheet.writeToCell(row, 5, booking.nombre);
                worksheet.writeToCell(row, 6, booking.emailCliente);
                worksheet.writeToCell(row, 7, booking.company);
                worksheet.writeToCell(row, 8, booking.telefonoCliente);
                worksheet.writeToCell(row, 9, booking.tipo);
                worksheet.writeToCell(row, 10, booking.procedencia);
                var dias = Meteor.call('calculaDias', booking.fechadevo, booking.fechareco);
                worksheet.writeToCell(row, 11, dias);
                worksheet.writeToCell(row, 12, booking.qtyPrepago);
                worksheet.writeToCell(row, 13, booking.costeCoche);
                worksheet.writeToCell(row, 14, booking.euroscarflet);
                worksheet.writeToCell(row, 15, booking.comisionPerson);
                worksheet.writeToCell(row, 16, booking.comisionEuros);
                worksheet.writeToCell(row, 17, booking.pagada);
                worksheet.writeToCell(row, 18, booking.notas);
                worksheet.writeToCell(row, 19, booking.localizador);
                worksheet.writeToCell(row, 20, booking.cancelada);
                row++;
            });
    
        }
    
        if(mode == 4){
            // console.log("trimestrales");
            var start = moment(finitial+"-01-"+currentYear+"", "MM-DD-YYYY").toDate();
            if(parseInt(ffin) == 12){
                var end = moment((ffin)+"-31-"+currentYear+"", "MM-DD-YYYY").toDate();
            } else {
                var end = moment((ffin+1)+"-01-"+currentYear+"", "MM-DD-YYYY").toDate();
            }
    
            Bookings.find({createdAt: {'$gte': start, '$lt': end}},{sort:{createdAt: 1}}).forEach(function(booking) {
                worksheet.writeToCell(row, 0, booking.createdAt);
                worksheet.writeToCell(row, 1, booking.fechareco);
                worksheet.writeToCell(row, 2, booking.recogida);
                worksheet.writeToCell(row, 3, booking.fechadevo);
                worksheet.writeToCell(row, 4, booking.devolucion);
                worksheet.writeToCell(row, 5, booking.nombre);
                worksheet.writeToCell(row, 6, booking.emailCliente);
                worksheet.writeToCell(row, 7, booking.company);
                worksheet.writeToCell(row, 8, booking.telefonoCliente);
                worksheet.writeToCell(row, 9, booking.tipo);
                worksheet.writeToCell(row, 10, booking.procedencia);
                var dias = Meteor.call('calculaDias', booking.fechadevo, booking.fechareco);
                worksheet.writeToCell(row, 11, dias);
                worksheet.writeToCell(row, 12, booking.qtyPrepago);
                worksheet.writeToCell(row, 13, booking.costeCoche);
                worksheet.writeToCell(row, 14, booking.euroscarflet);
                worksheet.writeToCell(row, 15, booking.comisionPerson);
                worksheet.writeToCell(row, 16, booking.comisionEuros);
                worksheet.writeToCell(row, 17, booking.pagada);
                worksheet.writeToCell(row, 18, booking.notas);
                worksheet.writeToCell(row, 19, booking.localizador);
                worksheet.writeToCell(row, 20, booking.cancelada);
                row++;
            });
    
        }
    
        if(mode == 5){
            // console.log("trimestrales");
            var start = moment("01-01-"+period+"", "MM-DD-YYYY").toDate();
            var end = moment("01-01-"+(period+1)+"", "MM-DD-YYYY").toDate();
    
            Bookings.find({createdAt: {'$gte': start, '$lt': end}},{sort:{createdAt: 1}}).forEach(function(booking) {
                worksheet.writeToCell(row, 0, booking.createdAt);
                worksheet.writeToCell(row, 1, booking.fechareco);
                worksheet.writeToCell(row, 2, booking.recogida);
                worksheet.writeToCell(row, 3, booking.fechadevo);
                worksheet.writeToCell(row, 4, booking.devolucion);
                worksheet.writeToCell(row, 5, booking.nombre);
                worksheet.writeToCell(row, 6, booking.emailCliente);
                worksheet.writeToCell(row, 7, booking.company);
                worksheet.writeToCell(row, 8, booking.telefonoCliente);
                worksheet.writeToCell(row, 9, booking.tipo);
                worksheet.writeToCell(row, 10, booking.procedencia);
                var dias = Meteor.call('calculaDias', booking.fechadevo, booking.fechareco);
                worksheet.writeToCell(row, 11, dias);
                worksheet.writeToCell(row, 12, booking.qtyPrepago);
                worksheet.writeToCell(row, 13, booking.costeCoche);
                worksheet.writeToCell(row, 14, booking.euroscarflet);
                worksheet.writeToCell(row, 15, booking.comisionPerson);
                worksheet.writeToCell(row, 16, booking.comisionEuros);
                worksheet.writeToCell(row, 17, booking.pagada);
                worksheet.writeToCell(row, 18, booking.notas);
                worksheet.writeToCell(row, 19, booking.localizador);
                worksheet.writeToCell(row, 20, booking.cancelada);
                row++;
            });
    
        }
    
        if(mode == 3){
            //console.log("anuales");
            var start = moment("01-01-"+period+"", "MM-DD-YYYY").toDate();
            var end = moment("12-31-"+period+"", "MM-DD-YYYY").toDate();
    
    
    
    
            if (period < 2017){
                BookingsOld.find({createdAt: {'$gte': start, '$lt': end}},{sort:{createdAt: 1}}).forEach(function(booking) {
                    worksheet.writeToCell(row, 0, booking.createdAt);
                    worksheet.writeToCell(row, 1, booking.fechareco);
                    worksheet.writeToCell(row, 2, booking.recogida);
                    worksheet.writeToCell(row, 3, booking.fechadevo);
                    worksheet.writeToCell(row, 4, booking.devolucion);
                    worksheet.writeToCell(row, 5, booking.nombre);
                    worksheet.writeToCell(row, 6, booking.emailCliente);
                    worksheet.writeToCell(row, 7, booking.company);
                    worksheet.writeToCell(row, 8, booking.telefonoCliente);
                    worksheet.writeToCell(row, 9, booking.tipo);
                    worksheet.writeToCell(row, 10, booking.procedencia);
                    var dias = Meteor.call('calculaDias', booking.fechadevo, booking.fechareco);
                    worksheet.writeToCell(row, 11, dias);
                    worksheet.writeToCell(row, 12, booking.qtyPrepago);
                    worksheet.writeToCell(row, 13, booking.costeCoche);
                    worksheet.writeToCell(row, 14, booking.euroscarflet);
                    worksheet.writeToCell(row, 15, booking.comisionPerson);
                    worksheet.writeToCell(row, 16, booking.comisionEuros);
                    worksheet.writeToCell(row, 17, booking.pagada);
                    worksheet.writeToCell(row, 18, booking.notas);
                    worksheet.writeToCell(row, 19, booking.localizador);
                    worksheet.writeToCell(row, 20, booking.cancelada);
                    row++;
                });
            } else {
                Bookings.find({createdAt: {'$gte': start, '$lt': end}},{sort:{createdAt: 1}}).forEach(function(booking) {
                    worksheet.writeToCell(row, 0, booking.createdAt);
                    worksheet.writeToCell(row, 1, booking.fechareco);
                    worksheet.writeToCell(row, 2, booking.recogida);
                    worksheet.writeToCell(row, 3, booking.fechadevo);
                    worksheet.writeToCell(row, 4, booking.devolucion);
                    worksheet.writeToCell(row, 5, booking.nombre);
                    worksheet.writeToCell(row, 6, booking.emailCliente);
                    worksheet.writeToCell(row, 7, booking.company);
                    worksheet.writeToCell(row, 8, booking.telefonoCliente);
                    worksheet.writeToCell(row, 9, booking.tipo);
                    worksheet.writeToCell(row, 10, booking.procedencia);
                    var dias = Meteor.call('calculaDias', booking.fechadevo, booking.fechareco);
                    worksheet.writeToCell(row, 11, dias);
                    worksheet.writeToCell(row, 12, booking.qtyPrepago);
                    worksheet.writeToCell(row, 13, booking.costeCoche);
                    worksheet.writeToCell(row, 14, booking.euroscarflet);
                    worksheet.writeToCell(row, 15, booking.comisionPerson);
                    worksheet.writeToCell(row, 16, booking.comisionEuros);
                    worksheet.writeToCell(row, 17, booking.pagada);
                    worksheet.writeToCell(row, 18, booking.notas);
                    worksheet.writeToCell(row, 19, booking.localizador);
                    worksheet.writeToCell(row, 20, booking.cancelada);
                    row++;
                });
            }
        }
    
        workbook.addSheet('MySheet', worksheet);
    
        mkdirp('tmp', Meteor.bindEnvironment(function (err) {
          if (err) {
            console.log('Error creating tmp dir', err);
            futureResponse.throw(err);
          }
          else {
            //console.log("No error al crear el directorio temporal");
            var uuid = UUID.v4();
            var filePath = './tmp/' + uuid;
            workbook.writeToFile(filePath);
    
            temporaryFiles.importFile(filePath, {
              filename : uuid,
              contentType: 'application/octet-stream'
            }, function(err, file) {
              if (err) {
                console.log('error al importar');
                futureResponse.throw(err);
              }
              else {
                  console.log('no error al importar');
                futureResponse.return('/gridfs/temporaryFiles/' + file._id);
              }
            });
          }
        }));
    
        return futureResponse.wait();
      },
    
      downloadExcelEmails: function(){
        var Future = Npm.require('fibers/future');
        var futureResponse = new Future();
        //console.log("Entra en la llamada del server");
    
        var excel = new Excel('xlsx'); // Create an excel object  for the file you want (xlsx or xls)
        var workbook = excel.createWorkbook(); // Create a workbook (equivalent of an excel file)
        var worksheet = excel.createWorksheet(); // Create a worksheet to be added to the workbook
    
        var row = 1;
    
        Bookings.find({}).forEach(function(booking) {
            worksheet.writeToCell(row, 0, booking.emailCliente);
            row++;
        });
    
        workbook.addSheet('MySheet', worksheet); // Add the worksheet to the workbook
    
        mkdirp('tmp', Meteor.bindEnvironment(function (err) {
          if (err) {
            console.log('Error creating tmp dir', err);
            futureResponse.throw(err);
          }
          else {
            console.log("No error al crear el directorio temporal");
            var uuid = UUID.v4();
            var filePath = './tmp/' + uuid;
            workbook.writeToFile(filePath);
    
            temporaryFiles.importFile(filePath, {
              filename : uuid,
              contentType: 'application/octet-stream'
            }, function(err, file) {
              if (err) {
                console.log('error al importar');
                futureResponse.throw(err);
              }
              else {
                  console.log('no error al importar');
                futureResponse.return('/gridfs/temporaryFiles/' + file._id);
              }
            });
          }
        }));
    
        return futureResponse.wait();
    
      },
    
    
    
      downloadExcelFile : function() {
        var Future = Npm.require('fibers/future');
        var futureResponse = new Future();
        console.log("Entra en la llamada del server");
    
        var excel = new Excel('xlsx'); // Create an excel object  for the file you want (xlsx or xls)
        var workbook = excel.createWorkbook(); // Create a workbook (equivalent of an excel file)
        var worksheet = excel.createWorksheet(); // Create a worksheet to be added to the workbook
        worksheet.writeToCell(0,0, 'Reservas en Carflet'); // Example : writing to a cell
        worksheet.mergeCells(0,0,0,1); // Example : merging files
        worksheet.writeToCell(1,0, 'Fecha');
        worksheet.writeToCell(1,1, 'Fecha Recogida');
        worksheet.writeToCell(1,2, 'Recogida');
        worksheet.writeToCell(1,3, 'Fecha Devolucion');
        worksheet.writeToCell(1,4, 'Devolucion');
        worksheet.writeToCell(1,5, 'Nombre');
        worksheet.writeToCell(1,6, 'Contacto');
        worksheet.writeToCell(1,7, 'Compañia');
        worksheet.writeToCell(1,8, 'Tipo');
        worksheet.writeToCell(1,9, 'Procedencia');
        worksheet.writeToCell(1,10, 'Días');
        worksheet.writeToCell(1,11, 'Prepago');
        worksheet.writeToCell(1,12, 'Coste');
        worksheet.writeToCell(1,13, 'Precio');
        worksheet.writeToCell(1,14, 'Notas');
        // worksheet.writeToCell(1,15, '€ Carflet');
        // worksheet.writeToCell(1,15, 'Total €');
        // worksheet.writeToCell(1,16, 'Notas');
    
    
        worksheet.setColumnProperties([ // Example : setting the width of columns in the file
          { wch: 20 },
          { wch: 30 }
        ]);
    
        // Example : writing multple rows to file
        var row = 2;
        Bookings.find({}).forEach(function(booking) {
            worksheet.writeToCell(row, 0, booking.createdAt);
            worksheet.writeToCell(row, 1, booking.fechareco);
            worksheet.writeToCell(row, 2, booking.recogida);
            worksheet.writeToCell(row, 3, booking.fechadevo);
            worksheet.writeToCell(row, 4, booking.devolucion);
            worksheet.writeToCell(row, 5, booking.nombre);
            worksheet.writeToCell(row, 6, booking.emailCliente);
            worksheet.writeToCell(row, 7, booking.company);
            worksheet.writeToCell(row, 8, booking.tipo);
            worksheet.writeToCell(row, 9, booking.procedencia);
            var dias = Meteor.call('calculaDias', booking.fechadevo, booking.fechareco);
            worksheet.writeToCell(row, 10, dias);
            worksheet.writeToCell(row, 11, booking.qtyPrepago);
            worksheet.writeToCell(row, 12, booking.costeCoche);
            worksheet.writeToCell(row, 13, booking.euroscarflet);
            worksheet.writeToCell(row, 14, booking.notas);
            // var total = Meteor.call('calculaTotal', booking.eurosprocedencia, booking.eurosproveedor, booking.euroscarflet);
            // worksheet.writeToCell(row, 15, total);
            // worksheet.writeToCell(row, 16, booking.notas);
    
          row++;
        });
    
        workbook.addSheet('MySheet', worksheet); // Add the worksheet to the workbook
    
        mkdirp('tmp', Meteor.bindEnvironment(function (err) {
          if (err) {
            console.log('Error creating tmp dir', err);
            futureResponse.throw(err);
          }
          else {
            console.log("No error al crear el directorio temporal");
            var uuid = UUID.v4();
            var filePath = './tmp/' + uuid;
            workbook.writeToFile(filePath);
    
            temporaryFiles.importFile(filePath, {
              filename : uuid,
              contentType: 'application/octet-stream'
            }, function(err, file) {
              if (err) {
                console.log('error al importar');
                futureResponse.throw(err);
              }
              else {
                  console.log('no error al importar');
                futureResponse.return('/gridfs/temporaryFiles/' + file._id);
              }
            });
          }
        }));
    
        return futureResponse.wait();
      },
    
      downloadExcelContactsFile : function() {
        var Future = Npm.require('fibers/future');
        var futureResponse = new Future();
        console.log("Entra en la llamada del server");
    
        var excel = new Excel('xlsx'); // Create an excel object  for the file you want (xlsx or xls)
        var workbook = excel.createWorkbook(); // Create a workbook (equivalent of an excel file)
        var worksheet = excel.createWorksheet(); // Create a worksheet to be added to the workbook
    
        var row = 1;
    
        Contacts.find({}).forEach(function(contact) {
            worksheet.writeToCell(row, 0, contact.email);
            row++;
        });
    
        workbook.addSheet('MySheet', worksheet); // Add the worksheet to the workbook
    
        mkdirp('tmp', Meteor.bindEnvironment(function (err) {
          if (err) {
            console.log('Error creating tmp dir', err);
            futureResponse.throw(err);
          }
          else {
            console.log("No error al crear el directorio temporal");
            var uuid = UUID.v4();
            var filePath = './tmp/' + uuid;
            workbook.writeToFile(filePath);
    
            temporaryFiles.importFile(filePath, {
              filename : uuid,
              contentType: 'application/octet-stream'
            }, function(err, file) {
              if (err) {
                console.log('error al importar');
                futureResponse.throw(err);
              }
              else {
                  console.log('no error al importar');
                futureResponse.return('/gridfs/temporaryFiles/' + file._id);
              }
            });
          }
        }));
    
        return futureResponse.wait();
      }
});