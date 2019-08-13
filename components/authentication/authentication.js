
function hideErrors(){
	  $('#login_error_message').text("");
		$('#signup_error_message').text("");
		$('#login_error').hide();
		$('#signup_error').hide();
}
Template.Authentication.onRendered(function(){
	hideErrors();
});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

Template.Authentication.events({
	'click #signup'(){
			hideErrors();
			if($('#email').val()=="" || !validateEmail($("#email").val())){
				 $('#signup_error_message').text("Please input email.");
			   $('#signup_error').show();
			   return;
		 } else if($('#password').val()==""){
			   $('#signup_error_message').text("Please input password.");
				 $('#signup_error').show();
				 return;
		 } else if($('#confirmpassword').val()==""){
			   $('#signup_error_message').text("Please input confirm password.");
				 $('#signup_error').show();
				 return;
		 } else if($('#password').val()!=$("#confirmpassword").val()){
			  $('#signup_error_message').text("Passwords don't match");
				$('#signup_error').show();
				return;
		 }
		 Accounts.createUser({email: $('#email').val(), password: $('#password').val()}, function(err) {
		  if (err){
				$('#signup_error_message').text(err.reason);
				$('#signup_error').show();
			}
		  else{
		   Router.go('/');
			}
		});
	},
	'click #login'(){
			hideErrors();
			if($('#login_email').val()==""){
				$('#login_error_message').text("Please input email");
				$('#login_error').show();
				return;
			}else if($('#login_password').val()==""){
				$('#login_error_message').text("Please input password");
				$('#login_error').show();
				return;
			}
			Meteor.loginWithPassword($('#login_email').val(),$('#login_password').val(),function(error){
				if(error){
					$('#login_error_message').text(error.reason);
						$('#login_error').show();
				} else {
					Router.go('/');
				}
			});
	}
});
