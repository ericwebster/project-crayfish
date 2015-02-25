<html>
<head>
<script src="//code.jquery.com/jquery-1.11.0.min.js"></script>

<script>
	/* ////////// VALIDATION ////////// */
	var submitContactForm = function(){
		/* Submit form to salesforce connection & e-mailer */
		$.ajax({
			type: "post",
			url: "salesforce.php",
			data: $("#contact-us-form form").serialize(),
			error: function(msg, e) {
				respMsg = "<p class='error'>There was an error submitting your request.</p>";
				$(".page-contact-us #contact-form-resp").html("");
				$(".page-contact-us #contact-form-resp").append(respMsg);
			},
			success: function(msg) {
				$(".page-contact-us #contact-form-resp").html("");
				$(".page-contact-us #captcha-error").html("");
			 	switch(msg){
			 		case "success":
			 			respMsg = "<p class='thank_you'>Thank you for contacting Cramer.</p>";
			 			$(".page-contact-us #contact-form-resp").append(respMsg);
			 			$("#contact-us-form form").remove();
			 			break;
			 		case "failed":
			 			respMsg = "<p class='error'>There was an error submitting your request.</p>";
			 			$(".page-contact-us #contact-form-resp").append(respMsg);
			 			break;
			 		case "captcha_failed":
			 			respMsg = "<p class='error'>Please enter the two Captcha words.</p>";
			 			$(".page-contact-us #captcha-error").append(respMsg);
			 			break;
			 	}
			}
		});
	};
	
	$("#submit-button").click(function(){
		submitContactForm();
	})
	
	/* ////////// END VALIDATION ////////// */
</script>
</head>
<body>
<div id="main" class="eightcol clearfix" role="main">
	<div class="inner-main">
		<div id="contact-us-form">
			<fieldset>
				<span id="contact-form-resp"></span>
				<legend>*The information marked with an asterisk is required.</legend>
				<form id="contact-form">
					
					<!-- Salesforce OID -->
					<input type="hidden" value="00Dd0000000e6P0" name="oid"/>
					<input type="hidden" value="http://projectcrayfish.webhook.org/contact/" name="retURL"/>
					<input type="hidden" value="Lead from cramer.com" name="lead_source"/>
					
					<ul>
						<li>
							<label for="first_name" style="">First Name*</label>
							<input type="text" size="20" name="first_name" maxlength="40" id="first_name"/>
						</li>
						<li>
							<label for="last_name" style="">Last Name*</label>
							<input type="text" size="20" name="last_name" maxlength="80" id="last_name"/>
						</li>
						<li>
							<label for="title" style="">Job Title</label>
							<input type="text" size="20" name="title" maxlength="40" id="title"/>
						</li>
						<li>
							<label for="company" style="">Company*</label>
							<input type="text" size="20" name="company" maxlength="40" id="company"/>
						</li>
						<li>
							<label for="email" style="">Email*</label>
							<input type="text" size="20" name="email" maxlength="80" id="email"/>
						</li>
						<li class="phone">
							<label for="phone" style="">Phone</label>
							<input type="text" size="3" name="phone_1" maxlength="3" id="phone_1"/> - 
							<input type="text" size="3" name="phone_2" maxlength="3" id="phone_2"/> - 
							<input type="text" size="4" name="phone_3" maxlength="4" id="phone_3"/>
						</li>
						<li>
							<label for="subject" style="">Subject</label>
							<select name="subject" id="subject">
								<option value="Sales Inquiries">Sales Inquiries</option>
								<option value="Corporate Communications">Corporate Communications</option>
								<option value="Career Opportunities">Career Opportunities</option>
								<option value="Cramer Insights">Cramer Insights</option>
								<option value="Miscellaneous">Miscellaneous</option>
							</select>
						</li>
						<li>
							<label for="description" style="">Comment</label>
							<textarea name="comment"/></textarea>
						</li>
						<li class="service_preference">
							<label>What are you interested in? <span>(check all that apply)</span></label>
							<div class="input-container">	
								<input type="checkbox" name="svc_pref" value="Digital Marketing" id="digital-marketing" />
								<label class="checkbox" for="digital-marketing">Digital Marketing</label>
							</div>
							<div class="input-container">
								<input type="checkbox" name="svc_pref" value="Event Solutions" id="event-solutions" />
								<label class="checkbox" for="event-solutions">Event Solutions</label>
							</div>
							<div class="input-container">
								<input type="checkbox" name="svc_pref" value="Video Production" id="video-production" />
								<label class="checkbox" for="video-production">Video Production</label>
							</div>
						</li>
						<li class="email_check">
							<input type="checkbox" name="email_optin" value="1" id="email_optin" checked="checked"/>
							<label class="checkbox checked" for="email_optin">Yes, I agree to receive periodic news from Cramer by email.</label>
						</li>
					</ul>

					<input id="submit-button" type="submit" name="submit" value="send >"/>
				</form>
			</fieldset>
		</div>​​​
	</div>
</div> <!-- end #main -->
</body>
</html>