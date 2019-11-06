// STEPS FOR NEW COLL
// 1. Lib -> Collection create new mongo collection
// 2. Lib -> collection schema create new schema
// 3. Lib -> collection allow
// 4. client -> common subscribe
// 5. server -> common publish

Bookings = new Mongo.Collection("bookings");

Activities = new Mongo.Collection("activities");

Workers = new Mongo.Collection("workers");

TareasWorkers = new Mongo.Collection("tareasworkers");

Presupuestos = new Mongo.Collection("presupuestos");

Invoices = new Mongo.Collection("invoices");

Comisionables = new Mongo.Collection("comisionables");

Ciudades = new Mongo.Collection("ciudades");

// Bookings2016 = new Mongo.Collection("bookings2016");

Contacts = new Mongo.Collection("contacts");

Updates = new Mongo.Collection("updates");

HelpersFactura = new Mongo.Collection("helpersfactura");

Flota = new Mongo.Collection("flota");

Llaves = new Mongo.Collection("llaves");

Oficinas = new Mongo.Collection("oficinas");

Incomes = new Mongo.Collection("incomes");

Enterprises = new Mongo.Collection("enterprises");

DevExpenses = new Mongo.Collection("devexpenses");

Tides = new Mongo.Collection("tides");

Multas = new Mongo.Collection("multas");

temporaryFiles = new FileCollection('temporaryFiles',
  { resumable: false,   // Enable built-in resumable.js upload support
    http: [
      { method: 'get',
        path: '/:_id',  // this will be at route "/gridfs/temporaryFiles/:_id"
        lookup: function (params) {  // uses express style url params
          return { _id: params._id};       // a query mapping url to myFiles
        }
      },
      { method: 'post',
        path: '/:_id',
        lookup: function (params) {
          return {
            _id: params._id
          }
        }}
    ]
  }
);

Schema = {};



Schema.bookingFlota = new SimpleSchema({
  nombreCliente: {
    type: String,
    label: "Nombre"
  },
  momentoRecogida: {
    type: [Date],
    optional: true,
    autoform: {
      afFieldInput: {
        type: "bootstrap-datetimepicker",
        dateTimePickerOptions: {
            format: 'DD/MM/YYYY HH:MM'
        }
      }
    }
  },
  lugarRecogida: {
    type: String,
    label: "Lugar"
  },
  momentoDevolucion: {
    type: [Date],
    optional: true,
    autoform: {
      afFieldInput: {
        type: "bootstrap-datetimepicker",
        dateTimePickerOptions: {
            format: 'DD/MM/YYYY HH:MM'
        }
      }
    }
  },
  lugarDevolucion: {
    type: String,
    label: "Lugar"
  }
});

Schema.direccion = new SimpleSchema({
  lugar: {
    type: String,
    optional: true,
    label: "Lugar"
  },
  calle: {
    type: String,
    label: "Calle",
    optional: true
  },
  cp: {
    type: String,
    label: "CP",
    optional: true
  },
  ciudad: {
    type: String,
    label: "ciudad",
    optional: true
  }
});

Schema.horario = new SimpleSchema({
  LJ : {
    type: String,
    optional: true,
    label: "Lunes a Jueves"
  },
  V : {
    type: String,
    optional: true,
    label: "Viernes"
  },
  S : {
    type: String,
    optional: true,
    label: "Sábado"
  },
  D : {
    type: String,
    optional: true,
    label: "Domingo"
  },
});

Incomes.attachSchema(new SimpleSchema({
    month: {
        type: Number,
        label: "Mes"
    },

    year: {
        type: Number,
        label: "Año"
    },

    amount: {
        type: Number,
        label: "Amount"
    }
}));

Enterprises.attachSchema(new SimpleSchema({
    name: {
        type: String,
        label: "Nombre"
    },
}));

Multas.attachSchema(new SimpleSchema({
  nombreCli: {
    type: String,
    label: "Nombre Cliente",
    optional: true
  },

  importe: {
    type: Number,
    label: "Importe",
    decimal: true
  },

  idRes: {
    type: String,
    optional: true
  }, 
  
  referencia: {
    type: String,
    optional: true,
    label: "Referencia"
  }, 

  fechaRes: {
    type: Date,
    optional: true,
    autoform: {
      afFieldInput: {
        type: "bootstrap-datetimepicker",
        dateTimePickerOptions: {
            format: 'DD/MM/YYYY HH:MM'
        }
      }
    }
  }, 

  fechaRecepcion: {
    type: Date,
    optional: true,
    autoform: {
      afFieldInput: {
        type: "bootstrap-datetimepicker",
        dateTimePickerOptions: {
            format: 'DD/MM/YYYY HH:MM'
        }
      }
    }
  }, 

  fechaMulta: {
    type: Date,
    optional: true,
    autoform: {
      afFieldInput: {
        type: "bootstrap-datetimepicker",
        dateTimePickerOptions: {
            format: 'DD/MM/YYYY HH:MM'
        }
      }
    }
  },

  matricula: {
    type: String,
    optional: true,
    label: "Matricula",
  }, 

  coche: {
    type: String,
    optional: true,
    label: "Coche",
  },
  
  refMulta: {
    type: String,
    optional: true,
    label: "Ref. Multa",
  }, 


  company: {
    type: String,
    optional: true,
    label: "Compañia",
    autoform:{
      options: function(){
        var propios = Flota.find({}).fetch();
        var ajenos = Enterprises.find({}).fetch();
        var todos = []

        for(var i = 0; i<propios.length; i++){
          var currentFlota = {
            "label": propios[i].nombreCoche,
            "value": propios[i].nombreCoche
          }
          todos.push(currentFlota);
        }

        for(var j = 0; j<ajenos.length; j++){
          var currentEnt = {
            "label": ajenos[j].name,
            "value": ajenos[j].name
          }
          todos.push(currentEnt);
        }

        return todos;
      }
    }
  }, 

  procedencia: {
    type: String,
    optional: true,
    label: "Procedencia",
  },
  
  status: {
    type: Number,
    optional: true,
    autoform: {
      options: function () {
          return [
            {label: "Pendiente", value: 0},
            {label: "Enviada", value: 1},
            {label: "Pagada", value: 2},
          ];
      }
    }
  }, 

  observaciones: {
    type: String,
    optional: true,
    label: "Observaciones",
  }, 

  perdidaPuntos: {
    type: Boolean,
    autoform: {
      type: 'boolean-radios',
      trueLabel: 'Si',
      falseLabel: 'No',
      value: true
    },
    optional: true
  }, 


}));


Ciudades.attachSchema(new SimpleSchema({
    nombre: {
        type: String,
        label: "Nombre"
    }
}));


Llaves.attachSchema(new SimpleSchema({
    idFlota: {
      type: String,
      label: "idflota"
    },

    nameFlota: {
      type: String,
      label: "idflota" 
    },

    ordinalInFlota: {
      type: Number,
      label: "ord"
    },

    locationName: {
      type: String,
      label: "locName"
    },

    locationId: {
      type: String,
      label: "locId"
    }
}));


Invoices.attachSchema(new SimpleSchema({
  idComi: {
    type: String,
    label: "idcomi",
    optional: true
  },

  nameComi: {
    type: String,
    label: "namecomi",
    optional: true 
  },

  dirComi: {
    type: String,
    label: "dirComi",
    optional: true 
  },

  dirComi2: {
    type: String,
    label: "dirComi2",
    optional: true 
  },

  cifComi: {
    type: String,
    label: "cifComi",
    optional: true 
  },

  numFactura: {
    type: String,
    label: "numFactura"
  },

  isRecibidaFactura: {
    type: Boolean,
    autoform: {
      type: 'boolean-radios',
      trueLabel: 'Recibida',
      falseLabel: 'Emitida',
      value: true
    }
  },

  precio: {
    type: Number,
    decimal: true,
    label: "ord"
  },

  fechaFactura: {
    type: Date,
    optional: true,
    label: "Fecha Factura",
    autoform: {
      afFieldInput: {
        type: "bootstrap-datepicker",
        defaultValue: new Date(),
        datePickerOptions: {
          format: "dd/mm/yyyy",
          weekStart: 1
        }
      }
    }
  },

  fechaEntrega: {
    type: Date,
    optional: true,
    label: "Fecha Entrega",
    autoform: {
      afFieldInput: {
        type: "bootstrap-datepicker",
        defaultValue: new Date(),
        datePickerOptions: {
          format: "dd/mm/yyyy",
          weekStart: 1
        }
      }
    }
  }
}));


Comisionables.attachSchema(new SimpleSchema({
    name: {
        type: String,
        label: "Nombre"
    },

    ciudad: {
        type: String,
        label: "Ciudad",
        optional: true,
    },

    lastLiquidacion: {
      type: Date,
      optional: true,
      label: "Fecha de comision",
      autoform: {
        afFieldInput: {
          type: "bootstrap-datetimepicker"
        }
      }
    },

    pendienteLiquidar: {
      type: Boolean,
      autoform: {
        type: 'boolean-radios',
        trueLabel: 'Pendiente',
        falseLabel: 'Liquidado',
        value: true
      },
      optional: true,
    },
}));

Tides.attachSchema(new SimpleSchema({
    level: {
        type: Number,
        label: "Level"
    },
    threshold: {
        type: Number,
        label: "Threshold"
    },
    month: {
        type: String,
        label: "Mes",
        optional: true
    },
    year: {
        type: String,
        label: "Año",
        optional: true
    },
}));

DevExpenses.attachSchema(new SimpleSchema({
    year: {
        type: String,
        label: "Año"
    },
    month: {
        type: String,
        label: "Mes"
    },
    amount: {
        type: Number,
        label: "Cantidad"
    },
    tideLevel: {
        type: Number,
        label: "Nivel",
        optional: true
    },
    concept: {
        type: String,
        label: "Concepto",
        optional: true
    }
}));

Workers.attachSchema(new SimpleSchema({
    nombre: {
        type: String,
        label: "Nombre",
    },

    ciudad: {
        type: String,
        optional: true,
        label: "Ciudad",
    },

    isActive: {
      type: Boolean,
      autoform: {
        type: 'boolean-radios',
        trueLabel: 'Active',
        falseLabel: 'Inactive',
        value: true
      }
    }
}));


var schemaTask = new SimpleSchema({
    tarea: {
        type: String,
        label: "Tarea",
    },

    idBooking: {
        type: String,
        label: "BookingID",
        optional: true,
    },

    nameBooking: {
        type: String,
        label: "BookingName",
        optional: true,
    },

    worker: {
        type: String,
        label: "Worker",
    },

    ciudad: {
        type: String,
        label: "Ciudad",
        optional: true,
    },

    coche: {
        type: String,
        label: "Coche",
        optional: true,

        autoform: {
            defaultValue: "Kya Rio",
            options: function(){
                var opts = Flota.find().map(function(coche){
                    return {
                        label: coche.nombreCoche,
                        value: coche.nombreCoche
                    }
                });

                return opts;
            }
        }
    },

    fecha: {
        type: Date,
        optional: true,
        label: "Fecha",
        autoform: {
          afFieldInput: {
            type: "bootstrap-datepicker",
            defaultValue: new Date(),
            datePickerOptions: {
              format: "dd/mm/yyyy",
              weekStart: 1
            }
          }
        }
    },

    type: {
        type: String,
        label: "Tipo",
        optional: true,

        autoform: {
            // type: "select-radio-inline",
            defaultValue: "Lavado",
            options: function () {
                return [
                    {label: "Lavado", value: "Lavado" },
                    // {label: "Recogida", value: "Recogida" },
                    // {label: "Devolucion", value: "Devolucion"},
                    {label: "Gasolina", value: "Gasolina"},
                    {label: "Taxi", value: "Taxi"},
                    {label: "Autobus", value: "Autobus"},
                    {label: "Parking", value: "Parking"},
                    {label: "Peaje", value: "Peaje"},
                    {label: "Aceite", value: "Aceite"},
                    {label: "Ruedas", value: "Ruedas"},
                    {label: "Efectivo", value: "Efectivo"},
                    {label: "Taller", value: "Taller"},
                ];

            }
        }
    },

    precio: {
        type: Number,
        label: "Precio",
        defaultValue: 8,
        decimal: true
    },

    comments: {
        type: String,
        label: "Comentarios",
        optional: true
    }
});

TareasWorkers.attachSchema(schemaTask);


var schemaPresup = new SimpleSchema({
  fecharecopre: {
    type: Date,
    optional: true,
    label: "Fecha Recogida",
    autoform: {
      afFieldInput: {
        type: "bootstrap-datepicker",
        defaultValue: new Date(),
        datePickerOptions: {
          format: "dd/mm/yyyy",
          weekStart: 1
        }
      }
    }
  },

  fechadevopre: {
    type: Date,
    optional: true,
    label: "Fecha Devolucion",
    autoform: {
      afFieldInput: {
        type: "bootstrap-datepicker",
        defaultValue: new Date(),
        datePickerOptions: {
          format: "dd/mm/yyyy",
          weekStart: 1
        }
      }
    }
  },

  fechavalidez: {
    type: Date,
    optional: true,
    label: "Fecha Validez",
    autoform: {
      afFieldInput: {
        type: "bootstrap-datepicker",
        defaultValue: new Date(),
        datePickerOptions: {
          format: "dd/mm/yyyy",
          weekStart: 1
        }
      }
    }
  },

  company: {
      type: String,
      label: "Compañía",
      autoform:{
        options: function(){
          var propios = Flota.find({}).fetch();
          var ajenos = Enterprises.find({}).fetch();
          var todos = []

          for(var i = 0; i<propios.length; i++){
            var currentFlota = {
              "label": propios[i].nombreCoche,
              "value": propios[i].nombreCoche
            }
            todos.push(currentFlota);
          }

          for(var j = 0; j<ajenos.length; j++){
            var currentEnt = {
              "label": ajenos[j].name,
              "value": ajenos[j].name
            }
            todos.push(currentEnt);
          }

          return todos;
        }
      }
  },

  type: {
      type: String,
      label: "Coche",
      optional: true,

      autoform: {
          // type: "select-radio-inline",
          defaultValue: "A",
          options: function () {
              return [
                {label: "A", value: "A"},
                {label: "B", value: "B"},
                {label: "C", value: "C"},
                {label: "E", value: "E"},
                {label: "F", value: "F"},
                {label: "G", value: "G"},
                {label: "H", value: "H"},
                {label: "I", value: "I"},
                {label: "J", value: "J"},
                {label: "L", value: "K"},
                {label: "K", value: "L"},
                {label: "Transfer", value: "Transfer"}

              ];

          }
      }
  },

  nombrepre: {
    type: String,
    label: "Nombre",
    optional: true,
  },

  tfonopre: {
    type: String,
    label: "Tfono",
    optional: true,
  },

  mailpre: {
    type: String,
    label: "Email",
    optional: true,
  },

  recopre: {
    type: String,
    label: "Recogida",
    optional: true,
  },

  devopre: {
    type: String,
    label: "Devolucion",
    optional: true,
  },

  sent: {
    type: Boolean,
    optional: true,
    autoform: {
    options: function () {
        return [
          {label: "No", value: false},
          {label: "Yes", value: true}
        ];
      }
    }
  },

  costepre: {
    type: Number,
    label: "Coste Carflet",
    defaultValue: 60,
    decimal: true,
  },

  cotizacion: {
    type: Number,
    label: "Cotizado",
    defaultValue: 90,
    decimal: true,
  },

  fechacotizacion: {
    type: Date,
    optional: true,
    label: "Fecha Cotizacion",
    autoform: {
      afFieldInput: {
        type: "bootstrap-datepicker",
        defaultValue: new Date(),
        datePickerOptions: {
          format: "dd/mm/yyyy",
          weekStart: 1
        }
      }
    }
  },

  observaciones: {
    type: String,
    label: "Observaciones",
    optional: true,
  }
});

Presupuestos.attachSchema(schemaPresup);

Activities.attachSchema(new SimpleSchema({
    time: {
        type: Date,
        optional: true,
        label: "Momento de Evento",
    },

    isPublic: {
        // false for private; true for public
        type: Boolean
    },

    author: {
        type: String,
        label: "Autor"
    },

    type: {
        type: Number,
        // 0 Testing
        // 1 Booking Life (CRUD)
        // 2 Booking <-> User (mail conf, contract, invoice)
        // 3 Booking Income (pagada/pend, localizador, coste)
        // 4 Flota Life (CRUD)
        // 5 Booking <-> Flota
        label: "Id Tipo"
    },

    desc: {
        type: String,
        label: "Descripcion Evento"
    },

    nombreBooking: {
        type: String,
        optional: true,
        label: "Nombre en Reserva"
    },

    fechaBooking: {
        type: Date,
        optional: true,
        label: "Fecha de Reserva",
    },

    recoBooking: {
        type: String,
        optional: true,
        label: "Lugar de Recogida"
    },

    devoBooking: {
        type: String,
        optional: true,
        label: "Lugar de Devolucion"
    }
}));


Oficinas.attachSchema(new SimpleSchema({
  nombre: {
    type: String,
    label: "Nombre"
  },

  tipo: {
    type: String,
    label: "Tipo",
    optional: true,
    autoform: {
        type: "select-radio-inline",
        defaultValue: "Oficina",
        options: function () {
            return [
                {label: "Oficina", value: "Oficina" },
                {label: "Aeropuerto", value: "Aeropuerto" },
                {label: "Estacion", value: "Estacion" },
                {label: "Hotel", value: "Hotel" }
            ];

        }
    }
  }

}));
Flota.attachSchema(new SimpleSchema({
  nombreCoche: {
    type: String,
    label: "Nombre"
  },
  categoria: {
      type: String,
      label: "Categoria",
      autoform:{
          afFieldInput: {
              firstOption: "Elegir tipo de coche"
          }
      }
  },
  color: {
    type: String,
    label: "Color",
    optional: true,
    autoform: {
      afFieldInput: {
        type: "color"
      }
    }
  },
  año: {
    type: Number,
    label: "Año",
    optional: true
  },
  pasajeros: {
    type: Number,
    label: "Pasajeros"
  },
  maletas: {
    type: Number,
    label: "Maletas"
  },
  imagen: {
    type: String,
    label: "Nombre Imagen"
  },
  activado: {
      type: String,
      optional: true,
      autoform: {
        afFieldInput: {
          type: "boolean-checkbox"
        }
      }
    },
  ubicacion: {
    type: String,
    label: "Ubicación"
  },
  ubicacionLastUpdate: {
    type: [Date],
    label: "Ultima actualizacion de ubicación",
    optional: true
  },
  bastidor: {
      type: String,
      label: "Bastidor",
      optional: true
  },
  matricula: {
      type: String,
      label: "Matricula",
      optional: true
  },
  lastITV: {
    type: Date,
    optional: true,
    label: "Fecha Ultima ITV",
    autoform: {
      afFieldInput: {
        type: "bootstrap-datepicker",
        datePickerOptions: {
          format: "dd/mm/yyyy",
          weekStart: 1
        }
      }
    }
  },
  oilChange: {
    type: Number,
    optional: true,
    label: "Km Cambio Aceite"
  },

  damages: {
    type: String,
    optional: true,
    label: "Daños"
  }

}));


Updates.attachSchema(new SimpleSchema({
    fecha: {
      type: Date
    },
    myID: {
      type: Number
    }
}));

HelpersFactura.attachSchema(new SimpleSchema({
    facFecha: {
        type: Date
    },
    facTodayNumber: {
        type: Number
    }
}));

Contacts.attachSchema(new SimpleSchema({

  nombre: {
    type: String,
    label: "Nombre"
  },

  email: {
    type: String,
    label: "eMail"
  },

  telefono: {
    type: String,
    label: "Teléfono"
  },

  procedencia: {
    type: String,
    label: "Procedencia",
    optional: true
  }
}));

Bookings.attachSchema(new SimpleSchema({

    factura: {
        type: String,
        label: "¿Factura?",
        autoform: {
            type: "select-radio-inline",
            defaultValue: "SI",
            options: function () {
                return [
                    {label: "SI", value: "SI" },
                    {label: "NO", value: "NO" }
                ]


            },


        }
    },

    isComissioned: {
        type: Boolean,
        optional: true
    },

    comisionPerson: {
        type: String,
        optional: true
    },

    comisionEuros: {
        type: Number,
        optional: true,
        decimal: true,
    },

    comisionId: {
        type: String,
        optional: true,
    },

    comisionDate: {
        type: Date,
        optional: true,
        label: "Fecha de comision",
        autoform: {
          afFieldInput: {
            type: "bootstrap-datetimepicker"
          }
        }
    },

    transfer: {
        type: Boolean,
        optional: true
    },

    pagada: {
        type: Boolean,
        optional: true
    },

    cancelada: {
      type: Boolean,
      optional: true
    },

    localizador: {
        type: String,
        optional: true,
        label: "Localizador"
    },

    nombre: {
        type: String,
        label: "Nombre"
    },

    qtyPendiente: {
        type: Number,
        optional: true,
        decimal: true
    },

    qtyPrepago: {
        type: Number,
        label: "Prepago",
        optional: true,
        decimal: true
    },


    company: {
        type: String,
        label: "Compañía",
        autoform:{
            afFieldInput: {
                firstOption: "Elegir compañía"
            }
        }
    },

    tipo: {
        type: String,
        label: "Tipo de Coche",
        autoform:{
            afFieldInput: {
                firstOption: "Elegir tipo de coche"
            }
        }
    },

    matribooking: {
      type: String,
      label: "Matricula",
      optional: true
    },   

    emailCliente: {
      type: String,
      label: "eMail Cliente",
      optional: true
    },

    telefonoCliente: {
      type: String,
      label: "Telf Cliente",
      optional: true
    },

    tarifa: {
        type: String,
        label: "Tarifa",
        optional: true,
        autoform: {
            type: "select-radio-inline",
            defaultValue: "Basica",
            options: function () {
                return [
                    {label: "Básica", value: "Basica" },
                    {label: "Ampliada", value: "Ampliada" }

                ];

            }
        }
    },

    procedencia: {
        type: String,
        label: "Procedencia"
    },

    recogida: {
        type: String,
        label: "Ciudad de Recogida"
    },

    fechareco: {
      type: Date,
      optional: true,
      label: "Fecha de Recogida",
      autoform: {
        afFieldInput: {
          type: "bootstrap-datetimepicker"
        }
      }
    },

    recoworker: {
      type: String,
      optional: true
    },

    recoworkerId: {
      type: String,
      optional: true
    },

    devoworker: {
      type: String,
      optional: true
    },

    devoworkerId: {
      type: String,
      optional: true
    },

    // fechareco: {
    //     type: Date,
    //     label: "Fecha de Recogida",
    //     optional: true,
    //     autoform: {
    //         defaultValue: new Date()
    //     }
    // },

    fechadevo: {
        type: Date,
        optional: true,
        label: "Fecha de Devolución",
        autoform: {
          afFieldInput: {
            type: "bootstrap-datetimepicker"
          }
        }
    },

    devolucion: {
        type: String,
        label: "Ciudad de Devolución"
    },

    // supdevolucion: {
    //     type: String,
    //     label: "Sumplementos de Devolución",
    //     optional: true,
    //     autoform: {
    //         type: "select-radio-inline",
    //         defaultValue: "0",
    //         options: function () {
    //             return [
    //                 {label: "Sin Suplemento: 0€", value: "0" },
    //                 {label: "Local: 20€", value: "Local: 20€" },
    //                 {label: "Nacional: 50€", value: "Nacional: 50€" }
    //             ];
    //
    //         }
    //     }
    // },

    // supgps: {
    //     type: String,
    //     optional: true,
    //     label: "GPS",
    //     autoform: {
    //         type: "select-radio-inline",
    //         defaultValue: "0",
    //         options: function () {
    //             return [
    //                 {label: "Sin GPS: 0€", value: "0" },
    //                 {label: "GPS Propio: 10€", value: "GPS Propio: 10€" },
    //                 {label: "GPS Ajeno: 15€", value: "GPS Ajeno: 15€" }
    //             ];
    //
    //         }
    //     }
    // },

    // suptransfer: {
    //     type: String,
    //     label: "Transfer",
    //     optional: true,
    //     autoform: {
    //         type: "select-radio-inline",
    //         defaultValue: "0",
    //         options: function () {
    //             return [
    //                 {label: "Sin Transfer: 0€", value: "0" },
    //                 {label: "Transfer Hotel Cádiz: 5€", value: "Transfer Hotel Cádiz: 5€" },
    //                 {label: "Transfer Hotel: 10€", value: "Transfer Hotel: 10€" },
    //                 {label: "Entrega en Hotel: 15€", value: "Entrega en Hotel: 15€" },
    //                 {label: "Transfer Aeropuerto: 65€", value: "Transfer Aeropuerto: 65€" }
    //             ];
    //
    //         }
    //     }
    // },

    eurosproveedor:{
        type: String,
        label: "Pagado a Proveedor",
        optional: true
    },

    euroscarflet:{
        type: String,
        label: "Precio"
    },

    costeCoche: {
        type: String,
        label: 'Coste Coche',
        optional: true
    },

    notas:{
        type: String,
        label: "Notas",
        optional: true
    },

    userName: {
      type: String,
      //autoValue: function () {return Meteor.users.findOne({_id: this.userId}).username}
    },


    createdAt: {
        type: Date
        // autoValue: function() {
        //   if (this.isInsert) {
        //     return new Date();
        //   } else if (this.isUpsert) {
        //     return {$setOnInsert: new Date()};
        //   } else {
        //     //this.unset();  // Prevent user from supplying their own value
        //   }
        // }
    },

    numFactura: {
        type: Number,
        optional: true
    },

    numRegistro: {
        type: Number,
        autoValue: function() {
            var lastBook = Bookings.find({}, {sort: {createdAt: -1}, limit: 1}).fetch().pop();

            if (!lastBook){
                if(fact == "SI"){
                    return (1);
                }

                else{
                    return (0);
                }
            }
            var fact = this.field("factura").value;
            var lastBookRegNumber = lastBook.numRegistro;

            if(fact == "SI"){
                if(!lastBook.numRegistro){
                    return(0);
                }
                else{
                    return (lastBookRegNumber);
                }
            }
            else{
                if(!lastBook.numRegistro){
                    return(1);
                }
                else{
                    return(lastBookRegNumber+1);
                }
            }

        }
    },

    dias: {
        type: Number,
        optional: true
    }


}));

Bookings.allow({
    insert: function(userId,doc){
        return true;
    },

    remove: function(userId,doc){
        return true;
    },

    update: function(userId,doc){
        return true;
    }

});


Contacts.allow({
    insert: function(userId,doc){
        return true;
    },

    remove: function(userId,doc){
        return true;
    },

    update: function(userId,doc){
        return true;
    }

});

Flota.allow({
    insert: function(userId,doc){
        return true;
    },

    remove: function(userId,doc){
        return true;
    },

    update: function(userId,doc){
        return true;
    }

});

Oficinas.allow({
    insert: function(userId,doc){
        return true;
    },

    remove: function(userId,doc){
        return true;
    },

    update: function(userId,doc){
        return true;
    }

});

Incomes.allow({
    insert: function(userId,doc){
        return true;
    },

    remove: function(userId,doc){
        return true;
    },

    update: function(userId,doc){
        return true;
    }

});

Enterprises.allow({
    insert: function(userId,doc){
        return true;
    },

    remove: function(userId,doc){
        return true;
    },

    update: function(userId,doc){
        return true;
    }

});

HelpersFactura.allow({
    insert: function(userId,doc){
        return true;
    },

    remove: function(userId,doc){
        return true;
    },

    update: function(userId,doc){
        return true;
    }

});

DevExpenses.allow({
    insert: function(userId,doc){
        return true;
    },

    remove: function(userId,doc){
        return true;
    },

    update: function(userId,doc){
        return true;
    }

});

Activities.allow({
    insert: function(userId,doc){
        return true;
    },

    remove: function(userId,doc){
        return true;
    },

    update: function(userId,doc){
        return true;
    }

});

Workers.allow({
    insert: function(userId,doc){
        return true;
    },

    remove: function(userId,doc){
        return true;
    },

    update: function(userId,doc){
        return true;
    }

});

TareasWorkers.allow({
    insert: function(userId,doc){
        return true;
    },

    remove: function(userId,doc){
        return true;
    },

    update: function(userId,doc){
        return true;
    }

});

Presupuestos.allow({
    insert: function(userId,doc){
        return true;
    },

    remove: function(userId,doc){
        return true;
    },

    update: function(userId,doc){
        return true;
    }

});

Ciudades.allow({
    insert: function(userId,doc){
        return true;
    },

    remove: function(userId,doc){
        return true;
    },

    update: function(userId,doc){
        return true;
    }

});

Tides.allow({
    insert: function(userId,doc){
        return true;
    },

    remove: function(userId,doc){
        return true;
    },

    update: function(userId,doc){
        return true;
    }

});

Comisionables.allow({
    insert: function(userId,doc){
        return true;
    },

    remove: function(userId,doc){
        return true;
    },

    update: function(userId,doc){
        return true;
    }

});

Llaves.allow({
  insert: function(userId,doc){
      return true;
  },

  remove: function(userId,doc){
      return true;
  },

  update: function(userId,doc){
      return true;
  }

});


Invoices.allow({
  insert: function(userId,doc){
      return true;
  },

  remove: function(userId,doc){
      return true;
  },

  update: function(userId,doc){
      return true;
  }

});

Multas.allow({
  insert: function(userId,doc){
      return true;
  },

  remove: function(userId,doc){
      return true;
  },

  update: function(userId,doc){
      return true;
  }

});
