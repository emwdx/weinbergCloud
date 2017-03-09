Template.quizzesViewAll.helpers({
incompleteQuizzes:function(){


return Quizzes.find({completed:false},{sort:{created:1}});

},
completeQuizzes:function(){

return Quizzes.find({completed:true},{sort:{created:1}});

},

active:function(){

if(this.active==true){return 'checked'}
else{return ''}

}

})

Template.classRoster.helpers({

student:function(){

if(Session.get('filterByReassessmentStatus')){
  var currentDay = Session.get('currentDay');
var todayReassessments = Reassessments.find({day: currentDay,completed:false},{sort:{time: 1,unit:1,standard:1}});
}
else{
var currInfo = Session.get('currentCourseUnitStandard');
searchObject = {};
if(currInfo.course){
  searchObject['profile.courses']=currInfo.course;
}

return Meteor.users.find(searchObject);
}
},
reassessmentStudent:function(){
  if(Session.get('filterByReassessmentStatus')){
    var currentDay = Session.get('currentDay');
  var todayReassessments = Reassessments.find({day: currentDay,completed:false},{sort:{time: 1,unit:1,standard:1}});

  return todayReassessments

  }



},
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

Template.classRoster.events({

      'change #selectDate':function(e){
      Session.set('currentDay',$('#selectDate').val());

    },
    'change .selectToAddQuiz':function(){

      var currentQuizzes = Session.get('quizAssignedTo');

      if(_.contains(currentQuizzes,this.user)!=true){
        currentQuizzes.push(this.user);
      }

      Session.set('quizAssignedTo',currentQuizzes);
    }



})

Template.classRoster.rendered=function(){

Session.set('quizAssignedTo',[]);


}

Template.assignQuiz.helpers({

  quizzesAssigned:function(){
    return Session.get('quizzesAssigned');
  }

})
Template.assignQuiz.events({

  'click #assignQuiz':function(e){

  e.preventDefault();
  var names = Session.get('quizAssignedTo');

  var questions = Session.get('currentQuiz');
  standards = []
  questions.forEach(function(q){
  var curStd = q.unit+"."+q.standard;
  if(!_.contains(standards,curStd)){
  standards.push(curStd);
  }
  })

  courses = []
  questions.forEach(function(q){
  var curStd = q.course;
  if(!_.contains(courses,curStd)){
  courses.push(curStd);
  }

  });


  names.forEach(function(n){

  var name = Meteor.users.findOne({"emails.0.address":n})._id;
  //console.log(name);
  var newQuiz = {
  questions:questions,
  user:name,
  active:false,
  completed:false,
  created:new Date(),
  standards:standards,
  courses:courses,
  schoolYear:"15-16",
  showAnswers:false,
  }
  Quizzes.insert(newQuiz,function(error,result){
   if(result){
   console.log("quiz assigned");
  var quizzes = Session.get('quizzesAssigned');
  Reassessments.update({_id:e._id},{$set:{quizAssignmentComplete:true,quizAssigned:false}});
  quizzes.push(e);

  Session.set('quizzesAssigned',quizzes);
   }
   else{console.log(error)}
   });
  });

  },
  'click #resetQuiz':function(e){

  Session.set('currentQuiz',[]);
  Session.set('quizzesAssigned',[]);
  Session.set('quizAssignedTo',[]);
  $('.question').removeClass('quizQuestionSelected');
  $('.selectToAddQuiz').prop('checked', false);

},
'change #filterByReassessmentStatus':function(e){

Session.set('filterByReassessmentStatus',$(e.target).is(":checked"))


}



})

Template.quizzesViewAll.events({
  'change .quizVisible':function(e){
  var bool = $(e.target).is(":checked");
  Quizzes.update({_id:this._id},{$set:{active:bool}});
},
'click .quizCompleted':function(e){
e.preventDefault();
Quizzes.update({_id:this._id},{$set:{completed:true,showAnswers:true}});

},
'click .quizNotCompleted':function(e){
e.preventDefault();
Quizzes.update({_id:this._id},{$set:{completed:false,showAnswers:false}});

},
'click .quizDelete':function(e){
e.preventDefault();
var bool = confirm('Are you sure you want to delete this quiz?');
if(bool){
Quizzes.remove({_id:this._id});

}

}

})

Template.quizQuestionView.helpers({
answerVisible:function(){
var quizSettings = Template.parentData();
return (quizSettings.showAnswers|Roles.userIsInRole(Meteor.user(),['teacher','admin']))

}

})

/*
Template.quizQuestionView.rendered = function(){
  eqns = Template.instance().findAll('ans');
console.log(eqns);
  eqns.forEach(function(e){

  katex.render(e.innerText,e);

});

}
*/

Template.quizView.helpers({

quizVisible:function(){
  return (this.active|Roles.userIsInRole(Meteor.user(),['teacher','admin']))


},
adminView:function(){

  return (!this.active&Roles.userIsInRole(Meteor.user(),['teacher','admin']));
}


})

Template.quizzesViewMine.helpers({
  incompleteQuizzes:function(){


  return Quizzes.find({completed:false,active:true},{$sort:{created:1}});

  },
  completeQuizzes:function(){

  return Quizzes.find({completed:true},{$sort:{created:1}});

  },



})
