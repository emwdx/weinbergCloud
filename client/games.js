Template.gamesOfChance.helpers({
    
numOfWB: function(){
 if(Meteor.user().wbBalance){   
 return parseFloat(Meteor.user().wbBalance).toFixed(2);   
 }
else{
 return null;   
    
}
}
    
})

Template.gamesOfChance.events({
    
'click #bet2x':function(e){
 e.preventDefault();
 fee = 0.05;
 var currentUser = Meteor.user();
 var currentBalance = currentUser.wbBalance;
 var bet = parseFloat($('#myBet').val());
 if(bet>0&&(bet<currentBalance)&&currentBalance>0){
 var choice = Random.choice([1,0]);
 
 var result = 0;
 if(choice==1){
  result = 2*bet;
      
 }
else{
 result = 0;
}
var newBalance = currentUser.wbBalance - bet +(1-fee)*result;
 Meteor.call('giveEMWCash',fee*result);
 Meteor.users.update({_id:currentUser._id},{$set:{wbBalance:newBalance}});
 var transactionObject = {
     user: currentUser.profile.realName,
     bet:bet,
     payoff:'2x',
     result:(result-bet),
     time: new Date()
 
 };

WeinbergCash.insert(transactionObject);
 }
},
'click #bet3x':function(e){
 e.preventDefault();
 fee = 0.02;
 var currentUser = Meteor.user();
 var currentBalance = currentUser.wbBalance;
 var bet = parseFloat($('#myBet').val());
 if(bet>0&&(bet<currentBalance)&&currentBalance>0){
 var choice = Random.choice([1,1,1,0,0,0,0,0,0,0]);
 
 var result = 0;
 if(choice==1){
  result = 3*bet;
      
 }
else{
 result = 0;
}
var newBalance = currentUser.wbBalance - bet + (1-fee)*result;
  Meteor.call('giveEMWCash',fee*result);
 Meteor.users.update({_id:currentUser._id},{$set:{wbBalance:newBalance}});
 var transactionObject = {
     user: currentUser.profile.realName,
     bet:bet,
     payoff:'3x',
     result:(result-bet),
     time: new Date()
 
 };

WeinbergCash.insert(transactionObject);
 }
},
'click #bet4x':function(e){
 fee = 0;
 e.preventDefault();
 var currentUser = Meteor.user();
 var currentBalance = currentUser.wbBalance;
 var bet = parseFloat($('#myBet').val());
 if(bet>0&&(bet<currentBalance)&&currentBalance>0){
 var choice = Random.choice([1,0,0,0]);
 
 var result = 0;
 if(choice==1){
  result = 4*bet;
      
 }
else{
 result = 0;
}
var newBalance = currentUser.wbBalance - bet +(1-fee)*result;
 Meteor.call('giveEMWCash',fee*result);
 Meteor.users.update({_id:currentUser._id},{$set:{wbBalance:newBalance}});
 var transactionObject = {
     user: currentUser.profile.realName,
     bet:bet,
     payoff:'4x',
     result:(result-bet),
     time: new Date()
 
 };

WeinbergCash.insert(transactionObject);
 }
}
    
    
});
Template.allWBCTotals.helpers({
   
WBProfiles: Meteor.users.find({},{sort:{wbBalance:-1}}),
numOfWB: function(){
 return parseFloat(this.wbBalance).toFixed(2);    
}
  

    
});  