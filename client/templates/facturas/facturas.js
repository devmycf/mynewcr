Template.facturas.helpers({
    lastFactura: function(){
        var ultima = HelpersFactura.find({}).fetch();
        if(ultima.length > 0) {
            var ultimaFecha = moment(ultima[0].facFecha).format('YY[20]-MM-DD') + "-" +ultima[0].facTodayNumber;
        } else {
            var ultimaFecha = "Not defined"
        }

        return ultimaFecha;
    },

    nextFactura: function(){
        var ultima = HelpersFactura.find({}).fetch();
        console.log("ultima");
        if(ultima.length > 0) {
            var ultimaFecha = moment(ultima[0].facFecha).format("DD-MM-YYYY");
        } else {
            console.log("gfhd");
            return moment(new Date()).format('YY[20]-MM-DD') + "-" + "0";
        }
        // var ultimaFecha = moment(ultima[0].facFecha).format("DD-MM-YYYY");
        var today = moment(new Date()).format("DD-MM-YYYY");

        if (ultimaFecha == today){
            return moment(ultima[0].facFecha).format('YY[20]-MM-DD') + "-" +(ultima[0].facTodayNumber+1)
        } else {
            return moment(new Date()).format('YY[20]-MM-DD') + "-" + "0";
        }
    }
});

Template.facturas.events({
    "submit form": function(event){
      event.preventDefault();
      console.log('enviado');
      var today = moment(new Date()).format("DD-MM-YYYY");
      var nombre = $('#nombre').val();
      var direccion = $('#direccion').val();
      var direccion2 = $('#direccion-2').val();
      var cif = $('#cif').val();
      var item = $('#item').val();
      var precio = $('#precio').val();
      precio = precio.replace(",", ".");
      var preciosinIVA = parseFloat(parseFloat(precio)/1.21).toFixed(2);
      console.log(precio);
      console.log(preciosinIVA);
      var iva = parseFloat(precio - preciosinIVA).toFixed(2);
      console.log("mi iva");
      console.log(iva);
      var fechapago = $('#fechapago').val();
      var factura = $("#mifactura").html();
      var facNumber = factura.split("-");
      var factNumberReal = facNumber[(facNumber.length)-1];
      console.log(factNumberReal);
      console.log(factura);
      var docDefinition = {
          content: [


                      {
                          image: 'data:image/png;base64,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',
                          width: 120
                      },

              { text: 'Factura - Invoice', style: 'header' },
                      {
                          alignment: 'justify',
                          columns: [
                              {
                                  text: 'Carflet Rent a Car S.L',
                                  style: 'cliente'
                              },

                              {
                                  alignment: 'right',
                                  text: 'Cliente',
                                  style: 'cliente'
                              },

                          ],
                      },

              {
                  alignment: 'justify',
                  columns: [
                      {
                          text: 'Carflet Rent a Car S.L\n C/Canarias 40 local 2 \n 28045 MADRID \n SPAIN \ Tel. (34) 609 36 53 24 \n N.I.F: B-87129219 \n RM Madrid, T-2552, Sec 8°, F68, Hoja M-44527',
                          style: 'address'
                      },

                      {
                          alignment: 'right',
                          text: ''+nombre+'\n'+direccion+'\n'+direccion2+'\n'+cif+'', style: 'address',
                      },

                  ],

                  style: 'columnasInfoCliente'
              },


              {
                  margin: [0,20,0,0],
                  table: {
                      widths: [80, 100],
                      body: [
                          [{ text: 'Fecha', alignment: 'left', style: 'epigrafe' }, { text: today}],
                          [{ text: 'Factura', alignment: 'left', style: 'epigrafe' }, { text: factura}],
                          [{ text: 'Fecha Pago', alignment: 'left', style: 'epigrafe' }, { text: fechapago}],
                        //   [{ text: 'Alquiler de Coche Tipo ''\n Tarifa ''', style: 'tableContent'},{text: 'asd', alignment: 'center', style: 'tableContent'},{text: 'EUR asd', style: 'tableContent'},{text: 'EUR ', style: 'tableContent'},{text: 'EUR ', style: 'tableContent'}],
                          // [{ text: ''+suplementoRecoText+'', style: 'tableContent'},{text: ''+diasSupReco+'', alignment: 'center', style: 'tableContent'},{text: 'EUR '+baseSupReco+'', style: 'tableContent'},{text: 'EUR '+IVASupReco+'', style: 'tableContent'},{text: 'EUR '+TotalSupReco+'', style: 'tableContent'}],
                          // [{ text: ''+suplementoGpsText+'', style: 'tableContent'},{text: ''+diasSupGPS+'', alignment: 'center', style: 'tableContent'},{text: 'EUR '+baseSupGPS+'', style: 'tableContent'},{text: 'EUR '+IVASupGPS+'', style: 'tableContent'},{text: 'EUR '+TotalSupGPS+'', style: 'tableContent'}],
                        //   [{ text: ''+item+'', style: 'tableContent'},{text: ''+precio+'€', alignment: 'center', style: 'tableContent'}],
                        //   [{ text: '', style: 'tableFooter' }, { text: 'EUR das', bold:'true', style: 'tableFooter' }]
                      ]
                  },
                  layout: {
                    hLineWidth: function(i, node) {
                        return (i === 0 || i === node.table.body.length) ? 1 : 1;
                    },
                    vLineWidth: function(i, node) {
                        return (i === 0 || i === node.table.widths.length) ? 1 : 1;
                    },
                    hLineColor: function(i, node) {
                        return (i === 0 || i === node.table.body.length) ? '#ffffff' : '#ffffff';
                    },
                    vLineColor: function(i, node) {
                        return (i === 0 || i === node.table.widths.length) ? '#ffffff' : '#ffffff';
                    },
                    paddingLeft: function(i, node) { return 4; },
                    // paddingRight: function(i, node) { return 4; },
                    // paddingTop: function(i, node) { return 2; },
                    // paddingBottom: function(i, node) { return 2; }
                }
              },

              {
                  margin: [0,20,0,0],
                  table: {
                      widths: ['*', 50],
                      body: [
                          [{ text: 'Items', alignment: 'center', style: 'tableHeader' }, { text: 'Precio', style: 'tableHeader' }],
                        //   [{ text: 'Alquiler de Coche Tipo ''\n Tarifa ''', style: 'tableContent'},{text: 'asd', alignment: 'center', style: 'tableContent'},{text: 'EUR asd', style: 'tableContent'},{text: 'EUR ', style: 'tableContent'},{text: 'EUR ', style: 'tableContent'}],
                          // [{ text: ''+suplementoRecoText+'', style: 'tableContent'},{text: ''+diasSupReco+'', alignment: 'center', style: 'tableContent'},{text: 'EUR '+baseSupReco+'', style: 'tableContent'},{text: 'EUR '+IVASupReco+'', style: 'tableContent'},{text: 'EUR '+TotalSupReco+'', style: 'tableContent'}],
                          // [{ text: ''+suplementoGpsText+'', style: 'tableContent'},{text: ''+diasSupGPS+'', alignment: 'center', style: 'tableContent'},{text: 'EUR '+baseSupGPS+'', style: 'tableContent'},{text: 'EUR '+IVASupGPS+'', style: 'tableContent'},{text: 'EUR '+TotalSupGPS+'', style: 'tableContent'}],
                          [{ text: ''+item+'', style: 'tableContent'},{text: ''+precio+'€', alignment: 'center', style: 'tableContent'}],
                        //   [{ text: '', style: 'tableFooter' }, { text: 'EUR das', bold:'true', style: 'tableFooter' }]
                      ]
                  },
                  layout: {
                    hLineWidth: function(i, node) {
                        return (i === 0 || i === node.table.body.length) ? 1 : 1;
                    },
                    vLineWidth: function(i, node) {
                        return (i === 0 || i === node.table.widths.length) ? 1 : 1;
                    },
                    hLineColor: function(i, node) {
                        return (i === 0 || i === node.table.body.length) ? '#e0e7da' : '#ffffff';
                    },
                    vLineColor: function(i, node) {
                        return (i === 0 || i === node.table.widths.length) ? '#e0e7da' : '#ffffff';
                    },
                    paddingLeft: function(i, node) { return 4; },
                    // paddingRight: function(i, node) { return 4; },
                    // paddingTop: function(i, node) { return 2; },
                    // paddingBottom: function(i, node) { return 2; }
                }
              },

              {
                  margin: [345,20,20,0],
                  alignment: 'right',
                  table: {
                      widths: [100, 50],
                      body: [
                          [{ text: 'Subtotal', alignment: 'left', style: 'tableContent' }, { text: preciosinIVA+'€', style: 'tableContent'}],
                        //   [{ text: 'Alquiler de Coche Tipo ''\n Tarifa ''', style: 'tableContent'},{text: 'asd', alignment: 'center', style: 'tableContent'},{text: 'EUR asd', style: 'tableContent'},{text: 'EUR ', style: 'tableContent'},{text: 'EUR ', style: 'tableContent'}],
                          // [{ text: ''+suplementoRecoText+'', style: 'tableContent'},{text: ''+diasSupReco+'', alignment: 'center', style: 'tableContent'},{text: 'EUR '+baseSupReco+'', style: 'tableContent'},{text: 'EUR '+IVASupReco+'', style: 'tableContent'},{text: 'EUR '+TotalSupReco+'', style: 'tableContent'}],
                          // [{ text: ''+suplementoGpsText+'', style: 'tableContent'},{text: ''+diasSupGPS+'', alignment: 'center', style: 'tableContent'},{text: 'EUR '+baseSupGPS+'', style: 'tableContent'},{text: 'EUR '+IVASupGPS+'', style: 'tableContent'},{text: 'EUR '+TotalSupGPS+'', style: 'tableContent'}],
                          [{ text: 'IVA %', alignment: 'left', style: 'tableContent'},{text: '21%', alignment: 'right', style: 'tableContent'}],
                          [{ text: 'IVA', alignment: 'left', style: 'tableContent'},{text: iva+'€', alignment: 'right', style: 'tableContent'}],
                          [{ text: 'TOTAL', alignment: 'left', style: 'tableFooter', bold: 'true'},{text: ''+precio+'€', alignment: 'right', style: 'tableFooter', bold: 'true'}]
                        //   [{ text: '', style: 'tableFooter' }, { text: 'EUR das', bold:'true', style: 'tableFooter' }]
                      ]
                  },

                  layout: {
                    hLineWidth: function(i, node) {
                        console.log(node);
                        return (i === 0 || i === node.table.body.length) ? 1 : 1;
                    },
                    vLineWidth: function(i, node) {
                        return (i === 0 || i === node.table.widths.length) ? 1 : 1;
                    },
                    hLineColor: function(i, node) {
                        return (i === 0 || i === node.table.body.length) ? '#e0e7da' : '#e0e7da';
                    },
                    vLineColor: function(i, node) {
                        return (i === 0 || i === node.table.widths.length) ? '#e0e7da' : '#e0e7da';
                    },
                    // paddingLeft: function(i, node) { return 4; },
                    // paddingRight: function(i, node) { return 4; },
                    // paddingTop: function(i, node) { return 2; },
                    // paddingBottom: function(i, node) { return 2; }
                }
              },

              {
                  margin: [0,120,0,0],
                  table: {
                      widths: [300],
                      body: [
                          [{ text: 'CONDICIONES Y FORMAS DE PAGO', alignment: 'left', style: 'tableHeader' }],
                        //   [{ text: 'Alquiler de Coche Tipo ''\n Tarifa ''', style: 'tableContent'},{text: 'asd', alignment: 'center', style: 'tableContent'},{text: 'EUR asd', style: 'tableContent'},{text: 'EUR ', style: 'tableContent'},{text: 'EUR ', style: 'tableContent'}],
                          // [{ text: ''+suplementoRecoText+'', style: 'tableContent'},{text: ''+diasSupReco+'', alignment: 'center', style: 'tableContent'},{text: 'EUR '+baseSupReco+'', style: 'tableContent'},{text: 'EUR '+IVASupReco+'', style: 'tableContent'},{text: 'EUR '+TotalSupReco+'', style: 'tableContent'}],
                          // [{ text: ''+suplementoGpsText+'', style: 'tableContent'},{text: ''+diasSupGPS+'', alignment: 'center', style: 'tableContent'},{text: 'EUR '+baseSupGPS+'', style: 'tableContent'},{text: 'EUR '+IVASupGPS+'', style: 'tableContent'},{text: 'EUR '+TotalSupGPS+'', style: 'tableContent'}],
                          [{ text: '1. Por favor añadir en el Concepto el numero de factura y motivo de la transferencia', style: 'tableContent'}],
                          [{ text: '2. Cuenta Bancaria Carflet Rent A Car, S.L.', style: 'tableContent'}],
                          [{ text: 'ES57 0081 2350 6200 0110 9312 / BSAB ESBB', style: 'tableContent'}],
                          [{ text: '3. Pago Con Tarjeta de Credito o Debito.', style: 'epigrafe'}],
                        //   [{ text: '', style: 'tableFooter' }, { text: 'EUR das', bold:'true', style: 'tableFooter' }]
                      ]
                  },
                  layout: {
                    hLineWidth: function(i, node) {
                        return (i === 0 || i === node.table.body.length) ? 1 : 1;
                    },
                    vLineWidth: function(i, node) {
                        return (i === 0 || i === node.table.widths.length) ? 1 : 1;
                    },
                    hLineColor: function(i, node) {
                        return (i === 0 || i === node.table.body.length) ? '#e0e7da' : 'ffffff';
                    },
                    vLineColor: function(i, node) {
                        return (i === 0 || i === node.table.widths.length) ? '#e0e7da' : '#ffffff';
                    },
                    paddingLeft: function(i, node) { return 4; },
                    // paddingRight: function(i, node) { return 4; },
                    // paddingTop: function(i, node) { return 2; },
                    // paddingBottom: function(i, node) { return 2; }
                }
              },

            //   {
            //       margin: [0,300,0,0],
            //       text: [
            //           { text: 'CONTRATO DE ALQUILER: TERMINOS Y CONDICIONES \n ', alignment: 'left', bold:'true', fontSize: 7}
            //       ]
            //   },
/*
              {
                  text: [
                      { text: '1. Su acuerdo con nosotros: \n ', style: 'epigrafeContrato'},
                      { text: 'Cuando usted firma en el ticket del bono de Carflet Rent a Car S.L. del Banco Sabadell acepta los términos y condiciones establecidos en el presente contrato de alquiler (Acuerdo), que consta de las Páginas 1, 2 y 3. Por favor, lea cuidadosamente este Acuerdo. Si hay algo que no entienda, por favor pregunte a cualquier miembro de nuestro personal.\n Nosotros y usted somos las únicas partes de este Acuerdo y usted es responsable de cumplir con todos los términos del presente Acuerdo, aunque otra persona (como una compañía de seguros, un hotel ó una Agencia de Viajes) pueda haber gestionado el alquiler, negociado ciertos términos ó pagado por la totalidad ó parte de la factura de alquiler.\n Le aseguramos que nuestro Vehículo (el Vehículo) es apto para circular y adecuado para el alquiler al inicio del periodo de alquiler.\n Este Acuerdo es el Acuerdo completo entre usted y nosotros respecto del alquiler y no puede ser alterado salvo acuerdo por escrito firmado por usted y nosotros.\n', style: 'contrato'},
                      { text: '2. Periodo de Alquiler: \n ', style: 'epigrafeContrato'},
                      { text: 'Estamos de acuerdo en que puede tener el Vehículo hasta la fecha de devolución indicada en la Página 1. Podemos acordar ampliar el alquiler, pero el periodo de alquiler no puede ser superior a tres meses. Si acordamos ampliar el alquiler, podemos requerirle el pago de un depósito adicional. Con las siguientes condiciones, usted puede optar por devolver el Vehículo antes de la fecha de devolución acordada en la Página 1 en el horario habitual de la oficina y con ello dar por terminado de forma anticipada este Acuerdo (y el período de alquiler se reducirá en consecuencia). Si usted prepaga el coste del alquiler para aprovechar una tarifa con “oferta especial”, acepta que no procederá ningún reembolso por la terminación anticipada, de lo contrario estará obligado a pagar la tarifa estándar por día (así como cualquier otro cargo aplicable mencionado en el presente Acuerdo) para los días o fracción durante el cuál alquiló el ¨Vehículo. Nuestras tarifas estándar cambian con frecuencia, y aparecen publicadas en nuestro sitio web www.carflet.es (Sitio Web). Pueden ser superiores a las tarifas diarias originalmente acordadas con nosotros. Asimismo, el coste medio diario de otros cargos aplicables (como productos de cobertura) para el período de alquiler reducido puede ser mayor. También perderá cualquier beneficio u “oferta especial” (por ejemplo, las tarifas de fin de semana que dependen de la contratación del Vehículo durante un periodo mínimo determinado). Por lo tanto, antes de elegir devolver el vehículo de forma anticipada, debe ponerse en contacto con nosotros para determinar los gastos revisados a pagar. Si usted no desea pagar dichos cargos, usted no tendrá derecho de modificar o dar por terminado el Acuerdo tal como se describe en este apartado, salvo acuerdo específico con nosotros. Cualquier cambio en la fecha de devolución afectará a los cargos mencionados en el párrafo 5, pero salvo acuerdo expreso, la terminación anticipada no afectará a los respectivos derechos y obligaciones de las partes en virtud de este Acuerdo. Cualquier gestión administrativa llevada a cabo por nosotros como resultado de una ampliación del periodo de alquiler acordado (incluyendo sin limitación, cambios en nuestros registros, procesos de facturación, referencias de documentos o fechas) no afectará sus responsabilidades con nosotros, en los términos y condiciones de este Acuerdo.\n\n', style: 'contrato'},
                      { text: '3. Sus responsabilidades: \n ', style: 'epigrafeContrato'},
                      { text: 'a) Debe cuidar el Vehículo y las llaves. Siempre debe cerrar el Vehículo, estacionarlo adecuadamente, de forma segura, y asegurar todas sus partes.\n b) No debe permitir a nadie alterar ni reparar el Vehículo sin nuestro permiso. Si le damos permiso, sólo le haremos un reembolso si usted tiene una factura del trabajo realizado.\n c) Debe inspeccionar el vehículo antes de tomar posesión de él. \n d) Debe dejar de utilizar el vehículo y ponerse en contacto con nosotros, tan pronto sea posible, cuando detecte un fallo en el Vehículo.\n e) Debe devolvernos el Vehículo durante el horario de apertura mostrado en la Página 1. Un miembro de nuestro personal debe ver el vehículo para comprobar que está en buenas condiciones. Si hemos acordado que puede devolver el Vehículo fuera del horario de apertura, usted seguirá siendo el responsable del Vehículo y su estado has que sea inspeccionado de nuevo por un miembro de nuestro personal. \n f) Debe comprobar que no ha dejado ninguna pertenencia personal en el Vehículo antes de devolverlo. \n g) Al firmar la declaración de responsabilidad de la Página 1, reconoce que usted será responsable como si fuera propietario del Vehículo para: \n    - Cualquier sanción impuesta por la infracción del Real Decreto Legislativo 339/1990, o el que se aprueba el Texto Articulado de la Ley sobre Tráfico, Circulación de Vehículos a Motor y Seguridad Vial.\n    - Cualquier sanción impuesta por la infracción de la Ley 8/2004, por el que se aprueba el texto refundido de la Ley sobre Responsabilidad Civil y Seguro en la Circulación de Vehículos a Motor. \n    - Cualquier delito definido por los artículos 379-385 (ambos incluidos) del Código Penal español. \n\n', style: 'contrato'},
                      { text: '4. Uso del Vehículo: \n ', style: 'epigrafeContrato'},
                      { text: 'El vehículo no debe utilizarse: \n a) Por cualquier persona que no sea usted o cualquier otro conductor indicado en el contrato.\nb) Por cualquier persona sin un permiso de conducir válido para la clase ó uso del Vehículo alquilado, o cualquier persona menos de 21 años. \nc) Para el transporte de viajeros por cuenta ajena o cualquier otra actividad que implique subarriendo. \nd) Para cualquier propósito ilegal o para causar deliberadamente lesiones, pérdidas o daños a la propiedad o a las personas.\n e) En carreras, como coche de seguridad, pruebas de fiabilidad del vehículo, velocidad o para enseñar a alguien a conducir. \n f) Bajo la influencia de alcohol o drogas.\n g) Para desprecintar o manipular el cuentakilómetros, debiendo comunicarnos inmediatamente cualquier avería en el mismo.\n h) Para llevar más pasajeros que cinturones de seguridad o transportar niños sin los sistemas de retención legalmente requeridos. \n i) Si el Vehículo es un vehículo comercial, para transportar mercancías con peso superior al máximo autorizado para el vehículo, ni mercancías deficientemente distribuidas o mal sujetas, ni para efectuar servicios de carga fraccionada,entendiéndose por tal las expediciones en que haya más de un solo remitente y/o más de un solo consignatario.\n j) Para salir fuera de la Unión Europea, realizar traslados a islas, entre islas, ni a Ceuta y Melilla a menos que se haya obtenido previamente de nuestra parte autorización escrita.\n k) Para empujar o remolcar otros vehículos o remolques.\n l) Fuera de la red vial nacional o vías pavimentadas. \n m) Para transportar pescado, carne, frutas, verduras, animales vivos o muertos, cualquier tipo de liquido envasado o sustancias peligrosas o nocivas. \n n) De forma temeraria. \n o) En cualquier parte de un aeródromo, pista de aterrizaje, aeropuerto o instalación militar con zona de despegue, aterrizaje, traslado o aparcamiento de aviones y dispositivos aéreos, incluidas las carreteras asociadas al servicio, áreas de recarga de combustible, áreas de estacionamiento de equipo de tierra, plataformas, áreas de mantenimiento y hangares, salvo que el Vehículo posea los correspondientes permisos oficiales y autorización por nuestra parte.\n\n', style: 'contrato'},
                      { text: '5. Pagos: \n ', style: 'epigrafeContrato'},
                      { text: 'a) Para todos los conceptos diarios designados como “/ día” en la Página 1: \n - Si la Página 1 indica “día = periodo de 24 horas”, un día es cada período de 24 horas consecutivas. \n - Si la Página 1 indica “dia = día natural”, un dia es cada día completo de calendario o fracción.\n - Todos los cargos son por un mínimo de 1 día. \n b) Para todos los conceptos designados como “/ semana” o “ / mes” en la Página1:\n - Si la Página 1 indica “/ semana” una semana es 7 días consecutivos a partir de la hora de inicio del alquiler.\n - Si la Página 1 indica “/ mes”, un mes es 30 días consecutivos a partir de la hora de inicio del alquiler.\n c) Usted acepta pagarnos los siguiente cargos como se muestran en la Página 1:\n - Los cargos por el tiempo del periodo de alquiler.\n - El cargo de kilometraje por todos los kilómetros que excedan de los kilómetros gratuitos indicados en la Página 3, permitidos en el periodo de alquiler.\n -  Cargo por Salida al extranjero, si autorizamos la salida del vehículo de España.\n Los cargos por cualquier Accesorio opcional (tales como el dispositivo GPS,asientos para niños, bacas u otros accesorios), servicios o productos opcionales que usted acepta, incluyendo CDW o EP.\n - Un cargo de repostaje de combustible según la tarifa indicada en las páginas oficiales del gobierno de España, basado en el consumo, por la diferencia de combustible si el Vehículo es devuelto con menos combustible que cuando se alquiló. No recibirá ningún reembolso si el Vehículo es devuelto con más combustible que cuando lo alquiló.\n d) Obligaciones adicionales.- Usted deberá pagarnos cuando lo solicitemos:\n - El importe de toda clase de multas, gastos judiciales, derivados de aparcamientos indebidos, tasas de congestión, infracciones de Tráfico y normas de obligado cumplimiento que sean dirigidas contra el Vehículo, usted, cualquier otro conductor autorizado o nosotros mismos salvo que haya sida causado por culpa nuestra.\n - Un cargo administrativo razonable por la gestión de cualquier multa o denuncia contra el Vehículo, usted o nosotros durante el periodo de alquiler, salvo que haya sido causado por nuestra culpa.\n - Los costes incurridos, incluyendo los honorarios razonables de abogados permitidos por ley, por la gestión del cobro de pagos adeudados por usted bajo este Acuerdo.\n - Un cargo razonable de recogida si el Vehículo no se devuelve en la oficina de alquiler original indicada en la Página 1.\n e) En el caso de daños, pérdida o robo del vehículo o cualquier parte o accesorios, deberá pagarnos, cuando lo solicitemos, los daños y cargos previstos en nuestro contrato salvo que haya sido causado por nuestra culpa. Solo nosotros tenemos el derecho y la responsabilidad de reparar el Vehículo y, salvo que ya haya pagado conforme a nuestra Tabla de Cargos de Reparación, trataremos de reparar y gestionar la reclamación al seguro lo más rápido posible. Su responsabilidad por daños, pérdida o robo del Vehículo puede ser reducida por la compara de la Exención Parcial de Daños (CDW) o Exención de Franquicia (EP).\n f) Tendrá que pagar el IVA y el resto de los impuestos aplicables (si los hay) a cualquier de los cargos mencionados en este párrafo 5.\n g) Usted es responsable de todos los cargos, incluso si usted ha pedido a otra persona que sea responsable de ellos o hemos facturado a un tercero. Usted acepta que calculemos y cobremos los cargos finales a su tarjeta de crédito o débito, si esa es la forma de depósito o garantía que se ha utilizado, como se muestra en la Página 1. Todos los cargos están sujetos a inspección final. Haremos todo lo posible para comunicarle, previamente al cobro en su tarjeta de crédito y/o débito, los cargos finales generados después de la finalización del Acuerdo.', style: 'contrato'},
                  ]
              },
*/
              {
                  alignment: 'justify',
                  margin: [0,80,0,0],
                  columns: [
                      {
                          text: 'Carflet Rent a Car S.L',
                          fontSize: 8
                      },

                      {
                          text: 'info@carflet.es',
                          fontSize: 8,
                          alignment: 'center'
                      },

                      {
                          text: 'www.carflet.com',
                          fontSize: 8,
                          alignment: 'right'
                      },

                  ],
              },
          ],

          styles: {
            tableFooter: {
              fillColor: '#f5f5f5',
              fontSize: 12
            },
            tableContent: {
              fontSize: 10
            },
            tableHeader: {
              fillColor: '#afcce2',
              fontSize: 12,
              color: '#1c1c1c'
            },

            epigrafeContrato: {
                bold: true,
                alignment: 'left',
                fontSize: 7
            },

            contrato: {
              fontSize: 6.5,
              alignment: 'justify',
            },
              header: {
                  fontSize: 14,
                  alignment: 'center'
              },

              address: {
                  fontSize: 10
              },

              cliente: {
                  fontSize: 14
              },

              columnasInfoCliente: {
                  margin: [0,20,0,25]
              },

              headerColumnasInfo: {
                  fontSize: 12,
                  bold: true,
              },

              contentColumnasInfo: {
                  margin: [0,0,0,35],
                  fontSize: 11
              },

              epigrafe: {
                  bold: true,
                  alignment: 'left',
              }

          }
      };

      // Start the pdf-generation process
      pdfMake.createPdf(docDefinition).download(factura);
  },

  'click .save-factura': function(event){
      event.preventDefault();
      console.log('conductor');
      var factura = $("#mifactura").html();
      var facNumber = factura.split("-");

      var factNumberReal = parseInt(facNumber[(facNumber.length)-1]);

      Meteor.call("insertFactura", new Date(), factNumberReal, function(error, result){
        if(error){
            console.log(error);
            FlashMessages.sendError("No se pudo guardar el numero de la factura", { autoHide: true, hideDelay: 3000 });
        } else {
            FlashMessages.sendSuccess("Siguiente numero de factura actualizado", { autoHide: true, hideDelay: 3000 });
        }
      });

      var nameComi = $(".facturas #nombre").val();
      var precio = $(".facturas #precio").val();
      var fechapago = $(".facturas #fechapago").val();
      var dirComi = $(".facturas #direccion").val();
      var dirComi2 = $(".facturas #direccion-2").val();
      var cifComi = $(".facturas #cif").val();
      var facCode =  $(".facturas #mifactura").html();

      Meteor.call("insertFacturaManagement", new Date(), facCode, false, "", nameComi, dirComi, dirComi2, cifComi, precio, fechapago, function(error, result){
        if(error){
            console.log(error);
            FlashMessages.sendError("No se pudo guardar la factura", { autoHide: true, hideDelay: 3000 });
        } else {
            FlashMessages.sendSuccess("Factura guardada", { autoHide: true, hideDelay: 3000 });
        }
      });
  }

});
