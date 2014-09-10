/** 
 * Native Bridge for Android Device
 * @author : Everett Quebral
 * @version : 3.0.1
 *
 * To use, call PPBridge.setup(args);
 */

/*jslint nomen: true, debug: true, evil: false, vars: true */
(function( $ ){
	'use strict';

	$.setup = function(args){
		//console.log("PPBridge - Android -setup");
		//$.ppAndroid = $.ppAndroid || {};
		$.init(args);
	};
	
	$.execute = function(callbackId, options){
		//console.log("PPBridge - Android - execute ", callbakId, options);
		if (window.ppAndroid && window.ppAndroid.methodCall){
			ppAndroid.methodCall(options.functionName, JSON.stringify(options.config));
		}
		else {
			//console.log("Error calling ppAndroid.methodCall");
		}
	};
}(window.PPBridge));