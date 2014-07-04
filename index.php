<?
if(isset($_GET['user_id'])){
	extract($_GET);

	$data = array(
		array('user' => '21391347', 'sess' => '3ee434e4d40906b4fa960e0589f00194', 'name' => 'Dhiraj'),
		array('user' => '24564240', 'sess' => '2720f66583b35f8d9cd9fa112f413643', 'name' => 'Dudi'),
		array('user' => '27859681', 'sess' => '99e2210b72859ec1043303b20d79574c', 'name' => 'dhiraj-test-1'),
		array('user' => '27859997', 'sess' => 'a509912c13b7b992cc0b4d7348fa4f1e', 'name' => 'dhiraj-test-2')
	);

	$user = $data[$user_id-1]['user'];
	$sess = $data[$user_id-1]['sess'];
}
?>
<!DOCTYPE html>
<meta charset="utf-8" />
<html>
<head>
	<title><?php echo $user_id . $data[$user_id-1]['name'] ?></title>
	<link rel="stylesheet" type="text/css" href="http://getbootstrap.com/dist/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="../../style.css">
</head>
<body>

	<ul>
		<?php
		foreach($data as $key=>$value){
			if($key == $user_id-1){
				echo "<li class='active'> {$value['name']} : {$value['user']} : {$value['sess']} </li>";	
			}else{
				echo "<li> {$value['name']} : {$value['user']} : {$value['sess']} </li>";
			}
		}

		?>
	</ul>

	<div class="pull-left">

		<!-- <label><input type="radio" name="flag" value="1"/> Owner </label>
		<label><input type="radio" name="flag" value="2"/> Subscriber </label> <br /> <br /> -->

		<!-- <button type="button" class="btn btn-success" id="connection">Connection</button> <br /><br /> -->

		<button type="button" class="btn btn-success" id="identify" value="" disabled="disabled">Identify</button> User : <input type="text" id="user" value="<?php echo $user;?>" /> Session ID : <input type="text" id="session_id" value="<?php echo $sess;?>"/> <br /> <br />
		<button type="button" class="btn btn-success" id="subscribe" value="" disabled="disabled">Subscribe</button> Channel : <input type="text" id="channel" /> <br /> <br />
		<!-- <button type="button" class="btn btn-success" id="set" value="" disabled="disabled">Set sub opts</button> <br /> <br /> -->
		<!-- <button type="button" class="btn btn-success" id="set_key_val" value="" disabled="disabled">Set key_val</button> <br /> <br /> -->
		<!-- <button type="button" class="btn btn-success" id="meta_sub" value="">Meta Sub</button> Meta Channel : <input type="text" id="meta_channel" /> <br /> <br /> -->
		<!-- <button type="button" class="btn btn-success" id="message" value="" >Message</button> Message : <br /> <br /> -->
		<!-- <button type="button" class="btn btn-success" id="pvt_message_btn" value="" >Pvt Message</button> Message :  <br /> <br /> -->
		<!-- <button type="button" class="btn btn-success" id="info" value="" >Info</button> <br /> <br /> -->
		<!-- <button type="button" class="btn btn-success" id="restart" value="" >Restart</button> <br /> -->

		<!-- <label>Command</label><input type="text" id="command" /> <br /> <br />
		<input type="button" class="btn btn-warning" value="Execute" id="exec"/> <br /> <br /> -->

		<ul class="users">
		</ul>
	</div>
	<div id="log-container" class="pull-right">
		<div class="wrapper">
			<div id="log" class="log-instance">
				<div class="top">
					<div class="heading">
						<span>Server Log</span>
						<span class="name"></span>
						<span><a href="#" class="clear">Clear</a></span>
					</div>
					<ul>
					</ul>
					<!-- <input type="text" id="log-msg" placeholder="Type here"/> -->
				</div>
			</div>
			<div id="msg-log" class="log-instance">
				<div class="bottom">
					<div class="heading">
						<span>Chat</span> 
						<span class="name"></span>
						<span><a href="#" class="clear">Clear</a></span>
					</div>
					<ul>
					</ul>
					<input type="text" id="msg" placeholder="Type here"/>
				</div>
			</div>
			
			<div id="pvt-log" class="log-instance">
				<div class="bottom">
					<div class="heading">
						<span>Pvt Chat</span>
						<span class="name"></span>
						<span><a href="#" class="clear">Clear</a></span>
					</div>
					<ul>
					</ul>
					<input type="text" id="pvt_msg" placeholder="Type here"/>
				</div>
			</div>
		</div>
	</div>

	<script type="text/javascript" src="../../jquery.js"></script>
	<script type="text/javascript" src="../../bootstrap.min.js"></script>
	<script type="text/javascript" src="https://www.promisejs.org/polyfills/promise-4.0.0.js"></script>
	<script type="text/javascript" src="../../script.js"></script>
</body>
</html>
