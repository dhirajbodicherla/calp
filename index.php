<?
if(isset($_GET['user_id'])){
	extract($_GET);

	$user = "";

	if($user_id == 1){
		$user = "21391347";
	}else if($user_id == 2){
		$user = "24564240";
	}else{

	}
}
?>
<!DOCTYPE html>
<meta charset="utf-8" />
<html>
<head>
	<title>My Test</title>
	<link rel="stylesheet" type="text/css" href="http://getbootstrap.com/dist/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="../../style.css">
</head>
<body>

	<p>
		Userid :  21391347 (dhiraj) <br />
		Userid : 24564240 (dotdudi)
	</p>

	<div class="pull-left">

		<!-- <label><input type="radio" name="flag" value="1"/> Owner </label>
		<label><input type="radio" name="flag" value="2"/> Subscriber </label> <br /> <br /> -->

		<!-- <button type="button" class="btn btn-success" id="connection">Connection</button> <br /><br /> -->

		<button type="button" class="btn btn-success" id="identify" value="" disabled="disabled">Identify</button> User : <input type="text" id="user" value="<?php echo $user;?>" /> Session ID : <input type="text" id="session_id" value=""/> <br /> <br />
		<button type="button" class="btn btn-success" id="subscribe" value="" disabled="disabled">Subscribe</button> Channel : <input type="text" id="channel" /> <br /> <br />
		<!-- <button type="button" class="btn btn-success" id="set" value="" disabled="disabled">Set sub opts</button> <br /> <br /> -->
		<!-- <button type="button" class="btn btn-success" id="set_key_val" value="" disabled="disabled">Set key_val</button> <br /> <br /> -->
		<!-- <button type="button" class="btn btn-success" id="meta_sub" value="">Meta Sub</button> Meta Channel : <input type="text" id="meta_channel" /> <br /> <br /> -->
		<button type="button" class="btn btn-success" id="message" value="" >Message</button> Message : <input type="text" id="msg" /> Msg to : <input type="text" id="msgto" /><br /> <br />
		<!-- <button type="button" class="btn btn-success" id="info" value="" >Info</button> <br /> <br /> -->
		<!-- <button type="button" class="btn btn-success" id="restart" value="" >Restart</button> <br /> -->

		<!-- <label>Command</label><input type="text" id="command" /> <br /> <br />
		<input type="button" class="btn btn-warning" value="Execute" id="exec"/> <br /> <br /> -->

		<ul class="users">
			
		</ul>
	</div>
	<div id="log-container" class="pull-right">
		<div id="log">
			<div class="top">
				<span>Server Log</span> <span><a href="#" clear="clear">Clear</a></span>
				<ul>
				</ul>
			</div>
		</div>
		<div id="msg-log">
			<div class="bottom">
				<span>Chat</span> <span><a href="#" clear="clear">Clear</a></span>
				<ul>
				</ul>
			</div>
		</div>
		
		
	</div>

	<script type="text/javascript" src="../../jquery.js"></script>
	<script type="text/javascript" src="../../bootstrap.min.js"></script>
	<script type="text/javascript" src="https://www.promisejs.org/polyfills/promise-4.0.0.js"></script>
	<script type="text/javascript" src="../../script.js"></script>
</body>
</html>
