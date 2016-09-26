Template.mathQuillDemo.onRendered(function(){


jQuery(function() {
  jQuery('.mathquill-editable:not(.mathquill-rendered-math)').mathquill('editable');
  jQuery('.mathquill-textbox:not(.mathquill-rendered-math)').mathquill('textbox');
  jQuery('.mathquill-embedded-latex').mathquill();
});



});

Template.mathQuillDemo.onCreated(function(){

Session.set('mqQuestionVars',[{name:"var1",value:null,type:'rand-int',index:1}]);


});

Template.mathQuillDemo.helpers({

vars: function(){

return Session.get('mqQuestionVars');

}
})

Template.mathQuillDemo.events({

'click #addVar':function(e){
e.preventDefault();
var vars = Session.get('mqQuestionVars');
var indices = _.pluck(vars,'index');
var newIndex = (indices.sort()[vars.length - 1]+1);
vars.push({name:("var"+(newIndex)),value:null,type:'rand-int',index:newIndex});
Session.set('mqQuestionVars',vars);

},
'click .varDelete':function(e){
e.preventDefault();
var vars = Session.get('mqQuestionVars');
if(vars.length>1){
var selectedIndex = findVarIndex(vars,this.index);
vars.splice(selectedIndex,1)

Session.set('mqQuestionVars',vars);
}
},
'keyup .varID':function(e){

var vars = Session.get('mqQuestionVars');
var selectedIndex = findVarIndex(vars,this.index);
vars[selectedIndex].name = $(e.target).val()
Session.set('mqQuestionVars',vars);

},
'keyup .varRandInt':function(e){

var vars = Session.get('mqQuestionVars');
var selectedIndex = findVarIndex(vars,this.index);
vars[selectedIndex].options = {};
vars[selectedIndex].value = null;
var thisDiv = $(e.target).parent().parent();
vars[selectedIndex].options.min = parseInt(thisDiv.find('.varRandomIntMin').val())
vars[selectedIndex].options.max = parseInt(thisDiv.find('.varRandomIntMax').val())
vars[selectedIndex].options.exclude = thisDiv.find('.varRandomIntExclude').val()
Session.set('mqQuestionVars',vars);

},
'keyup .varRandDec':function(e){

var vars = Session.get('mqQuestionVars');
var selectedIndex = findVarIndex(vars,this.index);
vars[selectedIndex].options = {};
vars[selectedIndex].value = null;
var thisDiv = $(e.target).parent().parent();
vars[selectedIndex].options.min = parseInt(thisDiv.find('.varRandomDecMin').val());
vars[selectedIndex].options.max = parseInt(thisDiv.find('.varRandomDecMax').val())
vars[selectedIndex].options.DP = parseInt(thisDiv.find('.varRandomDecDP').val())
Session.set('mqQuestionVars',vars);

},
'blur .varCalcValText':function(e){
var vars = Session.get('mqQuestionVars');
var selectedIndex = findVarIndex(vars,this.index);
vars[selectedIndex].options = {};
var thisDiv = $(e.target).parent().parent();
vars[selectedIndex].value = $(e.target).val()
Session.set('mqQuestionVars',vars);

},

'blur .varCustomJS':function(e){
  var vars = Session.get('mqQuestionVars');
  var selectedIndex = findVarIndex(vars,this.index);
  vars[selectedIndex].options = {};
  var thisDiv = $(e.target).parent().parent();
  vars[selectedIndex].value = $(e.target).val()
  Session.set('mqQuestionVars',vars);


},

'click #mqPreviewQuestion':function(e){
e.preventDefault();
vars = Session.get('mqQuestionVars');
vars.forEach(function(el,i){

if(el.type=='rand-int'){
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
    previousVars.forEach(function(e){

    var re = new RegExp("@"+e.name+'\\b',"g")
    var varVal = e.value;
    el.value = el.value.replace(re,varVal);

  });

   el.value = eval(el.value);


  }

})
Session.set('mqQuestionVars',vars);

var mqQuestionText = $('#mqQuestionText').mathquill('latex');
vars.forEach(function(el){
  var re = new RegExp("@"+el.name+'\\b',"g")
  var varVal = el.value;
  mqQuestionText = mqQuestionText.replace(re,varVal);


})
console.log(mqQuestionText);
$('#mqQuestionText').mathquill('cmd',mqQuestionText);

}


})

Template.registerHelper('incIndex',function(e){


return (e+1);

})
