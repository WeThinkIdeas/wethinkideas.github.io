import {FrameworkPrinciples} from '../../../lib/collections/frameworkprinciples.js';
import {Frameworks} from '../../../lib/collections/frameworks.js';
import {checkInput,isValid} from '../../lib.js';
import {saveOnEnterPressed,deleteOnBackspace,saveOrUpdate} from '../../lib.js';

function showErrorMessage(message){
		$("#error_message").text(message);
		$(".alert").show();
}

Template.Frameworks.onRendered(function(){
	$('.alert').hide();
});

Template.Frameworks.onCreated(function(){
	 Meteor.subscribe('frameworks');
	 Meteor.subscribe('frameworkprinciplesdraft');
});


function processData(data){
		var currentFrameworkId = Session.get('currentFrameworkId');
		if(isValid(currentFrameworkId)){
			data["status"]="published";
			data["frameworkId"] = currentFrameworkId;
		} else {
			data["status"] = "draft";
		}
		return data;
}

Template.FrameworkPrinciples.events({
'keypress input'(event){
	data = processData({userId:Meteor.userId(), principle:event.target.value});
	saveOnEnterPressed(event, FrameworkPrinciples, data);
},
'keyup input'(event){
	deleteOnBackspace(event, FrameworkPrinciples);
},
'change input'(event){
	data = processData({userId:Meteor.userId(), principle:event.target.value});
	saveOrUpdate(event, FrameworkPrinciples, data);
}
});

Template.Frameworks.helpers({
	frameworks(){
		return Frameworks.find({$or:[{userId:Meteor.userId()},{public:true}]});
	}
});


Template.Frameworks.events({
	'hidden.bs.modal #framework-modal'(){
		$('.alert').hide();
		Session.set('currentFrameworkId',undefined);
		$('#input-name').val("");
		$('#input-sentence-summary').val("");
		$("#addFramework").text("Add Framework");
	},
	'click #framework'(){
			 Meteor.subscribe('frameworkprinciples',this._id);

		  Session.set('currentFrameworkId',this._id);
		 	$('#input-name').val(this.name);
		 	$('#input-sentence-summary').val(this.summary);
			$("#addFramework").text("Save Framework");
	},
	'click #addFramework'(){
		var name = $("#input-name").val();
		var sentence_summary = $("#input-sentence-summary").val();
		var hidden_id = $("#frameworkId").val();
		if(!checkInput(name)){
			showErrorMessage("Please input framework name");
			return;
		} else if(!checkInput(sentence_summary)){
			showErrorMessage("Please input framework's description");
			return;
		}
		$(".alert").hide();
		var currentFrameworkId = Session.get('currentFrameworkId');
		if(currentFrameworkId==undefined || currentFrameworkId==""){
			 Frameworks.insert({name:name,summary:sentence_summary,userId:Meteor.userId()}, function(err, result){
				if(result){
						Meteor.call('addPrinciplesToFramework',result, function(error,success){
							if(error){
								console.log(error);
							} else {
								console.log(success);
							}
						});
				}
			});
	} else {
		Frameworks.update(currentFrameworkId,{$set:{name:name,summary:sentence_summary,userId:Meteor.userId()}});
	}
		$("#framework-modal").modal("hide");
	}
});

Template.FrameworkPrinciples.helpers({
	frameworkprinciples(){
		var currentFrameworkId = Session.get('currentFrameworkId');
		if(isValid(currentFrameworkId)){
					return FrameworkPrinciples.find({status:'published', frameworkId:currentFrameworkId});
		} else {
					return FrameworkPrinciples.find({userId:Meteor.userId(), status:'draft'});
		}
	},
	checkSize(frameworkprinciples){
	if(frameworkprinciples!=null && frameworkprinciples.fetch().length>10){
		return false;
	} else {
		return true;
	}
	}
});
