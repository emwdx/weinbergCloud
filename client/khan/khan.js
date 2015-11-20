

Template.questionAdd.events({
'click #submitQuestion':function(e,t){

e.preventDefault();

var questionObject={
vars: document.getElementById('questionVars').value,
text: document.getElementById('questionText').value,
course:t.$('#courseSelectCourse').val(),
unit:parseInt(t.$('#courseSelectUnit').val()),
standard:parseInt(t.$('#courseSelectStandard').val())
};
console.log(questionObject);
var currentQuestionID = Session.get('currentQuestion');
var retrievedQ = Questions.findOne({_id:currentQuestionID});
if(retrievedQ){

Questions.update({_id:currentQuestionID},{$set:questionObject},function(error,result){

if(result){Router.go('/khan/');}

});

}
else{
Questions.insert(questionObject,function(error,result){

if(result){alert("Success!")};

});

}

},


'change #questionVars, change #questionText':function(e,t){
e.preventDefault();


  var questionObject={
  vars: t.$('#questionVars').val(),
  text: t.$('#questionText').val(),
  };

  if(questionObject.vars!=''&&questionObject.text!=''){
Session.set('questionPreview',questionObject);

  }
  else{

 Session.set('questionPreview',{vars:"",text:""});

  }




}


});



Template.questionView.onRendered(function(){
var template = this;
  renderQuestion();
  renderEquations(template);

});

Template.questionPreview.onRendered(function(){
  var template = this;
  Session.set('previewObject',{previewText:"",previewAnswer:"",previewVars:""});
  Session.set('questionPreview',undefined)


template.autorun(function(){
  //console.log('rendered');
  var previewExists = Session.get('previewObject');
  renderEquations(template);
});


});



Template.questionPreview.events({
  'click #questionPreview':function(e,t){
  e.preventDefault();

    var questionObject={
    vars: $('#questionVars').val(),
    text: $('#questionText').val(),
    };

    if(questionObject.vars!=''&&questionObject.text!=''){
  Session.set('questionPreview',questionObject);

    }
    else{

   Session.set('questionPreview',{text:"",vars:""});

    }
Session.set('previewObject',{previewText:"",previewAnswer:"",previewVars:""});
  rendQ(Template.instance());
  //renderEquations(Template.instance());
  //console.log(Session.get('questionPreview'));
  //console.log(questionObject);

  //Blaze.renderWithData(Template.questionPreview, Template.currentData(),document.querySelector(("#"+a)));


  },
})

Template.questionPreview.helpers({

previewText:function(){


var result = Session.get('previewObject');
if(result){return result.text}
//console.log('not found');
return "";

},
previewAnswer: function(){
  var result = Session.get('previewObject')
  if(result){return result.answer}
//console.log('not found');
  return "";


},
previewVars: function(){
var result = Session.get('questionPreview')
if(result){return result.vars}
console.log('not found');
return "";

},
reloading:function(){

return Session.get('reloadingQuestion');

},

noCodeError:function(){

return Session.equals('codeError',false);
}


})

Template.questionView.helpers({

answerValue:function(t){

return Template.instance().answer.get();


},
reloading:function(){

Session.get('reloadingQuestion');

}

})



Template.questionView.events({

  'click .reloadQuestion':function(e,t){
    var a = $(e.target).closest('.qC').attr("id");

Blaze.remove(Template.instance().view);

Blaze.renderWithData(Template.questionView, Template.currentData(),document.querySelector(("#"+a)));


  },
  'click .addToQuiz':function(e,t){

var questionText = t.$('.questionText').html();

var answer = t.$('#answerText').html();
var newQuestion = {text:questionText,answer:answer,
course:t.data.course,unit:t.data.unit,standard:t.data.standard,qid:t.data._id};
console.log(newQuestion);

var curQuiz = Session.get('currentQuiz');
curQuiz.push(newQuestion);
Session.set('currentQuiz',curQuiz);
t.$('.question').addClass('quizQuestionSelected');

}

})

Template.questionsViewAll.events({

'click .questionDelete':function(e){
e.preventDefault();
var check = confirm("Are you sure?");
if(check){

Questions.remove({_id:this._id});


}


},
'click .questionEdit':function(e){
e.preventDefault();
var courseUnitStandardObject = {
course:this.course,
unit:this.unit,
standard:this.standard,

}

Session.set('currentCourseUnitStandard',courseUnitStandardObject);
Session.set('currentQuestion',this._id);
Router.go('/questions/edit/'+this._id+"/");


},
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





Template.questionsViewAll.helpers({

question:function(){

  var searchObject = {};
  var questionStandardData = Session.get('currentCourseUnitStandard');



  if(questionStandardData.course!=""){
    searchObject['course']=questionStandardData.course;
  }

  if(questionStandardData.unit!=''){
    searchObject['unit']=parseInt(questionStandardData.unit);
  }

  if(questionStandardData.standard!=''){
    searchObject['standard']=parseInt(questionStandardData.standard);
  }



return Questions.find(searchObject);

},
quizzesAssigned:function(){
  return Session.get('quizzesAssigned');
}

});

Template.courseUnitStandard.helpers({

courses:function(){

  return getNames(Standards,'course')


},
units:function(){
  var units = [];
  var currentCourse=Session.get('currentCourseUnitStandard');
  if(currentCourse){
  standardsCourses = Standards.find({course:currentCourse.course,active:true},{sort:{unit:1,standard:1}});
  standardsCourses.forEach(function(e){
  if(!_.contains(units,e.unit)){
    units.push(e.unit);

  }

});
return units;
}
else{

return [0];

}

},
standards:function(){
var units = [];
var currentCourse=Session.get('currentCourseUnitStandard');
if(currentCourse){
standardsCourses = Standards.find({course:currentCourse.course,active:true},{sort:{unit:1,standard:1}});
standardsCourses.forEach(function(e){
if(!_.contains(units,e.standard)){
  units.push(e.standard);

}


});
return units;
}
else{
return [0];


}
}
});




Template.courseUnitStandard.events({

'change .courseSelect':function(e){

var template = $(e.target).parent().parent();

var courseUnitStandardObject = {
course:template.find('#courseSelectCourse').val(),
unit:template.find('#courseSelectUnit').val(),
standard:template.find('#courseSelectStandard').val(),

}

Session.set('currentCourseUnitStandard',courseUnitStandardObject);


}


});

Template.courseUnitStandard.rendered = function(){
var questionStandardData = Session.get('currentCourseUnitStandard');

if(questionStandardData){
$('#courseSelectCourse').val(questionStandardData.course);
$('#courseSelectUnit').val(questionStandardData.unit);
$('#courseSelectStandard').val(questionStandardData.standard);
}
else{
Session.set('currentCourseUnitStandard',undefined);

}

}
Template.questionsViewAll.rendered = function(){

Session.set('currentCourseUnitStandard',{course:"",standard:"",unit:""});
Session.set('currentQuiz',[]);
Session.set('quizzesAssigned',[]);

}

Template.classRoster.helpers({

student:function(){
var currInfo = Session.get('currentCourseUnitStandard');
searchObject = {};
if(currInfo.course){
  searchObject['profile.courses']=currInfo.course;
}

return Meteor.users.find(searchObject);
}

});

Template.quizzesViewAll.helpers({
incompleteQuizzes:function(){


return Quizzes.find({completed:false},{$sort:{created:1}});

},
completeQuizzes:function(){

return Quizzes.find({completed:true},{$sort:{created:1}});

},

active:function(){

if(this.active==true){return 'checked'}
else{return ''}

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

function renderQuestion(){

      //Session.set('reloadingQuestion',true);
      var vars = Template.instance().findAll('var');
       var codeError = false;
      var varNames = []

      vars.forEach(function(e){
      //if($(e).attr('id')!='answer'){
      Template.instance()[$(e).attr('id')]=new ReactiveVar();
      var varText = $(e).html().replace(/&lt;/g, "<").replace(/&gt;/g, ">")

      varNames.forEach(function(e){

      var re = new RegExp("@"+e+'\\b',"g")
      var insertArray = (typeof(Template.instance()[e].get())=='object')?("["+ Template.instance()[e].get()+"]") : Template.instance()[e].get();
      varText = varText.replace(re,insertArray);

      });
      //console.log(varText+" var");

      if($(e).attr('id')!='answer'){

/*
      try{

      esprima.parse(varText);


      }
      catch(r){

      codeError=true;
      console.log(r)


      }
*/

      if(!codeError){

      Template.instance()[$(e).attr('id')].set(eval(varText));

      }
      Session.set('codeError',codeError);


      varNames.push($(e).attr('id'))
}
else{
       var answerText = $(vars[vars.length - 1]).html();


      Template.instance()['answer']= new ReactiveVar();
       Template.instance()['answer'].set(answerText);

       //console.log(answerText);
}
       Template.instance()['varNames'] = new ReactiveVar();
       Template.instance()['varNames'].set(varNames);

      //console.log(varString);

      //}
      });

      //console.log(Template.instance());
      var question = Template.instance().find('.question');

      if(question!=[]){
      var questionHTML = $(question).html();

      var re = new RegExp("@answer\\b","g")

      questionHTML = questionHTML.replace(re,Template.instance()['answer'].get());

      varNames.forEach(function(e){

      var re = new RegExp("@"+e+'\\b',"g")

      questionHTML = questionHTML.replace(re,Template.instance()[e].get());



      })
      $(question).html(questionHTML);
      //console.log(questionHTML);

    };

}



function rendQ(template){


      var vars = template.findAll('var');

       var codeError = false;
      var varNames = []

      vars.forEach(function(e){
      //if($(e).attr('id')!='answer'){

      template[$(e).attr('id')]=new ReactiveVar();
      var varText = $(e).html().replace(/&lt;/g, "<").replace(/&gt;/g, ">")

      varNames.forEach(function(e){

      var re = new RegExp("@"+e+'\\b',"g")
      var insertArray = (typeof(template[e].get())=='object')?("["+ template[e].get()+"]") : template[e].get();
      varText = varText.replace(re,insertArray);

  });

      //console.log(varText+" var");

      if($(e).attr('id')!='answer'){




      template[$(e).attr('id')].set(eval(varText));



      varNames.push($(e).attr('id'))
}


else{
       var answerText = $(vars[vars.length - 1]).html();


      template['answer']= new ReactiveVar();
       template['answer'].set(answerText);

       console.log(answerText);
}



});
       template['varNames'] = new ReactiveVar();
       template['varNames'].set(varNames);


//console.log(template);

      var preview = Session.get('questionPreview');
      if(preview){
      var question = Session.get('questionPreview').text;


      var questionHTML = question;
      var answerHTML="@answer";
      var re = new RegExp("@answer\\b","g")

      answerHTML = answerHTML.replace(re,template['answer'].get());
      console.log(answerHTML);
      varNames.forEach(function(e){

      var re = new RegExp("@"+e+'\\b',"g")

      questionHTML = questionHTML.replace(re,template[e].get());
      answerHTML = answerHTML.replace(re,template[e].get());


      })

      var previewObject = {
        text:questionHTML,
        answer:answerHTML
      }
      //console.log(template)
      Session.set('previewObject',previewObject);


    };

return template;

}
function renderEquations(template){


vars = template.findAll('eq')

      vars.forEach(function(e){

      katex.render(e.innerText ,e);


    })

}

function addVariables(t,text){
  var questionHTML = text;

  var re = new RegExp("@answer\\b","g")

  questionHTML = questionHTML.replace(re,t.instance()['answer'].get());

  varNames.forEach(function(e){

  var re = new RegExp("@"+e+'\\b',"g")

  questionHTML = questionHTML.replace(re,t.instance()[e].get());

return questionHTML;

})

}


Template.desmosView.rendered = function(){

elt = this.$('.desmos-container')[0];
options = {
keypad:false,
expressions:false,
lockViewport:true,
settingsMenu:false,
zoomButtons:false
};

var calculator = Desmos.Calculator(elt,options);

this.autorun(function(){

  var expression = Session.get('desmos-exp');
  calculator.setExpression({id:'graph1', latex:expression});

})




}

Template.desmosView.events({
'keydown #desmos-input':function(e){
console.log($(e.target).val());
Session.set('desmos-exp',$(e.target).val());
}
});
