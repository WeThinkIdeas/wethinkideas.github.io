import {MentalModels} from '../../../lib/collections/mentalmodels.js';
import {checkInput,isValid} from '../../lib.js';
import { Session } from 'meteor/session'
import {ModelSteps} from '../../../lib/collections/modelsteps.js';
import {saveOnEnterPressed,deleteOnBackspace,saveOrUpdate} from '../../lib.js';


function showErrorMessage(message){
		$("#error_message").text(message);
		$(".alert").show();
}

Template.MentalModels.helpers({
	mentalmodels(){
		return MentalModels.find({$or:[{userId:Meteor.userId()},{public:true}]});
	}
});

function processData(data){
		var currentModelId = Session.get('currentModelId');
		if(isValid(currentModelId)){
			data["status"]="published";
			data["modelId"] = currentModelId;
		} else {
			data["status"] = "draft";
		}
		return data;
}



Template.MentalModelSteps.events({
'keypress input'(event){
	data = processData({userId:Meteor.userId(), step:event.target.value});
	saveOnEnterPressed(event, ModelSteps, data);
},
'keyup input'(event){
	deleteOnBackspace(event, ModelSteps);
},
'change input'(event){
	data = processData({userId:Meteor.userId(), step:event.target.value});
	saveOrUpdate(event, ModelSteps, data);
}
});

Template.MentalModelSteps.helpers({
	modelsteps(){
		var currentModelId = Session.get('currentModelId');
		console.log(currentModelId);
		if(isValid(currentModelId)){
					return ModelSteps.find({status:'published', modelId:currentModelId});
		} else {
					return ModelSteps.find({userId:Meteor.userId(), status:'draft'});
		}
	},
	checkSize(modelsteps){
	if(modelsteps!=null && modelsteps.fetch().length>10){
		return false;
	} else {
		return true;
	}
	}
});

Template.MentalModels.onRendered(function(){
	$('.alert').hide();
});

Template.MentalModels.onCreated(function(){
	Meteor.subscribe('mentalmodels');
	Meteor.subscribe('modelstepsdrafts');
});


Template.MentalModels.events({
	'hidden.bs.modal #model_modal'(){
		Session.set('currentModelId',undefined);
		$(".alert").hide();
		$('#modelId').val("");
		$('#input-name').val("");
		$('#input-sentence-summary').val("");
		$('#input-model-details').val("");
		$('#saveModel').text("Add Mental Model");
	},
	'click #model'(){
		Meteor.subscribe('modelsteps',this._id);
		Session.set('currentModelId',this._id);
		$('#modelId').val(this._id);
		$('#input-name').val(this.name);
		$('#input-sentence-summary').val(this.summary);
		$('#input-model-details').val(this.details);
		$('#saveModel').text("Save Mental Model");
	},
	'click #saveModel'(event){
    var name = $("#input-name").val();
		var sentence_summary = $("#input-sentence-summary").val();
		var currentModelId = Session.get('currentModelId');

		if(!checkInput(name)){
			showErrorMessage("Please input model name");
			return;
		} else if(!checkInput(sentence_summary)){
			showErrorMessage("Please input model's description");
			return;
		}

		$(".alert").hide();
		if(currentModelId==undefined){
		MentalModels.insert({name:name,summary:sentence_summary,userId:Meteor.userId()}, function(err,result){
						console.log(result);
					if(result){
							Meteor.call('addStepsToModel',result, function(error,success){
								if(error){
									console.log(error);
								} else {
									console.log(success);
								}
							});
					}
		});
	} else {
		MentalModels.update(Session.get('currentModelId'),{$set:{name:name,summary:sentence_summary,userId:Meteor.userId()}});
	}
		$("#model_modal").modal("hide");
	}
});
