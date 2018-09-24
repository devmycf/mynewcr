Template.allOficinas.helpers({
    allOficinas: function(){
        return Oficinas.find({},{sort:{nombre: 1}});
    },
    getPrincipalEmpresa: function(empresas){
        if(empresas != null){
            return empresas[0].nombre;
        }
    }
});
