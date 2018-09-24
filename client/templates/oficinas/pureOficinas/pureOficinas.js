Template.pureOficinas.helpers({
    pureOficinas: function(){
        return Oficinas.find({"tipo": "Oficina"},{sort:{nombre: 1}});
    },
    getPrincipalEmpresa: function(empresas){
        if(empresas != null){
            return empresas[0].nombre;
        }
    }
});
