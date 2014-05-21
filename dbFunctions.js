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