


 function isAdmin(){

if(Roles.userIsInRoles(this.UserId,'admin')){return true}
else{return false}

 };

  Meteor.startup(function () {
  if(ReviewPages.find().count()==0){

   var users = Meteor.users.find( { "profile.grade": { $in: [ '9', '10' ] } } );
   if(users){
   users.forEach(function(person){
   var page = { userId: person._id,
               author: person.profile.realName,
               submitted: new Date().getTime(),
               standard: '',
               grade: person.profile.grade,
                url:'',
                upvoters: [],
                votes: 0
                };

  ReviewPages.insert(page);
   });
   }

  }

  if(!Meteor.roles.findOne({name: "teacher"}))
                        Roles.createRole("teacher");

        if(!Meteor.roles.findOne({name: "student"}))
                        Roles.createRole("student");


    var emw = Meteor.users.findOne({"emails.0.address":'eweinberg@scischina.org'});
    if(emw){

      Roles.addUsersToRoles(emw._id,'admin');

    }

    // code to run on server at startup
  });

  Meteor.publish('reassessments', function() {
    if(this.userId){
     var currentUser = Meteor.users.findOne({_id:this.userId});
     if(Roles.userIsInRole(this.userId,'admin')){

       return Reassessments.find({schoolYear:"15-16"});

     }
     else{

       return Reassessments.find({schoolYear:"15-16",user:currentUser.emails[0].address});

     }

    }
    else{

      return null};
});

 Meteor.publish('standard-links', function() {

     return Links.find({});

});

Meteor.publish("users", function () {
  var user = Meteor.users.findOne({_id:this.userId});

  if (Roles.userIsInRole(user, ["admin","teacher"])) {

    return Meteor.users.find({}, {fields: {emails: 1, profile: 1, roles: 1,username:1}});
  }

  this.stop();
  return;
});

Meteor.publish('systemVariables',function(){

   if(this.userId){

    return systemVariables.find({});

   }
   else{return null};

});

Meteor.publish('credits', function() {



     if(this.userId){
      var currentUser = Meteor.users.findOne({_id:this.userId});
      if(Roles.userIsInRole(this.userId,['admin','teacher'])){

        return Credits.find({schoolYear:"15-16"});

      }
      else{

        return Credits.find({schoolYear:"15-16",user:currentUser.emails[0].address});


      }
     return Credits.find({schoolYear:"15-16"});
     }
     else{return null};
});

Meteor.publish('reviewpages',function(){

    return ReviewPages.find({});
});

Meteor.publish('weinbergcash',function(){

  return WeinbergCash.find({});

});

Meteor.publish('standards',function(){

  return Standards.find({});

});


Meteor.publish('surveys', function() {



     if(this.userId){
     return Surveys.find({});
     }
     else{return null};
});

Meteor.users.allow({

update:function(userId,doc){


if(Roles.userIsInRole(userId,'admin')){return true}
else{return false};

},
remove:function(userId,doc){

  if(Roles.userIsInRole(userId,'admin')){return true}
  else{return false};

}



});


Credits.allow({

insert: function(userId){


return Roles.userIsInRole(userId,['teacher','admin']);

},
update: function(userId){

return Roles.userIsInRole(userId,['teacher','admin','student']);

},
remove: function(userId){

return Roles.userIsInRole(userId,['teacher','admin','student']);

}

});

Reassessments.allow({

insert: function(userId){


return Roles.userIsInRole(userId,['teacher','admin','student']);

},
update: function(userId){

return Roles.userIsInRole(userId,['teacher','admin','student']);

},
remove: function(userId){

return Roles.userIsInRole(userId,['teacher','admin','student']);

}

});

Links.allow({

insert: function(userId){


return Roles.userIsInRole(userId,['teacher','admin','student']);

},
update: function(userId){

return Roles.userIsInRole(userId,['teacher','admin','student']);

},
remove: function(userId){

return Roles.userIsInRole(userId,['teacher','admin']);

}

});

Standards.allow({

insert: function(userId){


return Roles.userIsInRole(userId,['teacher','admin']);

},
update: function(userId){

return Roles.userIsInRole(userId,['teacher','admin']);

},
remove: function(userId){

return Roles.userIsInRole(userId,['teacher','admin']);

}

});

Meteor.methods({
 giveEMWCash: function(amount){
  if(amount>0){
  var emwAccount = Meteor.users.findOne({'emails.0.address':'eweinberg@scischina.org'});
  Meteor.users.update({_id:emwAccount._id},{$inc:{wbBalance:amount}});
  }
 },

upvote: function(pageId) {
var user = Meteor.user();
// ensure the user is logged in
page = ReviewPages.findOne({_id:pageId});
if(!(_.include(page.upvoters, user._id))){
    ReviewPages.update({_id:pageId}, {
      $addToSet: {upvoters: user._id},
      $inc: {votes: 1}
});
}

},

addStandardServer: function(standard){
var user = Meteor.users.findOne({_id:this.userId});
if(user.emails[0].address=='eweinberg@scischina.org'){
var response = Standards.insert(standard);
if(response){return "success!"}
else{

      throw new Meteor.Error("pants-not-found", "Can't find my pants");
}

}

}
});

Accounts.onCreateUser(function(options, user){
  var role = ['student'];
  user.roles = role
  return user;
});
