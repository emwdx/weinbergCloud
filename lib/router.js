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
          path: '/standards/edit/:id/',
          data: function() { return  Standards.findOne({_id:this.params.id}); }
      });
      this.route('viewStandard', {
          path: '/standards/view/:id/',
          data: function() { return Standards.findOne({_id:this.params.id}); },
          waitOn:function(){
           return Meteor.subscribe('standard-links');
         },
         onBeforeAction: function() {
        Session.set('standardSelectedView', this.params.id);

        this.next();
    }
      });
      this.route('adminTemplate',{path:'/admin/'});

      this.route('myCredits',{path:'/credits/'});
      this.route('questionAdd', {
      template:'questionAdd',
        path: '/questions/edit/:id/',
        data: function() { return  Questions.findOne({_id:this.params.id}); },
        onBeforeAction: function() {
       Session.set('selectedQuestion', this.params.id);

       this.next();
       }

    });
      this.route('quizzesViewAll',{path:'/allQuizzes/'});
      this.route('quizView', {
        path: '/quizzes/view/:id/',
        data: function() { return  Quizzes.findOne({_id:this.params.id}); },
        onBeforeAction: function() {
       Session.set('quizCurrentlyViewing', this.params.id);
       this.next();
       }
    });
    this.route('quizzesViewMine',{path:'/myQuizzes/'});
    this.route('listQuestions',{path:'/list-questions/'});
    this.route('desmos',{path:'/desmos/'});
    this.route('mathQuillDemo',{path:'/math-quill-demo/'})
    this.route('/data',function(){
      var req = this.request;
  var res = this.response;
  
  res.end(JSON.stringify(Standards.find().fetch()))
    },{where:'server'})
  });
Router.onBeforeAction(requireTeacher, {only:['quizzesViewAll','questionAdd','adminTemplate','addStandards']});


function requireTeacher(){
var currentUser = Meteor.user();
if (!currentUser) {

    Session.set('currentURL',Router.current().path);
    if (Meteor.loggingIn()){            this.render(this.loadingTemplate);
}

}
else{

var allowed = Roles.userIsInRole(Meteor.user(),['teacher','admin']);

if(!allowed){
    alert("You are not permitted to access that page.")
    Router.go('/');
    }

 this.next()

};
}
