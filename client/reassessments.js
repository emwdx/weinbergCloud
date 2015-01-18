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
  if(result){$('#reassessSignUp').modal('hide');
           
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
    }
      
    
});
    
Template.reassessEdit.events({
    
   'click #updateReassessment': function(e){
    e.preventDefault();
    var emptyInputs = 0;
 var reassessInputs = $('.reassessSelect');
 reassessInputs.each(function(){
 
 if($(this).val()==0){
  emptyInputs++;   
     
 }

 });
    if(emptyInputs==0){
    updateReassessmentObject = {
    course:$('#reassessEdit').find('[name=course]').val(),
	unit: $('#reassessEdit').find('[name=unit]').val(),
	standard:$('#reassessEdit').find('[name=standard]').val(),
	time: $('#reassessEdit').find('[name=time]').val(),
	day: $('#reassessEdit').find('[name=date]').val(),
    grade:$('#reassessEdit').find('[name=grade]').val()
    }
    Reassessments.update({_id:Session.get('currentReassessmentID')},{$set:updateReassessmentObject});
    $('#reassessEdit').modal('hide');
       
   }
 else{
     
     
  alert("Make sure you choose something for each input.");     
     
 }
   }
    
});
    
Template.myReassessments.helpers({
    
reassessments: function(){
    
    return Reassessments.find({user:Meteor.user().emails[0].address,completed:'false'});
    
}

    
    
});
    
Template.myReassessments.events({
    
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
     $('#reassessEdit').find('[name=course]').val(this.course)
	 $('#reassessEdit').find('[name=unit]').val(this.unit)
	 $('#reassessEdit').find('[name=standard]').val(this.standard)
	 $('#reassessEdit').find('[name=time]').val(this.time)
	 $('#reassessEdit').find('[name=date]').val(this.day)
	 Session.set('currentReassessmentDay',this.day);
     Session.set('currentReassessmentID',this._id);
    $('#reassessEdit').modal('show');
        
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
        
    },
    'click .completeReassessment': function(e){
    e.preventDefault();    
  
    Reassessments.update({_id:this._id},{$set:{completed:'true'}});
        
        
    },
    'click .cancelReassessment': function(e){
    e.preventDefault();
    currentUser = Meteor.user();
    currentCredit = Credits.findOne({user:this.user, used:1});
    Credits.update({_id:currentCredit._id},{$set:{used:0}});   
  
    Reassessments.remove({_id:this._id});
        
        
    }
    
    
});

