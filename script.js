
	var connection, uid, user_id, channel,
		meta_channel, socket_url = "ws://8.19.240.170:80/ws",
		connectButton, identifyButton, setButton, setKeyValButton, subscribeButton, 
		metaSubButton, messageButton, restartButton, execButton, clear, 
		infoButton, ul, chatMsg, $el = $('body'),
		secondUser, meta_sub_to_user_id, meta_sub_to_key, globalResolve;

	init();

	function init(){

		connectButton = $el.find('#connection'),
			identifyButton = $el.find('#identify'),
			setButton = $el.find('#set'),
			setKeyValButton = $el.find('#set_key_val'),
			subscribeButton = $el.find('#subscribe'),
			metaSubButton = $el.find('#meta_sub'),
			messageButton = $el.find('#message'),
			restartButton = $el.find('#restart'),
			execButton = $el.find('#exec'),
			clear = $el.find('.clear'),
			infoButton = $el.find('#info'),
			chatMsg = $el.find('#msg-log ul');
			ul = $el.find('#log ul'),
			
		//connectButton.click(connectClickHandler);
		identifyButton.click(identifyClickHandler);
		setButton.click(setClickHandler);
		setKeyValButton.click(setKeyValClickHandler);
		subscribeButton.click(subscribeClickHandler);
		metaSubButton.click(metaSubClickHandler);
		messageButton.click(messageClickHandler);
		restartButton.click(restartClickHandler);
		execButton.click(execClickHandler);
		clear.click(clearClickHandler);
		infoButton.click(infoClickHandler);

		$('#msg-log ul').on('click', '.second-user', chatWithSecondUserHandler);

	}

	connectPromise();

	function connectPromise(){
		return new Promise(function  (resolve, reject) {

			var soc = new WebSocket(socket_url);

			connection = soc;

			soc.onopen = function () {

				//identifyButton.removeAttr('disabled');
				//subscribeButton.removeAttr('disabled');
				//setButton.removeAttr('disabled');
				//setKeyValButton.removeAttr('disabled');
				//messageButton.removeAttr('disabled');
				Log("Connected to manatee !");
				resolve(soc);
			};
			
			// Log errors
			soc.onerror = function (error) {
			  console.log('WebSocket Error ');
			  connectPromise();
			};

			// Log messages from the server
			soc.onmessage = function (e) {
			
			  if(globalResolve){
					globalResolve();
					globalResolve = "";
				}
			  processData(e.data);
			  Log(e.data);
			};
			soc.onclose = function(){
				console.log('im closing');
				console.log(connection);
				connectPromise();
			};
			
		}).then(function () {
			identifyPromise(connection);

		});
	}

	function identifyPromise(){

		return new Promise(function  (resolve, reject) {
			Log("--");
			
			user_id = $.trim($('#user').val());
			
			var session_id = $.trim($('#session_id').val());

			if(!session_id){
				identifyButton.removeAttr('disabled');
				reject(connection);
				return;
			}
			
			var ping = { 
			  	"command" : "identify",
			  	"params" : {
			  		"invisible" : false
			  	}
			  };
			 if(user_id.length > 0){
			 	ping.params.userid  = user_id;
			 }

			 if(session_id.length > 0){
			 	ping.params.sessionid  = session_id;
			 }
			 
			connection.send(JSON.stringify(ping));
			
			globalResolve = function(){
				resolve(connection);
				Log("Identified");
			};
			
		}).then(function () {
			identifyButton.attr('disabled', 'disabled');
			subscribePromise();
		});
	}

	function subscribePromise () {
		return new Promise(function  (resolve, reject) {

			channel = $('#channel').val();

			var flag = $('input[name="flag"]:checked').val();

			if(!channel){
				subscribeButton.removeAttr('disabled');
				reject(connection);
				return;
			}

			Log("--");

			var subscribe = {
			    "command": "sub",
		        "params": {
		        	"subs": [
		            	{
		            		"create_when_dne": false,
	            			"overwrite_params": false,
						    "sub": channel
						}
		        	]
		    	}
		    };

		    if(user_id.length > 0){
				subscribe.params.subs.push({"sub"  : "user:" + user_id});
			}

		    connection.send(JSON.stringify(subscribe));

		    globalResolve = function(){
				resolve(connection);
				Log("Subscribed to " + channel);
			};
			
		}).then(function  () {
			setAndMetaSubPromise();
		});
	}
	function setAndMetaSubPromise(){
		return new Promise(function (resolve, reject) {
			
			Log("--");
			var set = {
			    "command": "set",
			    "params": {
			    	"sub" : channel,
			        "keyvals": [
			        	{
			            	"key": "publishers",
			            	"value": "global",
			            	"writeable" : true
			        	},
			        	{
			        		"key" : "u2u_chat",
			        		"value" : [
			        			/* this is the format 
			        			{
			        				"chat_channel" : "1",
			        				"user_1" : "2",
			        				"user_2" : "3"
			        			}
			        			*/
			        		]
			        	}
			        ]
				}
			};

			connection.send(JSON.stringify(set));

			globalResolve = function(){
				
			    resolve(connection);
			};
			
		}).then(function  () {
			var meta_sub = {
			    "command": "meta_sub",
			    "params": {
			        "type": "sub_keys",
			        "sub_keys": [
			            {
			                "sub": channel,
			                "keys": ["u2u_chat"]
			            }
			        ]
			    }
			};

			connection.send(JSON.stringify(meta_sub));

			Log("Meta sub'ed");
		});
	}

	function identifyClickHandler () {
		identifyPromise();
	}

	function subscribeClickHandler(callback) {
		subscribePromise();
	}

	function setClickHandler(callback) {
		Log("--");
		var set = {
		    "command": "set",
		    "params": {
		    	"sub" : channel,
		        "keyvals": [
		        	{
		            	"key": "publishers",
		            	"value": "global",
		            	"writeable" : true
		        	},
		        	{
		        		"key" : "u2u_chat",
		        		"value" : [
		        			/* this is the format 
		        			{
		        				"chat_channel" : "1",
		        				"user_1" : "2",
		        				"user_2" : "3"
		        			}
		        			*/
		        		]
		        	}
		        ]
			}
		};

		connection.send(JSON.stringify(set));

		Log("Set publishers and meta sub");

		if(callback && typeof(callback) === 'function'){
			callback();
		}

	}

	function setKeyValClickHandler (callback) {
		Log("--");
		var set = {
		    "command": "set",
		    "params": {
		        "keyvals": [
		        	{
		            	"key": "u2u_chat",
		            	"value": [
		            		{
		            			"type" : "userid",
		            			"name" : "24564240"
		            		}
		            	]
		        	}
		        ]
			}
		};

		connection.send(JSON.stringify(set));

		Log("Set publishers and meta sub");

		if(callback && typeof(callback) === 'function'){
			callback();
		}
	}

	function metaSubClickHandler (callback) {
		Log("--");

		meta_channel = $('#meta_channel').val();
		/*
		var meta_sub = {
			"command" : "meta_sub",
			"params" : {
				"type" : "sub_keys",
				"sub_keys" : [{
					"sub" : meta_channel
				}]
			}
		};
		*/
		var meta_sub = {
		    "command": "meta_sub",
		    "params": {
		        "type": "sub_keys",
		        "sub_keys": [
		            {
		                "sub": channel,
		                "keys": ["u2u_chat"]
		            }
		        ]
		    }
		};

		connection.send(JSON.stringify(meta_sub));

	    Log("Meta sub'ed to ");

	    if(callback && typeof(callback) === 'function'){
			callback();
		}
	}

	function messageClickHandler (callback) {
		Log("--");

		var msg = $('#msg').val();
		var msgto = $('#msgto').val();

		var message = {
		    "command": "pub",
		    "params": {
		        "type": "data",
		        "value": msg,
		        "subs": [
		            {
		                "type": "sub",
		                "name": channel
		            }
		        ]
		    }
		};

		if(msgto.length > 0 ){
			message.params.subs = [];
			message.params.subs.push({"type" : "userid", "name" : msgto});
		}

		connection.send(JSON.stringify(message));

		Log("Messaged : " + msg + " to channel " + channel);

		if(callback && typeof(callback) === 'function'){
			callback();
		}
	}

	function infoClickHandler(callback) {
		/*
		var info = {
		    "command": "info",
		    "params": {
		        "type": "sub_count",
		        "sub_count": {
		            "type": "userid",
		            "name": user_id
		        }
		    }
		};
		*/
		var info = {
		    "command": "set",
		    "params": {
		        "sub": channel,
		        "keyvals": [
		        	{
		                "key": "u2u_chat",
		                "value": [
		                	{
		                		'dhiraj' : 'bodicherla'
		                	}
		                ]
		            }
				]
		    }
		};

		connection.send(JSON.stringify(info));

		Log("list of users requested");

		if(callback && typeof(callback) === 'function'){
			callback();
		}

	}

	function restartClickHandler () {
		Log("--");
		connection = null;

		$('#connection').removeAttr('disabled');
		$('#identify').attr('disabled', 'disabled');
		$('#subscribe').attr('disabled', 'disabled');
		$('#message').attr('disabled', 'disabled');

	}

	function execClickHandler () {
		var command = $('#command').val();
		console.log(command);
		connection.send(command);

		Log("executed " + command);
	}

	function clearClickHandler (e) {
		e.preventDefault();

		ul.empty();
	}

	function subscribe(channel, callback){

		var flag = $('input[name="flag"]:checked').val();

		var subscribe = {
		    "command": "sub",
	        "params": {
	        	"subs": [
	            	{
	            		"create_when_dne": false,
            			"overwrite_params": false,
					    "sub": channel
					}
	        	]
	    	}
	    };

	    if(user_id.length > 0){
			subscribe.params.subs.push({"sub"  : "user:" + user_id});
		}

	    connection.send(JSON.stringify(subscribe));

	    Log("Subscribed to " + channel);

	    if(callback && typeof(callback) === 'function'){
			
			callback();
		}

	}

	function chatWithSecondUserHandler (e) {
		var user2_id = $(this).text();
		$('#msgto').val(user2_id);

		var subscribe = {
		    "command": "sub",
	        "params": {
	        	"subs": [
	            	{
					    "sub": "user1:" + user_id + "-user2:" + user2_id,
					}
	        	]
	    	},
	    	"blackbox": {
	    		"sub" : "user1:" + user_id + "-user2:" + user2_id,
	    		"userid" : user2_id
	    	}
	    };

	    connection.send(JSON.stringify(subscribe));

	   $('#msg').val('');
	}

	function processData(data) {
		data = jQuery.parseJSON(data);

		switch(data.command){

			case 'identify':
				uid = data.success.id.uid;
				break;
			case 'push':
				if(data.type == 'publish'){

					var $li = $('<li><span class="second-user">' + data.publish.id.userid + '</span><span class="content">'+data.publish.value+'</span></li>');
					chatMsg.append($li);

				}else if(data.type == 'key_change'){

					var chat_key_val = data.key_change.keyvals[0].value;

					$.each(chat_key_val, function  (key, val) {
						if( val.user_1 == user_id || val.user_2 == user_id){

							subscribe_promise(channel);

							return;
						}
					});

				}
				break;
			case 'sub':
				if(data.type == 'success' && data.success[0].params.u2u_chat && data.success[0].params.u2u_chat.length > 0){
					metaSubButton.removeAttr('disabled');
					meta_sub_to_user_id = data.success[0].params.u2u_chat[0].userid;
					meta_sub_to_key = data.success[0].params.u2u_chat[0].key;
				}
				break;
		}
	}

	function connectionRestart() {

		connection = null;

	}

	function Log (msg) {
		var $li = $('<li>' + msg + '</li>');
		ul.append($li);
	}
