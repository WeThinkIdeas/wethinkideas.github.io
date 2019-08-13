import {Experiments} from '../../../lib/collections/experiments.js';

function checkAction(name){
	console.log(Session.get('action'));
		if(Session.get('action')==name){
			return true;
		} else {
			return false;
		}
}

Template.Experiments.onCreated(function(){
		Meteor.subscribe('experiments');
});

Template.Experiments.helpers({
	isExperimentList(){
		return checkAction('experiment.list')
	},
	isStepOne(){
	 return checkAction('step.one')
	}
});

Template.ExperimentList.helpers({
		experiments(){
			return Experiments.find({userId:Meteor.userId()});
		}
});




Template.Experiments.events({
	'click #createExperiment'(){
			Experiments.insert({name:'Draft',type:'problemsolving',userId:Meteor.userId()},function(err,result){
				if(result){
						 Router.go("experiment.form",{_id:result});
				}
			});
	},
	'click #experiment'(){
		 Router.go("experiment.form",{_id:this._id});
	}
});
