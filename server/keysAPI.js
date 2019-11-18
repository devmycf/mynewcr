Meteor.methods({
    makeTheKeys: function(theId, theName) {
        var numKeys = 3;
        for(var i = 0; i<numKeys; i++){
          Llaves.insert({
            idFlota: theId,
            nameFlota: theName,
            ordinalInFlota: (i+1),
            locationName: "-",
            locationId: "-"
          });
        }
      },
    
    updateKeyLoc: function(theid, theLoc, theLocN){
        Llaves.update({'_id': theid}, {$set: {'locationName': theLocN, 'locationId': theLoc}});
    },
})