Responses = new Meteor.Collection('responses')
Standards = new Meteor.Collection('standards')
Reassessments = new Meteor.Collection('reassessments')
Credits = new Meteor.Collection('credits');
WeinbergCash = new Meteor.Collection('weinbergcash');
systemVariables = new Meteor.Collection('systemVariables');
ReviewPages = new Meteor.Collection('reviewpages');

var getFiveDays = function(){
      
      
   today = new Date();
  
   days = [];
   
   j=0;
   while(days.length<=5){
       
       
    currentDay = new Date(today.getTime() + j*(24 * 60 * 60 * 1000));
    
    if(currentDay.getDay()==0|currentDay.getDay()==6){
    
    
    j++;
        
    }
    else{
    
        days.push(currentDay.toDateString());
        j++;
            
    }
           
   }
   var daysObject = {a:days[0],b:days[1],c:days[2],d:days[3],e:days[4],f:days[5]} 
   
   return daysObject;
      
      
  }

if (Meteor.isClient) {
 
  if(Meteor.user){
      Meteor.subscribe('reassessments');
      Meteor.subscribe('users');
      Meteor.subscribe('credits');
      Meteor.subscribe('systemVariables');
      Meteor.subscribe('reviewpages');
            
  }   
    
 
 Accounts.ui.config({ passwordSignupFields: 'EMAIL_ONLY'
 });
  
  Router.configure({ layoutTemplate: 'mainContent'  });
    
  Router.map(function() {
      
      this.route('defaultPage', {path: '/'});
      this.route('myReassessments', {path: '/myReassessments/'});
      this.route('showNextRetakes', {path: '/retakes/'});
      this.route('reassessEdit', {path: '/edit/'});
      this.route('allUsers', {path: '/allUsers/'});
      this.route('gamesOfChance',{path:'/games/'});
      this.route('allWBCTotals',{path:'/wbTotals/'});
      this.route('setAnnouncement',{path:'setAnnouncement'});
      this.route('reviewpages',{path:'/review/'});
      
      
  });
  
  Session.set('currentDay',$('#selectDate').val());
  Session.set("addSurveyNumberOfQuestions",1);
  
  Template.mainContent.helpers({
  

  isEvan: function(){
  return (Session.get('isEvan')=='true');
  },
  numOfReassessments: function(){
      
   return Reassessments.find({completed:'true'}).count();
      
  },
  myNumOfReassessments: function(){
   return Reassessments.find({completed:'true',user:Meteor.user().emails[0].address}).count();
      
  }
  
  
  });
  
 
  
  Template.studentOptionsBar.helpers({
      
      isEvan: function(){
          
       return (Meteor.user().emails[0].address=='eweinberg@scischina.org');  
          
          
      }
      
      
  });
    
  Template.reassessSignUp.helpers({
      
  daysObject: getFiveDays,
  isWeekend: function(){
         today = new Date();
         return (today.getDay()==0|today.getDay()==6);
         
    },
  hasEnoughCredits: function(){
     currentUser = Meteor.user()
     allCredits = Credits.find({user:currentUser.emails[0].address,used:0}).fetch();
     numOfCredits = allCredits.length;
     return (numOfCredits>0)
    
   },
      isGrade9:function(){
        
     var is9 = (Meteor.user().profile.grade=='9');
     var isEvan = (Meteor.user().emails[0].address=='eweinberg@scischina.org')
     
     return (is9|isEvan);
        
    }
   
      
  });
    
 
  Template.reassessSignUp.events({
      
      
 'click #signUpRetakes':function(event){
     
  event.preventDefault();
  
 var newRetake = {
                course: $('body').find('[name=course]').val(),
				unit: $('body').find('[name=unit]').val(),
				standard: $('body').find('[name=standard]').val(),
				time: $('body').find('[name=time]').val(),
				day: $('body').find('[name=date]').val(),
				completed: 'false',
				user: Meteor.user().emails[0].address
               

 }
 console.log(newRetake);
 currentUser = Meteor.user();
 currentCredit = Credits.findOne({user:currentUser.emails[0].address, used:0});
 
 Credits.update({_id:currentCredit._id},{$set:{used:1}});   
 Reassessments.insert(newRetake);
 
 $('#reassessSignUp').modal('hide');
     
 }
      
  });
    
Template.reassessEdit.helpers({
    
    daysObject: getFiveDays,
    currentDate: function(){
        
    var currentReassessmentID = Session.get('currentReassessmentID');
    var currentReassessment = Reassessments.findOne({_id:currentReassessmentID});
    if(currentReassessment){
    return currentReassessment.day;
    }
        else{return null;}
        
        
        
    },
    isWeekend: function(){
         today = new Date();
         return (today.getDay()==0|today.getDay()==6);
         
    },
    isGrade9:function(){
        
     if(Meteor.user().profile){
     var is9 = (Meteor.user().profile.grade=='9');
     var isEvan = (Meteor.user().emails[0].address=='eweinberg@scischina.org')
     }
     if(is9){
     return (is9|isEvan);
     }
     else{ return false}
    }
      
    
});
    
Template.reassessEdit.events({
    
   'click #updateReassessment': function(e){
    e.preventDefault();
    updateReassessmentObject = {
    course:$('#reassessEdit').find('[name=course]').val(),
	unit: $('#reassessEdit').find('[name=unit]').val(),
	standard:$('#reassessEdit').find('[name=standard]').val(),
	time: $('#reassessEdit').find('[name=time]').val(),
	day: $('#reassessEdit').find('[name=date]').val(),
    }
    Reassessments.update({_id:Session.get('currentReassessmentID')},{$set:updateReassessmentObject});
    $('#reassessEdit').modal('hide');
       
   }
    
    
});
    
Template.myReassessments.helpers({
    
reassessments: function(){
    
    return Reassessments.find({user:Meteor.user().emails[0].address,completed:'false'});
    
}

    
    
});
    
Template.myReassessments.events({
    
    'click .cancelReassessment': function(e){
    e.preventDefault(); 
    currentUser = Meteor.user();
    if(currentUser.emails[0].address=='eweinberg@scischina.org'){
    currentCredit = Credits.findOne({user:this.user, used:1});    
    Credits.update({_id:currentCredit._id},{$set:{used:0}});      
    }
    else{
    currentCredit = Credits.findOne({user:currentUser.emails[0].address, used:1});
    Credits.update({_id:currentCredit._id},{$set:{used:0}});   
  
    
    }
     Reassessments.remove({_id:this._id});
        
    },
    'click .editReassessment': function(e){
     e.preventDefault();
     $('#reassessEdit').find('[name=course]').val(this.course)
	 $('#reassessEdit').find('[name=unit]').val(this.unit)
	 $('#reassessEdit').find('[name=standard]').val(this.standard)
	 $('#reassessEdit').find('[name=time]').val(this.time)
	 $('#reassessEdit').find('[name=date]').val(this.day)
	 Session.set('currentReassessmentDay',this.day);
     Session.set('currentReassessmentID',this._id);
    $('#reassessEdit').modal('show');
        
    }
    
    
});
    


    
Template.showNextRetakes.helpers({
        reassessments: function(){
            
         return Reassessments.find({day: Session.get('currentDay'),completed:'false'},{sort:{time: 1, course: -1}});
            
        },
        daysObject:getFiveDays
    
    
});

Template.showNextRetakes.events({
    
    'change #selectDate':function(e){
    Session.set('currentDay',$('#selectDate').val());
        
    },
    'click .completeReassessment': function(e){
    e.preventDefault();    
  
    Reassessments.update({_id:this._id},{$set:{completed:'true'}});
        
        
    },
    'click .cancelReassessment': function(e){
    e.preventDefault();
    currentUser = Meteor.user();
    currentCredit = Credits.findOne({user:this.user, used:1});
    Credits.update({_id:currentCredit._id},{$set:{used:0}});   
  
    Reassessments.remove({_id:this._id});
        
        
    }
    
    
});

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

Template.loggingIn.helpers({
    
isLoggingIn: Meteor.loggingIn
    
});

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

Template.announcements.helpers({
   
    currentAnnouncement: function(){
        
     var announcement = systemVariables.findOne({name:'currentAnnouncement'});
     if(announcement){
     return announcement.value;
     }
    else{return null};
    }
    
});
Template.setAnnouncement.events({
    
   'click #submitAnnouncementButton':function(e){
       
    e.preventDefault();
    
    var announcementText = $('#announcementText').val();
    announcementObject = {name:'currentAnnouncement',value:announcementText}
    var announcementVariable = systemVariables.findOne({name:'currentAnnouncement'})
    if(announcementVariable){
     
        systemVariables.update({_id:announcementVariable._id},{$set:{value:announcementText}});
        
    }
    else{
    systemVariables.insert(announcementObject);
    }
   }
    
});

Template.reviewpages.helpers({
    
    reviewpage: function(){
        
     var reviewpages = ReviewPages.find({},{sort:{standard:-1}});
     return reviewpages;
        
    },
    shouldShow: function(){
        
     return (this.url!='')&&(this.grade==Meteor.user().profile.grade);   
        
    },
    myValue: function(){
        
     var myPage = ReviewPages.findOne({userId:Meteor.user()._id});
     if(myPage){
     return myPage.standard;
     }
        else{return null}
        
    },
    myPage: function(){
        
     var myPage = ReviewPages.findOne({userId:Meteor.user()._id});
     if(myPage){
     return myPage.url;
     }
    else{return null}
    },
    myCode: function(){
     var myPage = ReviewPages.findOne({userId:Meteor.user()._id});    
     if(myPage){
     return myPage._id;   
     }
        
    }
        
        
    
    
    
});
    
Template.reviewpages.events({
    
   'click #submitReviewPage': function(e){
    e.preventDefault();
    var url = $('#reviewURL').val();
    var standard = parseFloat($('#reviewStandardText').val());
    var myPage = ReviewPages.findOne({userId:Meteor.user()._id})
    ReviewPages.update({_id:myPage._id},{$set:{standard:standard,url:url}});
       
       
   },
    
    'click .upvote': function(e) {
        e.preventDefault();
        page = ReviewPages.findOne({_id:this._id});
        var weinbergApproved = (_.include(page.upvoters, "iFWh2dj9kp5JBtmve")||(Meteor.user().emails[0].address=='eweinberg@scischina.org'))
        if(weinbergApproved){
        var verified = prompt('Please enter the code from the webpage');
        if(verified==this._id){
        
        Meteor.call('upvote', this._id); 
        }
        
        }
        else{ alert("Mr. Weinberg hasn't approved this page yet. Ask the author of the post for details.");}
    }
});
Template.postItem.helpers({
    
    
    hasVoted: function(){
        
     var user = Meteor.user();
     page = ReviewPages.findOne({_id:this._id});
     if(_.include(page.upvoters, user._id)){
     return true;
           }
      else{  return false;}
        
        
    },
    weinbergApproved: function(){
    page = ReviewPages.findOne({_id:this._id});
     if(_.include(page.upvoters, "iFWh2dj9kp5JBtmve")){
     return true;
           }
      else{  return false;}
        
        
    },
    isWeinberg: function(){
        
      return (Meteor.user().emails[0].address=='eweinberg@scischina.org');     
        
    }
    
});

  
    
}

if (Meteor.isServer) {
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
      
  
    // code to run on server at startup
  });
  
  Meteor.publish('reassessments', function() { 

      if(this.userId){
     return Reassessments.find({});
     }
     else{return null};
});
    
Meteor.publish('users', function() { 
     
     
     
     if(this.userId){
     return Meteor.users.find({});
     }
     else{return null};
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

Meteor.publish('surveys', function() { 
     
     
     
     if(this.userId){
     return Surveys.find({});
     }
     else{return null};
});    

Meteor.users.allow({
    
  update: function(){
      return true;
      
      
      
  },
  remove: function(){
      
  return (Meteor.user().emails[0].address=='eweinberg@scischina.org');      
      
  }
    
})

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
    
}       
    
});

}
