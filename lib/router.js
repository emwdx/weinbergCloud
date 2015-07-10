 Router.configure({ layoutTemplate: 'mainContent'  });
    
  Router.map(function() {
      
      this.route('defaultPage', {path: '/'});
      this.route('myReassessments', {path: '/myReassessments/'});
      this.route('showNextRetakes', {path: '/retakes/'});
      this.route('reassessEdit', {path: '/reassess/edit/'});
      this.route('reassessSignUp', {path: '/reassess/add/'});
      this.route('allUsers', {path: '/allUsers/'});
      this.route('gamesOfChance',{path:'/games/'});
      this.route('allWBCTotals',{path:'/wbTotals/'});
      this.route('setAnnouncement',{path:'setAnnouncement'});
      this.route('reviewpages',{path:'/review/'});
      this.route('addStandards',{path:'/standards/add/'});
this.route('viewStandards',{path:'/standards/view'});
      this.route('editStandards', { 
          path: '/standards/edit/:course/:unit/:standard/',
          data: function() { return  Standards.findOne({course:this.params.course,
                   unit:this.params.unit,
                   standard:this.params.standard}); }
      });
      this.route('viewStandard', { 
          path: '/standards/view/:course/:unit/:standard/',
          data: function() { return  Standards.findOne({course:this.params.course,
                   unit:this.params.unit,
                   standard:this.params.standard}); },
          waitOn:function(){
           return Meteor.subscribe('standard-links');   
          }
      });
  });