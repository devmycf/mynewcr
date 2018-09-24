Template.aeropuertos.helpers({
    aeropuertos: function(){
        return Oficinas.find({"tipo": "Aeropuerto"},{sort:{nombre: 1}});
    },
    getPrincipalEmpresa: function(empresas){
        if(empresas != null){
            return empresas[0].nombre;
        }
    }
});
