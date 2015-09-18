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
