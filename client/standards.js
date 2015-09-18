Template.addStandards.events({
'click #addStandardsButton':function(e){
e.preventDefault();
var emptyInputs = 0;
var addStandardsInputs = $('.addStandardsInput');
 addStandardsInputs.each(function(){

 if($(this).val()==""){
  emptyInputs++;
}

 });

if($('body').find('[name=addStandardCourse]').val()==""){

var courseName = $('#addNewStandardName').val();

}
else{

var courseName = $('body').find('[name=addStandardCourse]').val()

}

if(emptyInputs==0 && courseName !='' && Session.equals("standardAlreadyExists",false)){
var course = courseName;
var unit = parseInt($('body').find('[name=addStandardUnit]').val());
var standard = parseInt($('body').find('[name=addStandardStandard]').val());
var title = $('body').find('[name=addStandardTitle]').val();
var description = $('body').find('[name=addStandardDescription]').val();
var user = Meteor.user();
var standardsObject =
    {course:course,
     unit:unit,
    standard:standard,
    title:title,
    description:description,
    user:user.emails[0].address}

Standards.insert(standardsObject,function(error,result){
 if(result){$(".addStandardsInput").val('');
           alert('success!');
           }

});

}
else{ alert("Missing input");}

},

'change .addStandardsInput':function(e){
var inputs = $(".addStandardsInput")
var course = $(inputs[0]).val();
var unit = parseInt($(inputs[1]).val());
var standard = parseInt($(inputs[2]).val());
var response = Standards.findOne({unit:unit,standard:standard,course:course});

if(response){

Session.set("standardAlreadyExists",true);
}
else{
Session.set("standardAlreadyExists",false);
}

}

});

Template.addStandards.helpers({
standardAlreadyExists:function(){ return Session.equals('standardAlreadyExists',true);
},
courseNames:function(){

return getNames(Standards,'course')
}
});

Template.viewStandards.helpers({
standards: function(){
var selected = Session.get("currentlySelectedCourse");
return Standards.find({course:selected},{sort:{unit:1,standard:1}});
},
courseNames:function(){

return getNames(Standards,'course')
},

active:function(){

if(this.active==true){return 'checked'}
else{return ''}

}


});

Template.viewStandards.events({
'change #viewStandardsSelectCourse':function(e){
Session.set("currentlySelectedCourse",$("#viewStandardsSelectCourse").val());

},
'change .standardActive':function(e){
var bool = $(e.target).is(":checked");
Standards.update({_id:this._id},{$set:{active:bool}})


},
'click .deleteStandard':function(e){

e.preventDefault();
var resp = confirm("Are you sure you want to delete Standard" + this.unit+"."+this.standard+"?");
if(resp){

Standards.remove({_id:this._id});

}

}

});

Template.editStandards.events({
'click #editStandardsButton':function(e){
e.preventDefault();
var course = $('#editStandardCourse').val();
var unit = parseInt($('#editStandardUnit').val());
var standard = parseInt($('#editStandardStandard').val());
var title = $('#editStandardTitle').val();
var description = $('#editStandardDescription').val();
var user = Meteor.user();
var standardsObject =
    {course:course,
     unit:unit,
    standard:standard,
    title:title,
    description:description,
    user:user.emails[0].address}
var currentStandard = Standards.findOne({course:course,unit:unit,standard:standard});
Standards.update({_id:currentStandard._id},{$set:standardsObject},function(error,result){
 if(result){Router.go('/standards/view');

           }
 else{alert("error");}

});

}


});

Template.editStandards.rendered = function(){
$("#editStandardCourse").val(Session.get("currentlySelectedCourse"));

}

Template.submitStandardLink.events({
'click #standardLinkButton':function(e){
e.preventDefault();
var URL = $("#submitLinkURL").val();
var title = $("#submitLinkTitle").val();
var course = $("#submitLinkCourse").html();
var unit = parseInt($("#submitLinkUnit").html());
var standard = parseInt($("#submitLinkStandard").html());
var user = Meteor.user()._id;
var upvotes = 0;
var votes = [];
var linkObject = {url:URL,title:title,course:course,unit:unit,standard:standard,user:user,upvotes:upvotes,votes:votes};
Links.insert(linkObject,function(error,result){
if(result){
$("#submitLinkURL").val("");
$("#submitLinkTitle").val("");
}
else{alert("There was a problem submitting this link")}

});

}

});



Template.viewStandard.helpers({
links: function(){
var data = Session.get("standardSelectedView");
var standard = Standards.findOne({_id:data});
var links =  Links.find({course:standard.course,unit:standard.unit, standard:standard.standard});
if(links){return links}
else{ return null};
},
currentlySelectedStandard:function(){

return Session.get("standardSelectedView");

}

});
