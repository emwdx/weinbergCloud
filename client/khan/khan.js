Template.questionAdd.events({
'click #submitQuestion':function(e,t){

e.preventDefault();

var currentQuestionObject={
answer: t.$('#questionAnswer').val(),
text: t.$('#questionText').val(),
};

var currentStandard = Session.get('currentCourseUnitStandard');
//var variables = Session.get('mqQuestionVars');

var variables = Variables.find().fetch();
var testingVars = variables;

testingVars = processVariables(testingVars);
if(!(testingVars=='code-error')){

var questionObject={
vars: variables,
text: currentQuestionObject.text,
answer: currentQuestionObject.answer,
//public: $('#shareQuestion').is(":checked"),
title: $('#addQuestionTitle').val(),
course: currentStandard.course,
unit:currentStandard.unit,
standard:currentStandard.standard
};
console.log(questionObject);

var currentQuestionID = Session.get('currentQuestion');
var questionMode = Session.get('questionMode');

var retrievedQ = Questions.findOne({_id:currentQuestionID});

if(questionMode=='Edit'){
questionObject['lastEdited']=new Date();
Questions.update({_id:currentQuestionID},{$set:questionObject},function(error,result){

if(result){
alert("Successfully edited question!");
Router.go('/list-questions/');
Session.set('questionPreview',null);
}

});

}
else if(questionMode=='Create New'){
  questionObject['created']=new Date();
  questionObject['user']=Meteor.user().username;
Questions.insert(questionObject,function(error,result){

if(result){
  alert("Successfully added question!");
Router.go('/list-questions/');
Session.set('questionPreview',null);

};

});

}

else if(questionMode =='Copy'){
  questionObject['created']=new Date();
  questionObject['user']=Meteor.user().username;
  Questions.insert(questionObject,function(error,result){

  if(result){
    alert("Successfully copied Question!");
  Router.go('/list-questions/');
  Session.set('questionPreview',null);

  };

  });


}
}
else{alert("Please check your calculated values or custom code for errors.")}

},


'keypress #questionAnswer, keypress #questionText':function(e,t){


  var questionObject={
  answer: t.$('#questionAnswer').val(),
  text: t.$('#questionText').val(),
  };

  if(questionObject.answer!=''&&questionObject.text!=''){
Session.set('questionPreview',questionObject);

  }
  else{

 Session.set('questionPreview',{answer:"",text:""});

  }

renderEquations(t);

},

'click #addVar':function(e){
e.preventDefault();
var vars = Variables.find().fetch();//Session.get('mqQuestionVars');
var names = _.pluck(vars,'name');
if(_.contains(names,("var"+vars.length))){
  var newName = "var"+(vars.length+1);
}
else{

  var newName = "var"+vars.length;
}
var newIndex = vars.length+1;
//vars.push({name:newName,value:null,type:'rand-int',index:newIndex,options:{min: -10, max: 10, exclude: ""}});
//Session.set('mqQuestionVars',vars);
Variables.insert({name:newName,value:null,type:'rand-int',index:newIndex,options:{min: -10, max: 10, exclude: ""}})

},

'click #processVariables':function(e,t){
e.preventDefault();

//vars = Session.get('mqQuestionVars');
vars = Variables.find().fetch()

var testingVars = vars;

testingVars = processVariables(testingVars);
if(!(testingVars=='code-error')){


vars = processVariables(vars);

vars.forEach(function(v){

Variables.update({_id:v._id},{$set:{value:v.value}})

})
//Session.set('mqQuestionVars',vars);

var mqQuestionText = t.$('#questionText').val();
var mqQuestionAns = t.$('#questionAnswer').val();

vars.forEach(function(el){
  var re = new RegExp("@"+el.name+'\\b',"g")
  var varVal = el.value;
  mqQuestionText = mqQuestionText.replace(re,varVal);
  mqQuestionAns = mqQuestionAns.replace(re,varVal);

})

Session.set('questionPreview',{answer:mqQuestionAns,text:mqQuestionText});
renderEquations(t);

}
else{alert('Check your code for errors')}
}



});

Template.questionAdd.onRendered(function(){


var mqQuestionText = Template.instance().$('#questionText').val();
var mqQuestionAns = Template.instance().$('#questionAnswer').val();

Session.set('questionPreview',{text:mqQuestionText,answer:mqQuestionAns});





this.$( "#varList" ).sortable({

  update: function(e, ui) {
    var el = ui.item.get(0)
    var before = ui.item.prev().get(0)
    var after = ui.item.next().get(0)
    newVars = [];
    currVars = Variables.find().fetch();


           if(!before) {

             newVars.push(Blaze.getData(el));

             currVars.forEach(function(d){

               newVars.push(d)});

             newVars.splice(Blaze.getData(el).index,1);

           } else if(!after) {


             currVars.forEach(function(d){

               newVars.push(d);

             });

             newVars.push(Blaze.getData(el));
             //newVars[newVars.length-1].index=0;
             console.log(newVars);
             newVars.splice(Blaze.getData(el).index-1,1);


           }
           else{

            var topVars = currVars.slice(0,Blaze.getData(el).index-1);
            var botVars = currVars.slice(Blaze.getData(el).index-1,currVars.length)
            topVars.forEach(function(d){newVars.push(d)})
            newVars.push(Blaze.getData(el));
            botVars.forEach(function(d){newVars.push(d)})

           }
          //Variables.find().fetch().forEach(function(v){Variables.remove(v._id)})
          var i=0;
          newVars.forEach(function(d){
            d.index=i+1;
            Variables.update({_id:d._id},{$set:{d}});
            i++
          })



}
});


});

Template.questionAdd.onCreated(function(){

this.subscribe('questions',{_id:Session.get('selectedQuestion')});
if(Variables.find().count()==0){Variables.insert({name:"var1",value:null,type:'rand-int',index:1,options:{min: -10, max: 10, exclude: ""}});}

})

Template.questionAdd.onDestroyed(function(){

Variables.find().fetch().forEach(function(v){Variables.remove(v._id)});
Variables.insert({name:"var1",value:null,type:'rand-int',index:1,options:{min: -10, max: 10, exclude: ""}});

})

Template.questionAdd.helpers({

vars: function(){

return Variables.find({},{sort:{index:1}});
//return Session.get('mqQuestionVars');

},

previewText: function(){

var previewText = Session.get('questionPreview');
if(previewText){return previewText.text}

else{return ""}


},
previewAnswer: function(){
  var previewAnswer = Session.get('questionPreview');
  if(previewAnswer){return previewAnswer.answer}

else{  return ""}

},

questionMode:function(){

return Session.get('questionMode');

},
currentTitle:function(){

var currQuestion =  Questions.findOne({_id:Session.get('currentQuestion')});
if(currQuestion){return currQuestion.title}
else{return null}


},

isPublic:function(){

var currQuestionIndex =  Session.get('currentQuestion');
var currQuestion =  Questions.findOne({_id:currQuestionIndex});

if(currQuestion){

if(currQuestion.public===true){return 'checked' }

else{return ''}

}
else{return 'checked'}
}
})



Template.questionView.events({


    'click .addToQuiz':function(e,t){

  var questionText = t.$('.questionText').html();

  var answer = t.$('.questionAnswer').html();
  var newQuestion = {text:questionText,answer:answer,
  course:t.data.course,unit:t.data.unit,standard:t.data.standard,qid:t.data._id};
  //console.log(newQuestion);

  var curQuiz = Session.get('currentQuiz');
  curQuiz.push(newQuestion);
  Session.set('currentQuiz',curQuiz);
  t.$('.question').addClass('quizQuestionSelected');

  }

});
Template.questionView.onCreated(function(){
var template = Template.instance();

template.vars = new ReactiveVar(Template.instance().data.vars);
template.text = new ReactiveVar(Template.instance().data.text);
template.answer = new ReactiveVar(Template.instance().data.answer);
template.questionText = new ReactiveVar("");
template.questionAnswer = new ReactiveVar("");
//template.username = new ReactiveVar(Meteor.call('usernameFromID',Meteor.user()._id));
//console.log(template.vars.get());



  template.vars.set(processVariables(template.vars.get()));
  //console.log(template.vars.get());
  var mqQuestionText = template.text.get();
  var mqQuestionAns = template.answer.get();


  var vars = template.vars.get();

  vars.forEach(function(el){
    var re = new RegExp("@"+el.name+'\\b',"g")
    var varVal = el.value;
    mqQuestionText = mqQuestionText.replace(re,varVal);
    mqQuestionAns = mqQuestionAns.replace(re,varVal);
    //console.log(mqQuestionText);
  })

  template.questionText.set(mqQuestionText);
  template.questionAnswer.set(mqQuestionAns);

renderEquationsQV(template);
Template.instance().subscribe('users',{_id:Template.currentData().user});

});

Template.questionView.helpers({

questionText:function(t){

return Template.instance().questionText.get();


},
questionAnswer:function(){

return Template.instance().questionAnswer.get();

},
showHeader:function(){

return Session.get('questionViewShowHeader');

},
adminRights:function(){

var rights = (this.user==Meteor.user().username)|(Roles.userIsInRole(Meteor.user()._id,['admin-member','admin']));

if(rights){return rights}
return null;

}

})



Template.questionView.events({

  'click .reloadQuestion':function(e,t){
    e.preventDefault();
    template = t;
      template.vars.set(processVariables(template.vars.get()));
      //console.log(template.vars.get());
      var mqQuestionText = template.text.get();
      var mqQuestionAns = template.answer.get();


      var vars = template.vars.get();

      vars.forEach(function(el){
        var re = new RegExp("@"+el.name+'\\b',"g")
        var varVal = el.value;
        mqQuestionText = mqQuestionText.replace(re,varVal);
        mqQuestionAns = mqQuestionAns.replace(re,varVal);
        //console.log(mqQuestionText);
      })

      template.questionText.set(mqQuestionText);
      template.questionAnswer.set(mqQuestionAns);

    renderEquationsQV(template);



  }

})


Template.listQuestions.onCreated(function(){

  //this.subscribe('questions');


});

Template.listQuestions.onRendered(function(){

Session.set('mqQuestionVars',null);
Session.set('questionViewShowHeader',true);

})



Template.listQuestions.events({

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


Session.set('questionMode','Edit')
Session.set('currentCourseUnitStandard',courseUnitStandardObject);


Session.set('mqQuestionVars',this.vars);
Session.set('currentQuestion',this._id);




Variables.find().fetch().forEach(function(v){Variables.remove(v._id)})
this.vars.forEach(function(d){

  Variables.insert(d);

});

Router.go('/questions/edit/'+this._id+"/");


},
'click .questionCopy':function(e){
e.preventDefault();
var courseUnitStandardObject = {
course:this.course,
unit:this.unit,
standard:this.standard,

}

Session.set('questionMode','Copy')

Session.set('currentCourseUnitStandard',courseUnitStandardObject);

Session.set('mqQuestionVars',this.vars);
Session.set('currentQuestion',this._id);
Router.go('/questions/edit/'+this._id+"/");


}
})


Template.listQuestions.events({

})

Template.listQuestions.helpers({

question:function(){

  var searchObject = {};
  /*
  var questionStandardData = Session.get('currentCourseUnitStandard');

  if(questionStandardData){

  if(questionStandardData.course!=""){
    searchObject['course']=questionStandardData.course;
  }

  if(questionStandardData.unit!=''){
    searchObject['unit']=parseInt(questionStandardData.unit);
  }

  if(questionStandardData.standard!=''){
    searchObject['standard']=parseInt(questionStandardData.standard);
  }
  */
return Questions.find(searchObject);

},
allReady:function(){
return Template.instance().subscriptionsReady();

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


Template.listQuestions.onRendered(function(){
  var template = this;

        Session.set('currentCourseUnitStandard',{course:"",standard:"",unit:""});
        Session.set('mqQuestionVars',null);
        Session.set('questionViewShowHeader',true);

        Session.set('currentQuiz',[]);
        Session.set('quizzesAssigned',[]);


})



Template.questionAdd.onCreated(function(){

this.subscribe('questions',{_id:Session.get('selectedQuestion')});

})

Template.listQuestions.onCreated(function(){


});




/*

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
*/

Template.desmosView.events({
'keydown #desmos-input':function(e){
console.log($(e.target).val());
Session.set('desmos-exp',$(e.target).val());
}
});



function processVariables(vars){
  var codeHasErrors = false;

  if(vars.length!=0){
  vars.forEach(function(el,i){

  if(el.type=='rand-int'){

    var options = el.options;
    if(!options){
    el.options = {min: -10, max: 10, exclude: ""}

    }
    var exclude = el.options.exclude.trim();
    if(el.options.exclude.trim()!=''){
     exclude = exclude.split(',');
      exclude.forEach(function(e,i){

        exclude[i] = parseInt(e);

      })

    }
    else{
    exclude = []

    }

  el.value = Kh.randRangeExclude(el.options.min,el.options.max,exclude)

    }
    else if(el.type=='rand-dec'){

      el.value = (el.options.min + Math.random()*(el.options.max-el.options.min)).toFixed(el.options.DP);


    }
    else if(el.type=='calc-val'){

      var previousVars = vars.slice(0,i)
      var varText = el.text;
      previousVars.forEach(function(e){

      var re = new RegExp("@"+e.name+'\\b',"g")
      var varVal = e.value;

      varText = varText.replace(re,varVal);


    });

    try{
     el.value = eval(varText);
   }
   catch(e){

     console.log(e+", "+varText);
     console.log(el);
     codeHasErrors = true;

   }
    }
    else if(el.type=='customJS'){

      var previousVars = vars.slice(0,i)
      var varText = el.text;
      previousVars.forEach(function(e){

      var re = new RegExp("@"+e.name+'\\b',"g")
      var varVal = e.value;

      varText = varText.replace(re,varVal);


    });
    try{
     el.value = eval(varText);
   }
   catch(e){

     console.log(e+", "+varText+", "+el);
     codeHasErrors = true;
   }

    }


  })

if(!codeHasErrors){return vars;}
else{return 'code-error'}

}

}
function renderEquations(template){


var eqnsHTML = $('<div>'+Session.get('questionPreview').text + '</div>')
var eqnsText = $(eqnsHTML).find('eq');

      $(eqnsText).each(function(n,e){

      katex.render(e.innerText ,e);


    })


var ansHTML = $('<div>'+Session.get('questionPreview').answer + '</div>');
var ansText = $(ansHTML).find('eq');

          $(ansText).each(function(n,e){

          katex.render(e.innerText ,e);


        })

        Session.set('questionPreview',{text:$(eqnsHTML).html(),answer:$(ansHTML).html()});


}

function renderEquationsQV(template){


var eqnsHTML = $('<div>'+template.questionText.get() + '</div>')
var eqnsText = $(eqnsHTML).find('eq');

      $(eqnsText).each(function(n,e){

      katex.render(e.innerText ,e);


    })


var ansHTML = $('<div>'+template.questionAnswer.get() + '</div>');
var ansText = $(ansHTML).find('eq');

          $(ansText).each(function(n,e){

          katex.render(e.innerText ,e);


        })

        template.questionText.set($(eqnsHTML).html());
        template.questionAnswer.set($(ansHTML).html());


}

Template.variable.onCreated(function(){
  var template = this;
if(!template.data.varType){

template.varType = new ReactiveVar('rand-int');

}



});

Template.variable.onRendered(function(){
var template = this;
template.autorun(function(){
  Variables.find().fetch();
  template.$('[data-toggle="tooltip"]').tooltip();

})




})

Template.variable.events({

'change .varTypeSelect':function(e,t){

  Variables.update({_id:this._id},{$set:{type:$(e.target).val(),options:{}}})

},

'click .varDelete':function(e){
e.preventDefault();
//var vars = Session.get('mqQuestionVars');
vars = Variables.find().fetch();
if(vars.length>1){
Variables.remove(this._id);

}


},

'keyup .varID':function(e,t){

Variables.update({_id:this._id},{$set:{name:$(e.target).val()}})


},
'keyup .varRandInt':function(e,t){

var updatedVar = {};
updatedVar.options = {};
updatedVar.value = this.value;
var thisDiv = $(e.target).parent().parent();
updatedVar.options.min = parseInt(thisDiv.find('.varRandomIntMin').val())
updatedVar.options.max = parseInt(thisDiv.find('.varRandomIntMax').val())
updatedVar.options.exclude = thisDiv.find('.varRandomIntExclude').val()
Variables.update({_id:this._id},{$set:updatedVar});

},
'keyup .varRandDec':function(e){
  var updatedVar = {};
  updatedVar.options = {};
  updatedVar.value = this.value;
  var thisDiv = $(e.target).parent().parent();
  updatedVar.options.min = parseInt(thisDiv.find('.varRandomDecMin').val());
  updatedVar.options.max = parseInt(thisDiv.find('.varRandomDecMax').val())
  updatedVar.options.DP = parseInt(thisDiv.find('.varRandomDecDP').val())
  Variables.update({_id:this._id},{$set:updatedVar});


},
'keyup .varCalcValText':function(e){

Variables.update({_id:this._id},{$set:{text:$(e.target).val(),options:{}}});
},

'blur .varCustomJS':function(e){

  Variables.update({_id:this._id},{$set:{text:$(e.target).val(),options:{}}});

}

});

Template.variable.helpers({
isRandInt: function(){
return (this.type=='rand-int');
},
isRandDec: function(){
return (this.type=='rand-dec');
},
isCalcVal: function(){
return (this.type=='calc-val');
},
isCustomJS: function(){
return (this.type=='customJS');
}
})


function findVarIndex(array,indexVal){
var returnValue=-1;
array.forEach(function(e,i){
  //console.log(e.index+","+indexVal+","+i)
if(e.index===indexVal){
 returnValue = i;

}

});

return returnValue;

}

function processVariables(vars){
  var codeHasErrors = false;

  vars.forEach(function(el,i){

  if(el.type=='rand-int'){

    var options = el.options;
    if(!options){
    el.options = {min: -10, max: 10, exclude: ""}

    }
    var exclude = el.options.exclude.trim();
    var previousVars = vars.slice(0,i)

    previousVars.forEach(function(e){

    var re = new RegExp("@"+e.name+'\\b',"g")
    var varVal = e.value;

    exclude = exclude.replace(re,varVal);


  });

    if(el.options.exclude.trim()!=''){
     exclude = exclude.split(',');
      exclude.forEach(function(e,i){

        exclude[i] = parseInt(e);

      })

    }
    else{
    exclude = []

    }

  el.value = Kh.randRangeExclude(el.options.min,el.options.max,exclude)

    }
    else if(el.type=='rand-dec'){

      el.value = (el.options.min + Math.random()*(el.options.max-el.options.min)).toFixed(el.options.DP);


    }
    else if(el.type=='calc-val'){

      var previousVars = vars.slice(0,i)
      var varText = el.text;
      previousVars.forEach(function(e){

      var re = new RegExp("@"+e.name+'\\b',"g")
      var varVal = e.value;

      varText = varText.replace(re,varVal);


    });

    try{
     el.value = eval(varText);
   }
   catch(e){

     console.log(e+", "+varText);
     console.log(el);
     codeHasErrors = true;

   }
    }
    else if(el.type=='customJS'){

      var previousVars = vars.slice(0,i)
      var varText = el.text;
      previousVars.forEach(function(e){

      var re = new RegExp("@"+e.name+'\\b',"g")
      var varVal = e.value;

      varText = varText.replace(re,varVal);


    });
    varText = "(function(){" + varText + "})()";
    try{
     el.value = eval(varText);
   }
   catch(e){

     console.log(e+", "+varText+", "+el);
     codeHasErrors = true;
   }

    }


  })

if(!codeHasErrors){return vars;}
else{return 'code-error'}

}
