
Responses = new Meteor.Collection('responses')
Standards = new Meteor.Collection('standards')
Reassessments = new Meteor.Collection('reassessments')
Credits = new Meteor.Collection('credits');
WeinbergCash = new Meteor.Collection('weinbergcash');
systemVariables = new Meteor.Collection('systemVariables');
ReviewPages = new Meteor.Collection('reviewpages');
<<<<<<< HEAD
Surveys = new Meteor.Collection('surveys');
=======
Links = new Meteor.Collection('standard-links');
>>>>>>> development

UI.registerHelper('isAdmin',function(){

return (Meteor.user().emails[0].address=='eweinberg@scischina.org');    
    
});

if (Meteor.isClient) {
 

 
 Accounts.ui.config({ passwordSignupFields: 'EMAIL_ONLY'
 });
  
<<<<<<< HEAD
  Router.configure({ layoutTemplate: 'mainContent'  });
    
  Router.map(function() {
      
      this.route('defaultPage', {path: '/'});
      this.route('myReassessments', {path: '/myReassessments/'});
      this.route('showNextRetakes', {path: '/retakes/'});
      this.route('reassessEdit', {path: '/edit/'});
      this.route('allUsers', {path: '/allUsers/'});

      this.route('currentSurvey',{path:'/survey/calcEOY/'});
      this.route('addSurvey',{path:'/addSurvey/'});
      this.route('showSurvey',{path:'/survey/:alias/',
                              data: function(){
                                  var currentSurvey =  Surveys.findOne({alias:this.params.alias});
                                  return currentSurvey;},
                              waitOn: function(){return Meteor.subscribe('surveys',{limit:this.params.alias})}});

      this.route('gamesOfChance',{path:'/games/'});
      this.route('allWBCTotals',{path:'/wbTotals/'});
      this.route('setAnnouncement',{path:'setAnnouncement'});
      this.route('reviewpages',{path:'/review/'});

      
      
  });
  
  Session.set('currentDay',$('#selectDate').val());
  Session.set("addSurveyNumberOfQuestions",1);
=======
 
  today = new Date();
  currentDay = today.toDateString();
  
  Session.set('currentDay',currentDay);
  Session.set("addSurveyNumberOfQuestions",1);
  Session.set("currentlySelectedStandard","");
>>>>>>> development
  
  Template.mainContent.helpers({
  

  isEvan: function(){
  return (Session.get('isEvan')=='true');
  },
  numOfReassessments: function(){
      
   return Reassessments.find({completed:'true'}).count();
      
  },
  myNumOfReassessments: function(){
   return Reassessments.find({completed:'true',user:Meteor.user().emails[0].address}).count();
      
  },
  connectionStatus:function(){
  return Meteor.status().status;   
  },
  connectionClass:function(){
  if(Meteor.status().status =='connected'){
      return "color:limegreen"}
  else if(Meteor.status().status=='connecting'){
       return "color:gray";}
  else{
        return "color:red";   
  }
  }
      
  });
  
 
  
  Template.studentOptionsBar.helpers({
      
      isEvan: function(){
          
       return (Meteor.user().emails[0].address=='eweinberg@scischina.org');  
          
          
      },
      connectionStatus:function(){
  return Meteor.status().status;   
  },
  connectionClass:function(){
  if(Meteor.status().status =='connected'){
      return "color:limegreen"}
  else if(Meteor.status().status=='connecting'){
       return "color:gray";}
  else{
        return "color:red";   
  }
  }
      
      
  });
    
  
   

Template.loggingIn.helpers({
    
isLoggingIn: Meteor.loggingIn
    
});
Template.addSurvey.helpers({
Questions: function(){
    var questions = [];
    var numOfQuestions = parseInt(Session.get("addSurveyNumberOfQuestions"));
    for(var i = 1;i<=numOfQuestions;i++){
     questions.push({index:i,text:''});   
    }
    return questions;
    
}
    
});
Template.addSurvey.events({
    'change #addSurveyLength':function(){
     
        Session.set("addSurveyNumberOfQuestions",$('#addSurveyLength').val());
        
    },
    'click #addSurveySubmit':function(e){
     e.preventDefault();
     var surveyObject = {}
     var surveyTitle = $('#addSurveyTitle').val();
     var surveyAlias = $('#addSurveyAlias').val();
     var surveyAnonymous = $('#addSurveyAnonymous').prop('checked');
     var numOfQuestions = parseInt(Session.get("addSurveyNumberOfQuestions"));
     var questionText = $('.addSurveyQuestionText');
     var questionTypes = $('.addSurveyQuestionType');
     surveyObject.title = surveyTitle;
     surveyObject.alias = surveyAlias;
     surveyObject.length = numOfQuestions;
     surveyObject.isAnonymous = surveyAnonymous;
     surveyObject.questions = [];
     for(var i = 0;i<=numOfQuestions-1;i++){
     currentQuestion = {text:$(questionText[i]).val(),
                        type:$(questionTypes[i]).val(),index:(i+1)};
     surveyObject.questions.push(currentQuestion);
         
     }
     console.log(surveyObject); 
     Surveys.insert(surveyObject);
    }
    
});


Template.showSurvey.helpers({
    questions:function(){
    //console.log(this)
    return this;
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


<<<<<<< HEAD
Template.addSurvey.helpers({
Questions: function(){
    var questions = [];
    var numOfQuestions = parseInt(Session.get("addSurveyNumberOfQuestions"));
    for(var i = 1;i<=numOfQuestions;i++){
     questions.push({index:i,text:''});   
    }
    return questions;
    
}
    
});
Template.addSurvey.events({
    'change #addSurveyLength':function(){
     
        Session.set("addSurveyNumberOfQuestions",$('#addSurveyLength').val());
        
    },
    'click #addSurveySubmit':function(e){
     e.preventDefault();
     var surveyObject = {}
     var surveyTitle = $('#addSurveyTitle').val();
     var surveyAlias = $('#addSurveyAlias').val();
     var surveyAnonymous = $('#addSurveyAnonymous').prop('checked');
     var numOfQuestions = parseInt(Session.get("addSurveyNumberOfQuestions"));
     var questionText = $('.addSurveyQuestionText');
     var questionTypes = $('.addSurveyQuestionType');
     surveyObject.title = surveyTitle;
     surveyObject.alias = surveyAlias;
     surveyObject.length = numOfQuestions;
     surveyObject.isAnonymous = surveyAnonymous;
     surveyObject.questions = [];
     for(var i = 0;i<=numOfQuestions-1;i++){
     currentQuestion = {text:$(questionText[i]).val(),
                        type:$(questionTypes[i]).val(),index:(i+1)};
     surveyObject.questions.push(currentQuestion);
         
     }
     console.log(surveyObject); 
     Surveys.insert(surveyObject);
    }
    
});

Template.showSurvey.helpers({
    questions:function(){
    //console.log(this)
    return this;
    }
        
    
        
});


Template.surveyShowItem.helpers({
   isText:function(){
       
    return (this.type=='1')   
       
   }
    
});

=======
  
    
>>>>>>> development
}
var getFiveDays = function(){
      
      
   today = new Date();
  
   days = [];
   
   j=0;
   while(days.length<=5){
       
<<<<<<< HEAD
   }
   else{return null};
    
});

Meteor.publish('credits', function() { 
     
     
     
     if(this.userId){
     return Credits.find({});
     }
     else{return null};
});
Meteor.publish('surveys', function() { 
     
     
     
     if(this.userId){
     return Surveys.find({});
     }
     else{return null};
});
    
Meteor.publish('reviewpages',function(){
=======
>>>>>>> development
       
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
   console.log(daysObject);   
      
  }