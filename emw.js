Responses = new Meteor.Collection('responses')
Standards = new Meteor.Collection('standards')
Reassessments = new Meteor.Collection('reassessments')
Credits = new Meteor.Collection('credits');


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
      
      
  });
  
  Session.set('currentDay',$('#selectDate').val());
  
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
 currentUser = Meteor.user();
 currentCredit = Credits.findOne({user:currentUser.emails[0].address, used:0});
 
 Credits.update({_id:currentCredit._id},{$set:{used:1}});   
 Reassessments.insert(newRetake);
 
 $('#reassessSignUp').modal('hide');
     
 }
      
  });
    
Template.reassessEdit.helpers({
    
    daysObject: getFiveDays,
    currentDate: Session.get('currentReassessmentDay'),
    isWeekend: function(){
         today = new Date();
         return (today.getDay()==0|today.getDay()==6);
         
    },
    isGrade9:function(){
        
     var is9 = (Meteor.user().profile.grade=='9');
     var isEvan = (Meteor.user().emails[0].address=='eweinberg@scischina.org')
     
     return (is9|isEvan);
        
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
    currentCredit = Credits.findOne({user:currentUser.emails[0].address, used:1});
    Credits.update({_id:currentCredit._id},{$set:{used:0}});   
  
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
    currentCredit = Credits.findOne({user:currentUser.emails[0].address, used:1});
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
used: 0
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


    
}

if (Meteor.isServer) {
  Meteor.startup(function () {
  
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

Meteor.publish('credits', function() { 
     
     
     
     if(this.userId){
     return Credits.find({});
     }
     else{return null};
}); 
    
Meteor.users.allow({
    
  update: function(){
      return true;
      
      
      
  }
    
})
}
