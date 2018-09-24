Template.estaciones.helpers({
    estaciones: function(){
        return Oficinas.find({"tipo": "Estacion"},{sort:{nombre: 1}});
    },
    getPrincipalEmpresa: function(empresas){
        if(empresas != null){
            return empresas[0].nombre;
        }
    }
});
