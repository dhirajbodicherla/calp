
<!DOCTYPE html>
<meta charset="utf-8" />
<html>
<head>
	<title>My Test</title>
	<link rel="stylesheet" type="text/css" href="http://getbootstrap.com/dist/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>

	<p>
		Userid :  21391347 (dhiraj) <br />
		Userid : 24564240 (dotdudi)
	</p>

	<div class="pull-left">

		<label><input type="radio" name="flag" value="1"/> Owner </label>
		<label><input type="radio" name="flag" value="2"/> Subscriber </label> <br /> <br />

		<!-- <button type="button" class="btn btn-success" id="connection">Connection</button> <br /><br /> -->

		<button type="button" class="btn btn-success" id="identify" value="" disabled="disabled">Identify</button> User : <input type="text" id="user" value="21391347" /> Session ID : <input type="text" id="session_id" value="59c68e4349ae0c5da2630e94c3ebfe26"/> <br /> <br />
		<button type="button" class="btn btn-success" id="subscribe" value="" disabled="disabled">Subscribe</button> Channel : <input type="text" id="channel" /> <br /> <br />
		<button type="button" class="btn btn-success" id="set" value="" disabled="disabled">Set sub opts</button> <br /> <br />
		<!-- <button type="button" class="btn btn-success" id="set_key_val" value="" disabled="disabled">Set key_val</button> <br /> <br /> -->
		<button type="button" class="btn btn-success" id="meta_sub" value="" disabled="disabled">Meta Sub</button> Meta Channel : <input type="text" id="meta_channel" /> <br /> <br />
		<button type="button" class="btn btn-success" id="message" value="" disabled="disabled">Message</button> Message : <input type="text" id="msg" /> Msg to : <input type="text" id="msgto" /><br /> <br />
		<button type="button" class="btn btn-success" id="info" value="" >Info</button> <br /> <br />
		<button type="button" class="btn btn-success" id="restart" value="" >Restart</button> <br />

		<label>Command</label><input type="text" id="command" /> <br /> <br />
		<input type="button" class="btn btn-warning" value="Execute" id="exec"/> <br /> <br />

		<ul class="users">
			
		</ul>
	</div>

	<div id="log" class="pull-right">
		<div class="top">
			<span>LOG</span> <span><a href="#" id="clear">Clear</a></span>
			<ul>
			</ul>
		</div>
		<div class="bottom">
			<span>LOG</span> <span><a href="#" id="clear">Clear</a></span>
			<ul>
			</ul>
		</div>
	</div>

	<script type="text/javascript" src="jquery.js"></script>
	<script type="text/javascript" src="bootstrap.min.js"></script>
	<script type="text/javascript" src="https://www.promisejs.org/polyfills/promise-4.0.0.js"></script>
	<script type="text/javascript" src="script.js"></script>
</body>
</html>

<!--

<!DOCTYPE html>
<head>
  <title>Pusher Test</title>
  <script src="//js.pusher.com/2.2/pusher.min.js" type="text/javascript"></script>
  <script type="text/javascript">
    // Enable pusher logging - don't include this in production
    Pusher.log = function(message) {
      if (window.console && window.console.log) {
        window.console.log(message);
      }
    };

    var pusher = new Pusher('7da37614cde1646addbc');
    var channel = pusher.subscribe('test_channel');
    channel.bind('my_event', function(data) {
      alert(data.message);
    });
  </script>
</head>
-->