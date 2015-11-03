UI.registerHelper('isAdmin',function(){

return (Roles.userIsInRole(Meteor.user()._id,'admin'));

});

UI.registerHelper('isTeacher',function(){

return (Roles.userIsInRole(Meteor.user()._id,['admin','teacher']));

});


UI.registerHelper("selectedIf",function(value1,value2){
  return (value1==value2)?"selected":"";
});

UI.registerHelper("isEqual",function(value1,value2){
  return (value1==value2);
});



getNames = function(coll,prop){

  var names = [];
  namesFound = coll.find();
  namesFound.forEach(function(e){
  if(!_.contains(names,e[prop])){
    names.push(e[prop]);

  }

});

return names.sort();

}

UI.registerHelper('shortenDate',function(date){

var dateArray = new Date(date).toDateString().split(" ");
return (dateArray[1]+ ' ' + dateArray[2])


})

UI.registerHelper('getName',function(user){

return Meteor.users.findOne({"emails.0.address":user}).profile.realName;

})

UI.registerHelper('getDate',function(date){

return date.toISOString().split('T')[0];

})

UI.registerHelper('getUsername',function(userID){

return Meteor.users.findOne({_id:userID}).profile.realName;

})
