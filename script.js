var connection, uid, user_id, channel,
	socket_url = "ws://8.19.240.170:80/ws",
	connectButton, identifyButton, setButton, setKeyValButton, subscribeButton, 
	metaSubButton, messageButton, restartButton, execButton, clear, 
	infoButton, ul, $el = $('body'),
	secondUser, meta_sub_to_user_id, meta_sub_to_key, globalResolve, isOwner = false,
	channelsList = [];

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
	infoButton = $el.find('#info'),
	ul = $el.find('#log ul'),
		
	//connectButton.click(connectClickHandler);
	identifyButton.click(identifyClickHandler);
	setButton.click(setClickHandler);
	setKeyValButton.click(setKeyValClickHandler);
	subscribeButton.click(subscribeClickHandler);
	metaSubButton.click(metaSubClickHandler);
	restartButton.click(restartClickHandler);
	execButton.click(execClickHandler);
	infoButton.click(infoClickHandler);

	$('#log-container').on('keyup', '.message-input', function  (e) {
		if(e.keyCode == 13){
			e.preventDefault();
			messageClickHandler($(this));
			$(this).val('');
		}
	});

	$('#log-container').on('click', '.second-user', chatWithSecondUserHandler);
	$('#log-container').on('click', '.heading', collapseChatWindow);
	$('#log-container').on('click', '.clear', clearClickHandler);

	resizeChatWindow();

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
			createChatWindow(channel);
			Log("Subscribed to " + channel);
		};
		
	}).then(function  () {
		setAndMetaSubPromise();
	});
}
function setAndMetaSubPromise(){
	/* fix */

	/* don't set values if you receive values after subscription */

	return new Promise(function (resolve, reject) {

		if(!isOwner){
			resolve(connection);
			Log('will not set global value for channel #notOwner');
		}else{
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
			    Log('setting global value for channel');
			};
		}
		
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

function subscribeClickHandler() {
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

function messageClickHandler ($this) {

	Log("--");

	//var msg = $('#pvt_msg').val();
	var msg = $this.val();
	var channel = $this.parents('.log-instance').data('channel');

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

	connection.send(JSON.stringify(message));

	Log("Messaged : " + msg + " to channel " + channel);

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
	connection.send(command);

	Log("executed " + command);
}

function clearClickHandler (e) {
	e.preventDefault();
	e.stopPropagation();

	$(this).parents('.log-instance').find('ul').empty();
}

function subscribe(channel, callback){

	//var flag = $('input[name="flag"]:checked').val();

	var subscribe = {
	    "command": "sub",
        "params": {
        	"add": true,
        	"subs": [
            	{
            		"create_when_dne": false,
        			"overwrite_params": false,
				    "sub": channel
				}
        	]
    	}
    };

    connection.send(JSON.stringify(subscribe));
    //createChatWindow(channel);
    Log("Subscribed to " + channel);
}

function chatWithSecondUserHandler (e) {

	var user2_id = $(this).text();
	var pvtChannel = channel + ":" + user_id + ":" + user2_id;

	if( !hasUserSubscribedForPvtChat(pvtChannel) ){
		pvtChatSubscribePromise(pvtChannel, user2_id);
	}
	
}

function pvtChatSubscribePromise(pvtChannel, user2_id){
	return new Promise(function (resolve, reject) {
		Log("--");

		var subscribe = {
		    "command": "sub",
	        "params": {
	        	"add": true,
	        	"subs": [
	            	{
	            		"create_when_dne": false,
            			"overwrite_params": false,
					    "sub": pvtChannel
					}
	        	]
	    	}
	    };

	    connection.send(JSON.stringify(subscribe));

	    globalResolve = function(){
			resolve(connection);
			Log("Subscribed to pvt channel " + pvtChannel);
		};		
	}).then(function  (data) {
		// update the u2u_chat in sub params
		setGlobalPvtChannelKeys(pvtChannel, user2_id);
	});
}

function setGlobalPvtChannelKeys (pvtChannel, user2_id) {
	return new Promise(function (resolve, reject) {

		Log("--");
		var set = {
		    "command": "set",
		    "params": {
		    	"sub" : pvtChannel,
		        "keyvals": [
		        	{
		            	"key": "owners",
		            	"value": [
		            		{
		            			"type": "userid",
		            			"name": user_id
		            		},
		            		{
		            			"type": "userid",
		            			"name": user2_id
		            		}
		            	],
		            	"writeable" : true
		        	}
		        	
		        ]
			}
		};

		connection.send(JSON.stringify(set));

		globalResolve = function  () {
			resolve(connection);
			Log('setting pvt channel publishers');
		};
		
	}).then(function (data) {

		Log("--");
		var set = {
		    "command": "set",
		    "params": {
		    	"sub" : channel,
		        "keyvals": [
		        	{
		        		"key" : "u2u_chat",
		        		"value" : [
		        			{
		        				"chat_channel" : pvtChannel,
		        				"user_1" : user_id,
		        				"user_2" : user2_id
		        			}
		        		]
		        	}
		        	
		        ]
			}
		};

		connection.send(JSON.stringify(set));
		Log('updating global channel with new pvt chat users value');
		createChatWindow(pvtChannel);
	});
}

function processData(data) {
	data = jQuery.parseJSON(data);

	switch(data.command){

		case 'identify':
			uid = data.success.id.uid;
			break;
		case 'push':
			if(data.type == 'publish'){

				if(data.publish.id.userid == user_id){
					var $li = $('<li><span class="user">You </span><span class="content">'+data.publish.value+'</span></li>');
				}else{
					var $li = $('<li><span class="user second-user">' + data.publish.id.userid + '</span><span class="content">'+data.publish.value+'</span></li>');
				}

				createChatWindow(data.publish.destination);

				var msgInput = $('.log-instance[data-channel="'+data.publish.destination+'"]').find('ul');

				msgInput.append($li);
				

			}else if(data.type == 'key_change'){

				var chat_key_val = data.key_change.keyvals[0].value;

				console.log('key changed ' + chat_key_val + ' lets check for mine');
				console.log(chat_key_val);

				$.each(chat_key_val, function  (key, val) {
					var ch = val.chat_channel + ":" + val.user_1 + ":" + val.user_2;
					if(val.user_1 == user_id || val.user_2 == user_id){
						if( !hasUserSubscribedForPvtChat(val.chat_channel) ){
							subscribe(val.chat_channel);
						}
					}
				});

			}
			break;
		case 'sub':
			if(data.type == 'success' && data.success[0].params.u2u_chat){
				if(data.success[0].params.u2u_chat.length > 0){
					metaSubButton.removeAttr('disabled');
					meta_sub_to_user_id = data.success[0].params.u2u_chat[0].userid;
					meta_sub_to_key = data.success[0].params.u2u_chat[0].key;
				}
				isOwner = false;
			}
			else{
				isOwner = true;
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

function resizeChatWindow() {
	var ww = $('#log-container .log-instance').length * ( $('#log-container .log-instance').width() + 10 );

	$('#log-container .wrapper').css({width: ww+'px'});
}

function createChatWindow(channel){
	if( $('.log-instance[data-channel="'+channel+'"]').length == 0){

		channelsList.push(channel);

		$("#log-container .wrapper").append(
			$( "#log-instance-template" ).render([{
				'pvt_channel' : channel,
				'channel_name' : channel
			}])
		);

		resizeChatWindow();

	}

}

function collapseChatWindow(e){
	
	$(this).siblings().toggle();
}

function hasUserSubscribedForPvtChat(channel){
	var arr = channel.split(":");
	arr.sort();

	$.each(channelsList, function  (id, val) {
		var ch = val.split(":");
		ch.sort();
		if(arr[0] == ch[0] && arr[1] == ch[1]){
			return true;
		}
	});
	return false;
}
