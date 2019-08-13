import {NorthStar} from '../../../lib/collections/northstar.js';
import {saveOnEnterPressed,deleteOnBackspace,saveOrUpdate} from '../../lib.js';


Template.Northstar.onCreated(function(){
  Meteor.subscribe('northstar');
});

Template.Northstar.events({
'keypress input'(event){
	saveOnEnterPressed(event, NorthStar, {userId:Meteor.userId(), direction:event.target.value});
},
'keyup input'(event){
	deleteOnBackspace(event, NorthStar);
},
'change input'(event){
	saveOrUpdate(event, NorthStar, {userId:Meteor.userId(), direction:event.target.value});
}
});

Template.Northstar.helpers({
	northstars(){
		return NorthStar.find({userId:Meteor.userId()});
	},
	checkSize(northstars){
	if(northstars!=null && northstars.fetch().length>4){
		return false;
	} else {
		return true;
	}
	}
});
