Meteor.methods({
    pushMatricula: function(myid, newM){
        Bookings.update(myid, {
           $set: {matribooking: newM},
        });
  },
})