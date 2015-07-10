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


Template.reassessSignUp.helpers({
      
  daysObject: getFiveDays,
  isWeekend: function(){
         today = new Date();
         return (today.getDay()==0|today.getDay()==6);
         
    },
  hasEnoughCredits: function(){
     currentUser = Meteor.user()
     allCredits = Credits.find({user:currentUser.emails[0].address,used:0}).fetch();
     numOfCredits = allCredits.length;
     return (numOfCredits>0)
    
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
    
 var newRetake = {
                course: $('body').find('[name=course]').val(),
				unit: $('body').find('[name=unit]').val(),
				standard: $('body').find('[name=standard]').val(),
				time: $('body').find('[name=time]').val(),
				day: $('body').find('[name=date]').val(),
                grade: $('body').find('[name=grade]').val(),
				completed: 'false',
				user: Meteor.user().emails[0].address
               

 }
 console.log(newRetake);
 currentUser = Meteor.user();
 
 Reassessments.insert(newRetake, function(error,result){
 Session.set('isSubmittingReassessment',true);    
  if(result){
    Router.go('/myReassessments/');  
           
                currentCredit=Credits.findOne({user:currentUser.emails[0].address, used:0});
 
            Credits.update({_id:currentCredit._id},{$set:{used:1}});  
             Session.set('isSubmittingReassessment',false);
Session.set("standardFound",false);
            }   
   else{
       alert('Your reassessment did not go through. Please try again later.');
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
var unit = $(inputs[1]).val();
var standard = $(inputs[2]).val();
var response = Standards.findOne({unit:unit,standard:standard,course:course});

if(response){
    
Session.set("standardFound",response);    
}
else{
Session.set("standardFound",false);    
}
    
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
        
    }
      
    
});

UI.registerHelper("selectedIf",function(value1,value2){
  return (value1==value2)?"selected":"";
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
	unit: $('#reassessEditForm').find('[name=unit]').val(),
	standard:$('#reassessEditForm').find('[name=standard]').val(),
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
var unit = $(inputs[1]).val();
var standard = $(inputs[2]).val();
var response = Standards.findOne({unit:unit,standard:standard,course:course});

if(response){
    
Session.set("standardFound",response);    
}
else{
Session.set("standardFound",false);    
}
    
}
   
    
    
});
    
Template.myReassessments.helpers({
    
reassessments: function(){
    
    return Reassessments.find({user:Meteor.user().emails[0].address,completed:'false'});
    
}

    
    
});
    
Template.reassessmentTemplate.events({
    
    'click .cancelReassessment': function(e){
    e.preventDefault(); 
    currentUser = Meteor.user();
    if(currentUser.emails[0].address=='eweinberg@scischina.org'){
    currentCredit = Credits.findOne({user:this.user, used:1});    
    Credits.update({_id:currentCredit._id},{$set:{used:0}});      
    }
    else{
    currentCredit = Credits.findOne({user:currentUser.emails[0].address, used:1});
    Credits.update({_id:currentCredit._id},{$set:{used:0}});   
  
    
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
    


    
Template.showNextRetakes.helpers({
        reassessments: function(){
            
         return Reassessments.find({day: Session.get('currentDay'),completed:'false'},{sort:{time: 1, course: -1}});
            
        },
        daysObject:getFiveDays
    
    
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
    if(currentUser.emails[0].address=='eweinberg@scischina.org'){
    currentCredit = Credits.findOne({user:this.user, used:1});    
    Credits.update({_id:currentCredit._id},{$set:{used:0}});      
    }
    else{
    currentCredit = Credits.findOne({user:currentUser.emails[0].address, used:1});
    Credits.update({_id:currentCredit._id},{$set:{used:0}});   
  
    
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
  
    Reassessments.update({_id:this._id},{$set:{completed:'true'}});
        
        
    }
});

