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

Template.assignQuiz.helpers({

  quizzesAssigned:function(){
    return Session.get('quizzesAssigned');
  }

})
Template.assignQuiz.events({

  'click #assignQuiz':function(e){

  e.preventDefault();
  var names = $('#classRosterNames').val();
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

  //console.log(names);
  names.forEach(function(e){
  var newQuiz = {
  questions:questions,
  user:e,
  active:false,
  completed:false,
  created:new Date(),
  standards:standards,
  courses:courses,
  schoolYear:"15-16",
  showAnswers:false
  }
  Quizzes.insert(newQuiz,function(error,result){
   if(result){

  var quizzes = Session.get('quizzesAssigned');
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
  $('.question').removeClass('quizQuestionSelected');

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
