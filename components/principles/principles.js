import {Principles} from '../../../lib/collections/principles.js';
import {saveOnEnterPressed,deleteOnBackspace,saveOrUpdate} from '../../lib.js';

Template.Principles.onCreated(function(){
		Meteor.subscribe('principles');
});

Template.Principles.events({
'keypress input'(event){
	saveOnEnterPressed(event, Principles, {userId:Meteor.userId(), principle:event.target.value});
},
'keyup input'(event){
	deleteOnBackspace(event, Principles);
},
'change input'(event){
	saveOrUpdate(event, Principles, {userId:Meteor.userId(), principle:event.target.value})
}
});

Template.Principles.helpers({
	principles(){
		return Principles.find({userId:Meteor.userId()});
	},
	checkSize(principles){
	if(principles!=null && principles.fetch().length>9){
		return false;
	} else {
		return true;
	}
	}
});
