import {Experiments} from '../../../lib/collections/experiments.js';
import {ExperimentLearnings} from '../../../lib/collections/experimentlearnings.js';
import {checkInput,isValid} from '../../lib.js';
import {saveOnEnterPressed,deleteOnBackspace,saveOrUpdate} from '../../lib.js';
import {MentalModels} from '../../../lib/collections/mentalmodels.js';
import {ExperimentApplications} from '../../../lib/collections/experimentapplications.js';
import {ModelSteps} from '../../../lib/collections/modelsteps.js';
import {Frameworks} from '../../../lib/collections/frameworks.js';
import {FrameworkPrinciples} from '../../../lib/collections/frameworkprinciples.js';


Template.ExperimentForm.events({
	'click #saveexperiment'(){
				Router.go('/playground');
	},
	'click #deleteexperiment'(){
		Experiments.remove(this.id);
						Router.go('/playground');

	},
	'change #input-experiment-name'(event){
		Experiments.update(this.id,{$set:{name:event.target.value}});
	},
	'change #input-experiment-problem'(event){
		Experiments.update(this.id,{$set:{problem:event.target.value}});
	},
	'keyup #model-search-name'(event){
		Session.set('searchmodel',event.target.value);
		Meteor.subscribe('modelsearch',event.target.value);
	},
	'keyup #framework-search-name'(event){
		Session.set('searchframework',event.target.value);
	},
	'click #applyMentalModel'(){
		Meteor.subscribe('mentalmodels');
		Session.set('searchmodel',undefined);
	},
	'click #applyFramework'(){
			Meteor.subscribe('frameworks');
			Session.set('searchframework',undefined);
	},
	'click #deleteexperimentapplication'(){
		ExperimentApplications.remove(this._id);
	},
	'click #model'(){
		$("#search-model").modal("hide");
		var self=this;
		Meteor.call('getApplicationSteps','model',this._id,function(error,success){
			if(success){
				ExperimentApplications.insert({type:'model',userId:Meteor.userId(),procedure:success,experimentId:Session.get('experimentId'),name:self.name});
			}
		});
	},
	'click #framework'(){
			$("#search-framework").modal("hide");
			var self=this;
			Meteor.call('getApplicationSteps','framework',this._id,function(error,success){
					if(success){
						ExperimentApplications.insert({type:'framework',userId:Meteor.userId(),procedure:success,experimentId:Session.get('experimentId'),name:self.name});
					}
			});
		},
	'change textarea'(event){
		ExperimentApplications.update(this._id,{$set:{procedure:event.target.value}});
	}
});




Template.ExperimentForm.helpers({
	'experiment'(){
		  Session.set('experimentId',this.id);
			Meteor.subscribe('experiment',this.id);
			Meteor.subscribe('experimentapplications',this.id);
			Meteor.subscribe('experimentlearnings',this.id);

			return Experiments.findOne({_id:this.id});
	},
	'experimentapplications'(){
		return ExperimentApplications.find({experimentId:Session.get('experimentId'),userId:Meteor.userId()});
	},
	'searchedmodels'(){
		if(Session.get('searchmodel')!=undefined){
			var regex = new RegExp('^' + Session.get('searchmodel'), 'i');
			return MentalModels.find({userId:Meteor.userId(),name:{$regex : regex}});
		} else {
			return MentalModels.find({$or:[{userId:Meteor.userId()},{public:true}]});
		}
	},
	'searchedframeworks'(){
			if(Session.get('searchframework')!=undefined){
				return Frameworks.find({userId:Meteor.userId(),name:{$regex : ".*"+Session.get('searchframework')+".*"}});
			} else {
				return Frameworks.find({$or:[{userId:Meteor.userId()},{public:true}]});
			}
		}
});




Template.Learnings.events({
'keypress input'(event){
	data = ({userId:Meteor.userId(), learning:event.target.value, experimentId: Session.get('experimentId'),status:'published'});
	saveOnEnterPressed(event, ExperimentLearnings, data);
},
'keyup input'(event){
	deleteOnBackspace(event, ExperimentLearnings);
},
'change input'(event){
	data = ({userId:Meteor.userId(), learning:event.target.value, experimentId: Session.get('experimentId'),status:'published'});
	saveOrUpdate(event, ExperimentLearnings, data);
}
});

Template.Learnings.helpers({
	learnings(){
		return ExperimentLearnings.find({userId:Meteor.userId(), status:'published', experimentId:Session.get('experimentId'),status:'published'});
	},
	checkSize(learnings){
	if(learnings!=null && learnings.fetch().length>10){
		return false;
	} else {
		return true;
	}
	}
});
