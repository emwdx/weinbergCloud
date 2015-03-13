Template.reviewpages.helpers({
    
    reviewpage: function(){
        
     var reviewpages = ReviewPages.find({},{sort:{standard:-1}});
     return reviewpages;
        
    },
    shouldShow: function(){
        
     return (this.url!='')&&(this.grade==Meteor.user().profile.grade);   
        
    },
    myValue: function(){
        
     var myPage = ReviewPages.findOne({userId:Meteor.user()._id});
     if(myPage){
     return myPage.standard;
     }
        else{return null}
        
    },
    myPage: function(){
        
     var myPage = ReviewPages.findOne({userId:Meteor.user()._id});
     if(myPage){
     return myPage.url;
     }
    else{return null}
    },
    myCode: function(){
     var myPage = ReviewPages.findOne({userId:Meteor.user()._id});    
     if(myPage){
     return myPage._id;   
     }
        
    }
        
        
    
    
    
});
    
Template.reviewpages.events({
    
   'click #submitReviewPage': function(e){
    e.preventDefault();
    var url = $('#reviewURL').val();
    var standard = parseFloat($('#reviewStandardText').val());
    var myPage = ReviewPages.findOne({userId:Meteor.user()._id})
    ReviewPages.update({_id:myPage._id},{$set:{standard:standard,url:url}});
       
       
   },
    
    'click .upvote': function(e) {
        e.preventDefault();
        page = ReviewPages.findOne({_id:this._id});
        var weinbergApproved = (_.include(page.upvoters, "iFWh2dj9kp5JBtmve")||(Meteor.user().emails[0].address=='eweinberg@scischina.org'))
        if(weinbergApproved){
        var verified = prompt('Please enter the code from the webpage');
        if(verified==this._id){
        
        Meteor.call('upvote', this._id); 
        }
        
        }
        else{ alert("Mr. Weinberg hasn't approved this page yet. Ask the author of the post for details.");}
    }
});
Template.postItem.helpers({
    
    
    hasVoted: function(){
        
     var user = Meteor.user();
     page = ReviewPages.findOne({_id:this._id});
     if(_.include(page.upvoters, user._id)){
     return true;
           }
      else{  return false;}
        
        
    },
    weinbergApproved: function(){
    page = ReviewPages.findOne({_id:this._id});
     if(_.include(page.upvoters, "iFWh2dj9kp5JBtmve")){
     return true;
           }
      else{  return false;}
        
        
    },
    isWeinberg: function(){
        
      return (Meteor.user().emails[0].address=='eweinberg@scischina.org');     
        
    }
    
});
