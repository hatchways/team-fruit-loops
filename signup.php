<?php
include 'header.php';
?>
<section id="signup_form">
<form method="post" action="">
	<legend> Sign Up
   <fieldset>
   	
    <input type="text" name="name" placeholder="Name" required="true">
	<br>
	<input type="email" name="email"  placeholder="Email" required="true">
	<br>	
	<input type="password" name="pass" length=">6" placeholder="Password" required="true">
	<br>	
	<input type="password" name="pass" value="" placeholder="Confirm Password" required="true">

    </fieldset>
    </legend>
	<br>
	<br>
	<h4><u>TERMS OF USE</u>:</h4>
	<br>
	<div>
	<ol>
		<li>bla bla bla</li>
		<li>bla bla bla</li>
		<li>bla bla bla</li>
		<li>bla bla bla</li>
		<li>bla bla bla</li>
	</ol>
    </div>
	<br>
	<input type="submit" name="signup" value=" I agree and submit ">
	<button name="cancel" ><a href="index.php"> cancel </a></button>
</form>
	

</section>

<?php
include 'footer.php';
?>

