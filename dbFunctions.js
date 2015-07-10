/*

db.users.find({wbBalance:{$lt:100}}).forEach(function(user){
var initialAmount = 100;
print(user.profile.realName);

db.weinbergcash.find({user:user.profile.realName}).sort({time:1}).forEach(function(result){
if(result.payoff=='2x'){
if(result.result>0){
initialAmount= initialAmount + 0.95*parseFloat(result.result);
}
else{initialAmount = initialAmount + result.result;}
}
else if(result.payoff=='3x'){
if(result.result>0){
initialAmount= initialAmount + 0.98*parseFloat(result.result);
}
else{ initialAmount = initialAmount + result.result;}
}
else{
initialAmount+=parseFloat(result.result);
}
print(initialAmount)})});

*/

/*

db.users.find({"profile.grade":'12'}).forEach(function(student){

print(student.profile.realName + ';'+db.reassessments.find({user:student.emails[0].address,completed:'true'}).count())

})

*/

/*

Standards.find().forEach(function(standard){

var currentCourse = standard.course;
var newName = currentCourse.replace(" ","");
Standards.update({_id:standard._id},{$set:{course:newName}});

});

for(var i = 5;i<=8;i++){
for(var j = 1;j<=5;j++){
title = "Title " + i + "."+ j;
description = "Description " + i + "-"+ j;
user = Meteor.user();
unit = i.toString();
standard = j.toString();
Standards.insert({course:"IBMATH",unit:unit,standard:standard,title:title,description:description})
}
}

*/