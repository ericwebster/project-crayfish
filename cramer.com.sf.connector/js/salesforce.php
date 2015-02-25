<?php 

require_once('class.phpmailer.php');

		$privatekey = "6LfldNESAAAAAPDxWeDjOTvw7t5aDOF4mSPjd1uN";

		// ----------------------------------------------------------    
		// Post contact variables to Salesforce as a new lead
		//
		$pd['first_name'] = ucwords($_POST['first_name']);
		$pd['last_name'] = ucwords($_POST['last_name']);
		$pd['title'] = ucwords($_POST['title']);
		$pd['company'] = ucwords($_POST['company']);
		$pd['email'] = $_POST['email'];
		$pd['svc_pref'] = $_POST['svc_pref'];
		$pd['phone'] = $_POST['phone_1']."-".$_POST['phone_2']."-".$_POST['phone_3'];
		$pd['description'] = "Subject: ".$_POST['subject'].". ";
		$pd['optin'] = ($_POST['email_optin'] == 1) ? "Yes" : "No";
		
		if($_POST['svc_pref'] != "" && $_POST['svc_pref'] != null){
			$pd['description'] .= "Interested in: " . $_POST['svc_pref'].". ";
		}

		$pd['description'] .= "Comment: ".$_POST['comment'];
		$pd['00N60000002BCDR'] = ($_POST['email_optin'] == 1) ? "Opt-In" : "";
		
		// Organization ID
		// $pd['oid'] = '00Dd0000000e6P0';// Sara's Test Account OID
		$pd['oid'] = '00D300000000VkJ';// Cramers OID //
		
		$pd['retURL'] = $_SERVER['HTTP_HOST'].'/contact-us?msg=success';
		$pd['lead_source'] = $_POST['lead_source'];
		
		$post_str = '';
		foreach($pd as $key=>$val) {
			$post_str .= $key.'='.urlencode($val).'&';
		} 
		$post_str = substr($post_str, 0, -1);
		
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, 'https://www.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8'); 
		curl_setopt($ch, CURLOPT_POST, TRUE);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $post_str); 
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
		$result = curl_exec($ch);
		curl_close($ch);
		
		/*
		if($result == false){
			error_log("Contact form salesforce error", 1, "sczyzewicz@crameronline.com");
		}
		*/
		if(curl_errno($ch))
		{
		    error_log("Contact form salesforce error " . curl_error($ch), 1, "cramerlabs-adm@cramerlabs.com");
		    error_log("Contact form salesforce error " . curl_error($ch), 1, "Cramer-Website-Contact-Form@cramerlabs.com");
		}

		// ----------------------------------------------------------
		// E-mail cramer contact
		//
		$form_subject = $_POST['subject'];
		
		$body = "Cramer Online Contact Form Submission\n\n";
		$body .= "Name: " . $pd['first_name'] . " " . $pd['last_name'];
		$body .= "\nTitle: " . $pd['title'];
		$body .= "\nCompany: " . $pd['company'];
		$body .= "\nEmail: " . $pd['email'];
		$body .= "\nPhone: " . $pd['phone'];
		$body .= "\nInterested in: " . $_POST['svc_pref'];
		$body .= "\nSubject: " . $_POST['subject'];
		$body .= "\nComment: ". $_POST['comment'];
		$body .= "\nWould like to receive periodic news from Cramer via e-mail? " . $pd['optin'];
		
		$mail = new PHPMailer();                                
		$mail->From = "no-reply-contact-form@cramer.com";
		$mail->FromName = "Cramer.com";

		switch ($form_subject) {
			case "Sales Inquiries":
				$mail->AddAddress("acave@cramer.com", "Ann Cave");
				$mail->AddAddress("swinsor@cramer.com", "Sheri Winsor");
			break;
			case "Corporate Communications":
				$mail->AddAddress("swinsor@cramer.com", "Sheri Winsor");
			break;
			case "Career Opportunities":
				$mail->AddAddress("kwalsh@cramer.com", "Karen Walsh-Kelly");
				$mail->AddAddress("mroche@cramer.com", "Mary Roche");
				$mail->AddAddress("cfleming@cramer.com", "Christine Fleming");
			break;
			case "Cramer Insights":
				$mail->AddAddress("swinsor@cramer.com", "Sheri Winsor");
			break;
			case "Miscellaneous":
				$mail->AddAddress("swinsor@cramer.com", "Sheri Winsor");
			break;
			default:
				$mail->AddAddress("swinsor@cramer.com", "Sheri Winsor");
			break;
		}
		
		$mail->Subject = "Cramer Online Contact Form";
		$mail->Body = $body;
		
		if(!$mail->Send())
		{
			error_log("Contact form e-mail error forwarding for " . $form_subject . ". Error: " . $mail->ErrorInfo, 1, "sczyzewicz@crameronline.com");
			error_log("Contact form e-mail error forwarding for " . $form_subject . ". Error: " . $mail->ErrorInfo, 1, "Cramer-Website-Contact-Form@cramerlabs.com");
			echo('failed');
		}else{
			echo('success');
		}

	}
}

?>