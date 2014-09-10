/** 
 * Native Bridge for iOS Device
 * @author : Everett Quebral
 * @version : 3.0.1
 *
 *
 * To use, do PPBridge.setup(args);
 */

/*jslint nomen: true, debug: true, evil: false, vars: true */
(function( $ ){
	'use strict';
	
	$.setup = function(args){
		//console.log("PPBridge - iOS - setup");
		ppIOS.methodCall = function(func, actionId){
			//console.log("PPBridge - iOS - methodCall ", func, actionId);
			var locationUrl = "jsr://" + func + "/" + actionId;
			window.location = locationUrl;
			return locationUrl;
		};
		
		$.init(args);
	};
	
	$.execute = function(callbackId, options){
		//console.log("PPBridge - iOS - execute ", callbackId, options);
		if (window.ppIOS && window.ppIOS.methodCall){
			return ppIOS.methodCall(options.functionName, options.actionId);
		}
	};
}(window.PPBridge));