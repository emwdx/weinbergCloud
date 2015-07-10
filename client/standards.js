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

if(emptyInputs==0 && Session.equals("standardAlreadyExists",false)){
var course = $('body').find('[name=addStandardCourse]').val();
var unit = $('body').find('[name=addStandardUnit]').val();
var standard = $('body').find('[name=addStandardStandard]').val();
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
var unit = $(inputs[1]).val();
var standard = $(inputs[2]).val();
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
                                }
});

Template.viewStandards.helpers({
standards: function(){
var selected = Session.get("currentlySelectedCourse");
return Standards.find({course:selected},{sort:{unit:1,standard:1}});    
}


});

Template.viewStandards.events({
'change #viewStandardsSelectCourse':function(e){
Session.set("currentlySelectedCourse",$("#viewStandardsSelectCourse").val());    
    
}
    
});

Template.editStandards.events({
'click #editStandardsButton':function(e){
e.preventDefault();
var course = $('#editStandardCourse').val();
var unit = $('#editStandardUnit').val();
var standard = $('#editStandardStandard').val();
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
var unit = $("#submitLinkUnit").html();
var standard = $("#submitLinkStandard").html();
var user = Meteor.user();
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
var links =  Links.find({course:data.course,unit:data.unit,standard:data.standard});
if(links){return links}
else{ return null};
}
    
});
Template.viewStandard.rendered = function(data){
   
Session.set("standardSelectedView",this.data);    
}