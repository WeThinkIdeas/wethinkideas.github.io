Template.Nav.helpers({
	link_status(page){
		if(Router.current().route.path(this)==page)
		{
			return "active";
		} else {
			return "";
		}

	},
	loggedIn(){
		if(Meteor.userId()){
			return true;
		} else {
			return false;
		}
	}
});

Template.Nav.events({
'click #playground'(){
	Session.set('action','experiment.list');
}
});
