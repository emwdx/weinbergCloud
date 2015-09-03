 function isAdmin(){

if(Roles.userIsInRoles(this.UserId,'admin')){return true}
else{return false}

 }

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


    var emw = Meteor.users.findOne({"emails.0.address":'eweinberg@scischina.org'});
    if(emw){

      Roles.addUsersToRoles(emw._id,'admin');

    }

    // code to run on server at startup
  });

  Meteor.publish('reassessments', function() {

      if(this.userId){
     return Reassessments.find({});
     }
     else{return null};
});
 Meteor.publish('standard-links', function() {

     return Links.find({});

});

Meteor.publish('users', function() {


     var currUser = Meteor.users.findOne({_id:this.userId});
     if(Roles.userIsInRole(this.userId,'admin')){
     return Meteor.users.find({});
     }
     else{return Meteor.users.find({_id:this.userId})};
});

Meteor.publish('systemVariables',function(){

   if(this.userId){

    return systemVariables.find({});

   }
   else{return null};

});

Meteor.publish('credits', function() {



     if(this.userId){
     return Credits.find({});
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


if(Roles.userIsInRole(this.UserId,'admin')){return true}
else{return false};

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
