

if (Meteor.isClient) {


$.extend(Kh,KhanUtil);
Meteor.subscribe("users");

 Accounts.ui.config({ passwordSignupFields: 'EMAIL_ONLY'
 });


  today = new Date();
  currentDay = today.toDateString();

  Session.set('currentDay',currentDay);
  Session.set("addSurveyNumberOfQuestions",1);
  Session.set("currentlySelectedStandard","");

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
},
appReady:function () {
  return Template.instance().subscriptionsReady();
}

  });

  Template.mainContent.events({

  'click #questionBuilder':function(e){

  Session.set('questionMode','Create New');

  }

});

Template.mainContent.onCreated(function () {
  var template = this;
  template.autorun(function () {
    if(Meteor.user){
        Meteor.subscribe('reassessments');
        Meteor.subscribe('users');
        Meteor.subscribe('credits');
        Meteor.subscribe('systemVariables');
        Meteor.subscribe('reviewpages');
        Meteor.subscribe('standards');
        Meteor.subscribe('standard-links');
        Meteor.subscribe('weinbergcash');
        Meteor.subscribe('standard-links');
        //Meteor.subscribe('questions');
        Meteor.subscribe('quizzes');

    }
  });
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




}
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
   console.log(daysObject);

  }
