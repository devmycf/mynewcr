Template.hoteles.helpers({
    hoteles: function(){
        return Oficinas.find({"tipo": "Hotel"},{sort:{nombre: 1}});
    },
    getPrincipalEmpresa: function(empresas){
        if(empresas != null){
            return empresas[0].nombre;
        }
    }
});
