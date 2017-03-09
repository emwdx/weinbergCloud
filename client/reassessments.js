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


Template.reassessSignUp.rendered = function(){

Session.set('currentCourse',Standards.findOne({course:{$in:Meteor.user().profile.courses}}).course);


}

Template.reassessSignUp.helpers({

  daysObject: getFiveDays,
  isWeekend: function(){
         today = new Date();
         return (today.getDay()==0|today.getDay()==6);

    },
  hasEnoughCredits: function(){
     var currentUser = Meteor.user()
     var currentCourse = Session.get('currentCourse');
     allCredits = Credits.find({user:currentUser.emails[0].address,$and:[{used:false},{expired:false}],course:currentCourse}).fetch();
     numOfCredits = allCredits.length;
     return (numOfCredits>0);

   },
      isGrade9:function(){

     var is9 = (Meteor.user().profile.grade=='9');
     var isEvan = (Meteor.user().emails[0].address=='eweinberg@scischina.org')

     return (is9|isEvan);

    },
    isSubmittingReassessment: function(){return Session.equals('isSubmittingReassessment',true)},
    standardFound: function(){
    return Session.equals("reassessmentStandardSelectedFound",true);
    },
    standardFound:function(){
        return Session.get("standardFound");
    },

    reassessCourse:function(){

      var courses = [];
      standardsCourses = Standards.find({course:{$in:Meteor.user().profile.courses}});
      standardsCourses.forEach(function(e){
      if(!_.contains(courses,e.course)){
        courses.push(e.course);

      }

    });

    return courses.sort();

  },

   currentCourse:function(){

     return Session.get('currentCourse');


   },
   reassessCourseUnits:function(){
     var units = [];
     var currentCourse=Session.get('currentCourse');
     standardsCourses = Standards.find({course:currentCourse,active:true});
     standardsCourses.forEach(function(e){
     if(!_.contains(units,e.unit)){
       units.push(e.unit);

     }

   });
   return units.sort();
 },
 reassessCourseStandards:function(){
   var units = [];
   var currentCourse=Session.get('currentCourse');
   standardsCourses = Standards.find({course:currentCourse,active:true,});
   standardsCourses.forEach(function(e){
   if(!_.contains(units,e.standard)){
     units.push(e.standard);

   }

 });
 return units.sort();
}

  });


  Template.reassessSignUp.events({


 'click #signUpRetakes':function(event){

  event.preventDefault();
 var emptyInputs = 0;
 var reassessInputs = $('.reassessSelect');
 reassessInputs.each(function(){

 if($(this).val()==0){
  emptyInputs++;

 }

 });

 if(emptyInputs<1){
 var currentCredit=Credits.find({user:currentUser.emails[0].address,$and:[{used:false},{expired:false}] ,course:Session.get('currentCourse')},{sort:{expiresOn:1}}).fetch()[0];
 var newRetake = {
                course: $('body').find('[name=course]').val(),
				unit: parseInt($('body').find('[name=unit]').val()),
				standard: parseInt($('body').find('[name=standard]').val()),
				time: $('body').find('[name=time]').val(),
				day: $('body').find('[name=date]').val(),
                grade: parseInt($('body').find('[name=grade]').val()),
				completed: false,
				user: Meteor.user().emails[0].address,
        credit:currentCredit._id,
        schoolYear:"15-16",
        quizAssignmentComplete:false


 }
 console.log(newRetake);
 currentUser = Meteor.user();

Session.set('isSubmittingReassessment',true);
 Reassessments.insert(newRetake, function(error,result){


  if(result){

    Router.go('/myReassessments/');



            Credits.update({_id:newRetake.credit},{$set:{used:true}});
             Session.set('isSubmittingReassessment',false);
Session.set("standardFound",false);
            }
   else if(error){

       Session.set('isSubmittingReassessment',false);

   }
 });

 }
 else{

  alert("Make sure you choose something for each input.");
 }

 },
'change .reassessSelect':function(e){

var inputs = $(".reassessSelect")
var course = $(inputs[0]).val();
var unit = parseInt($(inputs[1]).val());
var standard = parseInt($(inputs[2]).val());
var response = Standards.findOne({unit:unit,standard:standard,course:course});

if(response){

Session.set("standardFound",response);
}
else{
Session.set("standardFound",false);
}

},

'change #reassessSelectCourse':function(e){

Session.set('currentCourse',$(e.target).val())

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
    },

    standardFound:function(){
        return Session.get("standardFound");
    },

    selectedReassessment: function(){

     return Session.get('selectedReassessment')

   },
   reassessCourse:function(){

     var courses = [];
     standardsCourses = Standards.find({},{sort:{unit:1,standard:1}});
     standardsCourses.forEach(function(e){
     if(!_.contains(courses,e.course)){
       courses.push(e.course);

     }

   });

   return courses;

 },

  currentCourse:function(){

    return Session.get('currentCourse');


  },
  reassessCourseUnits:function(){
    var units = [];
    var currentCourse=Session.get('currentCourse');
    standardsCourses = Standards.find({course:currentCourse,active:true},{sort:{unit:1,standard:1}});
    standardsCourses.forEach(function(e){
    if(!_.contains(units,e.unit)){
      units.push(e.unit);

    }

  });
  return units.sort();
},
reassessCourseStandards:function(){
  var units = [];
  var currentCourse=Session.get('currentCourse');
  standardsCourses = Standards.find({course:currentCourse,active:true},{sort:{unit:1,standard:1}});
  standardsCourses.forEach(function(e){
  if(!_.contains(units,e.standard)){
    units.push(e.standard);

  }

});
return units.sort();
}


});



Template.reassessEdit.events({

   'click #updateReassessment': function(e){
    e.preventDefault();
    var emptyInputs = 0;
 var reassessInputs = $('.reassessEditSelect');
 reassessInputs.each(function(){

 if($(this).val()==0){
  emptyInputs++;

 }

 });
    if(emptyInputs==0){
    updateReassessmentObject = {
    course:$('#reassessEditForm').find('[name=course]').val(),
	unit: parseInt($('#reassessEditForm').find('[name=unit]').val()),
	standard:parseInt($('#reassessEditForm').find('[name=standard]').val()),
	time: $('#reassessEditForm').find('[name=time]').val(),
	day: $('#reassessEditForm').find('[name=date]').val(),
    grade:$('#reassessEditForm').find('[name=grade]').val()
    }
    console.log(updateReassessmentObject);
    Reassessments.update({_id:this._id},{$set:updateReassessmentObject});
    Router.go('/myReassessments/');

   }
 else{


  alert("Make sure you choose something for each input.");

 }
   },

'change .reassessEditSelect':function(e){

var inputs = $(".reassessEditSelect")
var course = $(inputs[0]).val();
var unit = parseInt($(inputs[1]).val());
var standard = parseInt($(inputs[2]).val());
var response = Standards.findOne({unit:unit,standard:standard,course:course});

if(response){

Session.set("standardFound",response);
}
else{
Session.set("standardFound",false);
}

}



});

Template.reassessEdit.rendered = function(){
var currentReassessment = Session.get('selectedReassessment');
Session.set('currentCourse',currentReassessment.course);
$('#reassessEditForm').find('[name=unit]').val(currentReassessment.unit)
$('#reassessEditForm').find('[name=standard]').val(currentReassessment.standard);


}

Template.myReassessments.helpers({

upcomingReassessments: function(){

    return Reassessments.find({user:Meteor.user().emails[0].address,completed:false});

},
completedReassessments:function(){

    return Reassessments.find({user:Meteor.user().emails[0].address,completed:true});

}



});

Template.reassessmentTemplate.events({

    'click .cancelReassessment': function(e){
    e.preventDefault();
    currentUser = Meteor.user();
    if(Roles.userIsInRole(currentUser,['teacher','admin'])){
    currentCredit = Credits.findOne({_id:this.credit});
    Credits.update({_id:currentCredit._id},{$set:{used:false}});
    }
    else{
    currentCredit = Credits.findOne({_id:this.credit});
    Credits.update({_id:currentCredit._id},{$set:{used:false}});


    }
     Reassessments.remove({_id:this._id});

    },
    'click .editReassessment': function(e){
     e.preventDefault();
     Session.set('selectedReassessment',this);
     Session.set("standardFound",false);
     Session.set('currentReassessmentDay',this.day);
     Session.set('currentReassessmentID',this._id);
     Router.go('/reassess/edit/');

    }


});

Template.reassessmentAdminTemplate.helpers({

userName:function(){

var name = Meteor.users.findOne({"emails.0.address":this.user}).profile.realName;
if(name){return name}
else{

return user;
}

},
assigned:function(){
var assignedQuiz = this.quizAssigned|false;
if(this.quizAssignmentComplete===true){

  return "quizAssignmentComplete";
}
  if(assignedQuiz==true){

    return "quizQuestionSelected"};
  {return ""}
}

})


Template.showNextRetakes.helpers({
        reassessments: function(){

         return Reassessments.find({day: Session.get('currentDay'),completed:false},{sort:{time: 1, course: -1,quizAssigned:1}});

        },
        reassessmentsDuringLunchClass: function(){

         return Reassessments.find({day: Session.get('currentDay'),completed:false,time:{$in:["During Lunch","Lunch Activity","In-Class Quiz","Block D or G"]}},{sort:{ unit:1, standard:1}});

        },
        reassessmentsBeforeSchool: function(){

         return Reassessments.find({day: Session.get('currentDay'),completed:false,time:"Before School"},{sort:{unit:1, standard:1}});

        },
        reassessmentsAfterSchool: function(){

         return Reassessments.find({day: Session.get('currentDay'),completed:false,time:"After School"},{sort:{unit:1, standard:1}});

        },
        daysObject:getFiveDays,
        reassessmentFoundDay:function(){
          var days = [];
          var reassessments = Reassessments.find({completed:false});
          reassessments.forEach(function(e){
          if(!_.contains(days,e.day)){
            days.push(e.day);

          }

        });
        return days.sort();
        }


});

Template.showNextRetakes.events({

    'change #selectDate':function(e){
    Session.set('currentDay',$('#selectDate').val());

    }



});

Template.reassessmentAdminTemplate.events({
 'click .cancelReassessment': function(e){
    e.preventDefault();
    currentUser = Meteor.user();
    if(Roles.userIsInRole(currentUser,['teacher','admin'])){
    currentCredit = Credits.findOne({_id:this.credit});
    Credits.update({_id:currentCredit._id},{$set:{used:false}});
    }
    else{

    Credits.update({_id:this.credit},{$set:{used:false}});


    }
     Reassessments.remove({_id:this._id});

    },
    'click .editReassessment': function(e){
     e.preventDefault();
     Session.set('selectedReassessment',this);
     Session.set("standardFound",false);
     Session.set('currentReassessmentDay',this.day);
     Session.set('currentReassessmentID',this._id);
     Router.go('/reassess/edit/');

    },
     'click .completeReassessment': function(e){
    e.preventDefault();

    Reassessments.update({_id:this._id},{$set:{completed:true}});
    var usedCredit = Reassessments.findOne({_id:this.credit});

    Credits.update({_id:usedCredit},{$set:{used:true}});


  },

  'dblclick .reassessmentItem':function(){
    console.log(this);
    if(this.quizAssigned){
      Reassessments.update({_id:this._id},{$set:{quizAssigned:false}},function(error,result){
       if(result){console.log("logged")};
       });

    }
    else{Reassessments.update({_id:this._id},{$set:{quizAssigned:true}});}

  }
});

Template.myCredits.helpers({
myUnusedCredits:function(){

  var searchObject = {};
currentUser = Meteor.user();
if(Roles.userIsInRole(currentUser,['teacher','admin'])){

  if(Session.get('currentCourse')!="0"){

    searchObject['course']=Session.get('currentCourse');

  }


}
else{

searchObject['user']=Meteor.user().emails[0].address;


}
searchObject['$and']=[{used:false},{expired:false}];
return Credits.find(searchObject,{sort:{createdOn:1}});


},
myUsedCredits:function(){


    var searchObject = {};

if(Roles.userIsInRole(currentUser,['teacher','admin'])){


    if(Session.get('currentCourse')!="0"){

      searchObject['course']=Session.get('currentCourse');

    }
}

else{
searchObject['user']=Meteor.user().emails[0].address;

}
  searchObject['$or']=[{used:true},{expired:true}];

return Credits.find(searchObject,{sort:{createdOn:-1}});

},

reassessSummary:function(){

var reassess = Reassessments.findOne({credit:this._id});
var dateArray = new Date(reassess.day).toDateString().split(" ");
var dateString = dateArray[1]+ ' ' + dateArray[2];
return dateString + " - " + reassess.course + " " + reassess.unit+"."+reassess.standard;


},
expirationLength:function(){

  var lifetime = systemVariables.findOne({name:'creditLifetime'});
  if(lifetime){
  return lifetime.value;
}

},
hasExpired:function(){

var expiredDate = new Date(this.expiresOn);
var currentDate = new Date();
return currentDate>expiredDate;

}


})

Template.myCredits.events({

'click .expireCredit':function(e){
e.preventDefault();
Credits.update({_id:this._id},{$set:{expired:true}});


},
'click .restoreCredit':function(e){
e.preventDefault();
Credits.update({_id:this._id},{$set:{expired:false}});


},
'change .creditExpiresDate':function(e){
e.preventDefault();
var changedDate = $(e.target).val();
Credits.update({_id:this._id},{$set:{expiresOn:changedDate}});


},
'change #creditLifetime':function(e){
  e.preventDefault();
  var changedLife = parseInt($(e.target).val());

  var lifetime = systemVariables.findOne({name:'creditLifetime'});
  if(lifetime){
  systemVariables.update({_id:lifetime._id},{$set:{value:changedLife}});
}
else{
systemVariables.insert({name:'creditLifetime',value:10})


}

},
'click .defaultExpiration':function(e){

var createdDate = new Date(this.createdOn);
var lifetime = systemVariables.findOne({name:'creditLifetime'});

var newExpiration = new Date((createdDate.getTime() + lifetime.value*86400*1000));
Credits.update({_id:this._id},{$set:{expiresOn:newExpiration}});



},
'click #assignBulkExpiration':function(e){
e.preventDefault();
var lifetime = systemVariables.findOne({name:'creditLifetime'});
var yes = confirm("Are you sure you want to reset all expiration dates?");
if(yes){
var allCredits = Credits.find({used:false});
allCredits.forEach(function(e){
var createdDate = new Date(e.createdOn);
var newExpiration = new Date((createdDate.getTime() + lifetime.value*86400*1000));
Credits.update({_id:e._id},{$set:{expiresOn:newExpiration,expired:false}});



})



}



}



})
