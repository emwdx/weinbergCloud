  if(Meteor.user){
      Meteor.subscribe('reassessments');
      Meteor.subscribe('users');
      Meteor.subscribe('credits');
      Meteor.subscribe('systemVariables');
      Meteor.subscribe('reviewpages');
      Meteor.subscribe('standards');
      Meteor.subscribe('standard-links');
      Meteor.subscribe('weinbergcash')

  }


Template.allUsers.helpers({

userProfiles:function(){

var searchObject = {};


if(Session.get('currentTeacher')!="0"){
  searchObject['profile.teacher']=Session.get('currentTeacher');
}

if(Session.get('currentCourse')!="0"){

  searchObject['profile.courses']=Session.get('currentCourse');
  
}



 return Meteor.users.find(searchObject);
},

     reassessCourse:function(){
       var teacherCourses = Meteor.user().profile.courses;
       var courses = [];
       standardsCourses = Standards.find({course:{$in:teacherCourses}});
       standardsCourses.forEach(function(e){
       if(!_.contains(courses,e.course)){
         courses.push(e.course);

       }

     });

     return courses;

   },
   teacherUser: function(){
     var teachers = [];
     teacherUsers = Roles.getUsersInRole(['teacher','admin']);

     teacherUsers.forEach(function(e){
      var currentTeacher = Meteor.users.findOne({_id:e._id});
     if(!_.contains(teachers,currentTeacher.emails[0].address)){
       teachers.push(currentTeacher.emails[0].address);

     }

   });

   return teachers;


 }




});

Template.allUsers.events({

'click .addCredit': function(e){

e.preventDefault();
e.stopPropagation();

if($('#userCourseSelect').val()!=''){

  var currentUser = Meteor.user();
  var newCreditObject = {
  user: this.emails[0].address,
  credits:1,
  used: false,
  createdOn: new Date(),
  schoolYear:"15-16",
  course:Session.get('currentCourse')
  }

Credits.insert(newCreditObject);


}

else{

alert('Select which course you want to assign credits.')

}
},
'click .removeCredit': function(e){
  e.preventDefault();
  e.stopPropagation();

if($('#userCourseSelect').val()!=''){

currentUser = Meteor.users.findOne({_id:this._id});
currentCredit = Credits.findOne({user:currentUser.emails[0].address,course:$('#userCourseSelect').val()});
if(currentCredit){
Credits.remove(currentCredit._id);

}

}
else{

alert('Select which course you want to assign credits.')

}

},


'change #userCourseSelect':function(e){
e.preventDefault();
Session.set('currentCourse',$(e.target).val());

},
'change #userTeacherSelect':function(e){
e.preventDefault();
Session.set('currentTeacher',$(e.target).val());


}

});


Template.allUsers.rendered = function(){

$('#userCourseSelect').val(Session.get('currentCourse'));
$('#userTeacherSelect').val(Meteor.user().emails[0].address);

};

Template.creditBadge.helpers({

numberOfCredits: function(){
     currentUser = Meteor.users.findOne({_id:this._id})
     currentCourse = Session.get('currentCourse');
     allCredits = Credits.find({user:currentUser.emails[0].address,used:false,course:currentCourse}).fetch();
     numOfCredits = allCredits.length;
     return numOfCredits;

}

});

Template.myCreditsBadge.helpers({

numberOfCredits: function(){
     currentUser = Meteor.user();
     currentCourse = Session.get('currentCourse');
     allCredits = Credits.find({user:currentUser.emails[0].address,used:false,course:currentCourse}).fetch();
     numOfCredits = allCredits.length;
     return numOfCredits;

}

});

Template.userProfile.helpers({

courses:function(){return getNames(Standards,'course')},
teacherUser:function(){
  var teachers = [];
  teacherUsers = Roles.getUsersInRole(['teacher','admin']);

  teacherUsers.forEach(function(e){
   var currentTeacher = Meteor.users.findOne({_id:e._id});
  if(!_.contains(teachers,currentTeacher.emails[0].address)){
    teachers.push(currentTeacher.emails[0].address);

  }

  });

  return teachers;

},
hasCourse:function(course){


    if(_.contains(Template.instance().courses.get(),course)){

     return "checked";

   }

}

});



Template.userProfile.events({

'click .updateProfile':function(e,t){

e.preventDefault();
e.stopPropagation();
var profileCourses = [];
var studentName = t.$("#profileUserName").val();
var teacher = t.$("#userSelectTeacher").val();

coursesSelected = t.$(".checkbox-inline");

console.log(coursesSelected);
coursesSelected.each(function(index,f){

  var courseSelected = $(f).find('.userHasCourse');

  if($(courseSelected).is(':checked')){
    var courseName = $(f).find(".courseName").text();
    profileCourses.push(courseName);

  }


});
var newProfile={
courses:profileCourses,
realName:studentName,
teacher:teacher
};

var currentID = this._id;
Meteor.users.update({_id:this._id},{$set:{profile:newProfile}},function(error,result){

if(result){

$("#collapse_"+currentID).removeClass('in');


}

});


}

})

Template.userProfile.onCreated(function(){
       this.courses = new ReactiveVar(null)
   });

Template.userProfile.onRendered(function(){

this.courses.set(this.data.profile.courses);

})
