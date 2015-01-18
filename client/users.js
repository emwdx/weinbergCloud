  if(Meteor.user){
      Meteor.subscribe('reassessments');
      Meteor.subscribe('users');
      Meteor.subscribe('credits');
      Meteor.subscribe('systemVariables');
      Meteor.subscribe('reviewpages');
      Meteor.subscribe('standards');
      Meteor.subscribe('standard-links');
            
  }   
   

Template.allUsers.helpers({
   
userProfiles: Meteor.users.find({},{sort:{"profile.grade":-1,"profile.realName":1}}),
 isEvan: function(){
          
       return (Meteor.user().emails[0].address=='eweinberg@scischina.org');  
          
          
      }
      

    

    
});    
    
Template.allUsers.events({
   
'click .addCredit': function(e){
 
e.preventDefault();
currentUser = Meteor.users.findOne({_id:this._id});
newCreditObject = {
user: currentUser.emails[0].address,
credits:1,
used: 0,
createdOn: new Date()
}


Credits.insert(newCreditObject);
    
},
'click .removeCredit': function(e){
    
e.preventDefault();
currentUser = Meteor.users.findOne({_id:this._id});
currentCredit = Credits.findOne({user:currentUser.emails[0].address});
Credits.remove(currentCredit._id);
    
},
'click .editProfile': function(e){
e.preventDefault();
currentUser = Meteor.users.findOne({_id:this._id});
Session.set("currentlySelectedUser",currentUser.emails[0].address);
Session.set("currentlySelectedID",currentUser._id);
if(currentUser.profile){
$('#profileUserName').val(currentUser.profile.realName);
$('#profileGrade').val(currentUser.profile.grade);
}
else{
    $('#profileUserName').val('');
    $('#profileGrade').val('0');
}
$('#profileEdit').modal('show');
    
}

});

Template.editUserProfile.events({
'click #updateProfile': function(e){
e.preventDefault();
currentUserName = $('#profileUserName').val();
currentUserGrade = $('#profileGrade').val()
var profileObject = {"profile.realName":currentUserName,"profile.grade":currentUserGrade};
var currentlySelectedID = Session.get("currentlySelectedID");
var currentUser = Meteor.users.findOne({_id:currentlySelectedID});

Meteor.users.update({_id:currentUser._id}, {$set:profileObject});
$('#profileEdit').modal('hide');
    
},
'click #profileDelete': function(e){
    
 e.preventDefault();

if(confirm("Are you sure you want to delete this user?")){
var currentlySelectedID = Session.get("currentlySelectedID");
var currentUser = Meteor.users.findOne({_id:currentlySelectedID});    
Meteor.users.remove({_id:currentUser._id});    
$('#profileEdit').modal('hide');
}
    
    
}
    
        
    
});
Template.creditBadge.helpers({
   
numberOfCredits: function(){
     currentUser = Meteor.users.findOne({_id:this._id})
     allCredits = Credits.find({user:currentUser.emails[0].address,used:0}).fetch();
     numOfCredits = allCredits.length;
     return numOfCredits;
    
}
    
});
Template.myCreditsBadge.helpers({
   
numberOfCredits: function(){
     currentUser = Meteor.user();
     allCredits = Credits.find({user:currentUser.emails[0].address,used:0}).fetch();
     numOfCredits = allCredits.length;
     return numOfCredits;
    
}
    
});

Template.editUserProfile.helpers({
    
selectedUser: function(){
    return Session.get("currentlySelectedUser");
},
profileName: function(){
var currentlySelectedUser = Session.get("currentlySelectedID");
var currentUser = Meteor.users.findOne({_id:currentlySelectedUser}); 
if(currentUser.profile){
return Meteor.users.findOne({user:currentUser}).profile.realName;
}
else{
return '';}
    
}
 
}); 