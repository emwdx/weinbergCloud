Template.questionAdd.events({
'click #submitQuestion':function(e,t){

e.preventDefault();
console.log(t.$('#questionText').val());
var questionObject={
vars: t.$('#questionVars').val(),
text: t.$('#questionText').val(),
course:parseInt(Session.get('currentCourseUnitStandard').course),
unit:parseInt(Session.get('currentCourseUnitStandard').unit),
standard:parseInt(Session.get('currentCourseUnitStandard').standard),
};
Questions.insert(questionObject);

},

'click #questionPreview':function(e,t){
Session.set('questionPreview',{});
  var questionObject={
  vars: t.$('#questionVars').val(),
  text: t.$('#questionText').val(),
  };

  if(questionObject.vars!=''&&questionObject.text!=''){
Session.set('questionPreview',questionObject);

  }
  else{

 Session.set('questionPreview',{});

  }

}


});

Template.questionAdd.helpers({

questionPreview:function(){


return Session.get('questionPreview');


}


})

Template.questionView.onRendered(function(){
  vars = Template.instance().findAll('var');

  var varNames = []

  vars.forEach(function(e){
  if($(e).attr('id')!='answer'){
  Template.instance()[$(e).attr('id')]=new ReactiveVar();
  var varText = $(e).html();
  varNames.forEach(function(e){

  var re = new RegExp("@"+e+'\\b',"g")
  varText = varText.replace(re,Template.instance()[e].get());

});
console.log(varText);

  Template.instance()[$(e).attr('id')].set(eval(varText));
  varNames.push($(e).attr('id'))

}
else{

   var answerText = $(vars[vars.length - 1]).html();
   var varString = '';
   varNames.forEach(function(e){
    varString += ("var "+e + "="+Template.instance()[e].get()+";");


  });

   varString+=answerText;
   varNames.push('answer');
  Template.instance()['answer']= new ReactiveVar();
   Template.instance()['answer'].set(eval(varString));
   Template.instance()['varNames'] = new ReactiveVar();
   Template.instance()['varNames'].set(varNames);
console.log(varString);

}
});

var question = this.find('.question');
if(question!=[]){
var questionHTML = $(question).html();
varNames.forEach(function(e){

var re = new RegExp("@"+e+'\\b',"g")

questionHTML = questionHTML.replace(re,Template.instance()[e].get());


})
//console.log(questionHTML);
$(question).html(questionHTML);

      eqns = Template.instance().findAll('eq');

      eqns.forEach(function(e){

      katex.render(e.innerText,e);

    })

//console.log(Template.instance());
}
});

Template.questionView.helpers({

answerValue:function(t){

return t.answer.get();


}

})

Template.khan.events({

'click .questionDelete':function(e){
e.preventDefault();
var check = confirm("Are you sure?");
if(check){

Questions.remove({_id:this._id});


}


}


})


Template.questionVars.onRendered(function(){





this.$(".vars").hide();

});


Template.khan.helpers({

question:function(){

return Questions.find();

}

});

Template.courseUnitStandard.helpers({

courses:function(){

  return getNames(Standards,'course')


},
units:function(){
  var units = [];
  var currentCourse=Session.get('currentCourseUnitStandard').course;
  standardsCourses = Standards.find({course:currentCourse,active:true},{sort:{unit:1,standard:1}});
  standardsCourses.forEach(function(e){
  if(!_.contains(units,e.unit)){
    units.push(e.unit);

  }

});
return units.sort();
},
standards:function(){
var units = [];
var currentCourse=Session.get('currentCourseUnitStandard').course;
standardsCourses = Standards.find({course:currentCourse,active:true},{sort:{unit:1,standard:1}});
standardsCourses.forEach(function(e){
if(!_.contains(units,e.standard)){
  units.push(e.standard);

}


});



return units.sort();
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


})
