/** 
 * Generic Device Implementation
 * @author : Everett Quebral
 * @version : 3.0.0
 *
 * This is just an example on how to extend the native bridge to support a new device
 */

/*jslint nomen: true, debug: true, evil: false, vars: true */
(function( $ ){
	'use strict';
	
	$.setup = function(args){
		console.log("PPBridge - Generic - setup");
		genericDevice.methodCall = function(func, actionId){
			console.log("PPBridge - iOS - methodCall ", func, actionId);
			
			//window.location="jsr://" + func + "/" + actionId;
			// instead of using the window.location which is specific to iOS, just return the string
			return "jsr://" + func  + "/" + actionId;
		};
		
		$.init(args);
	};
	
	$.execute = function(callbackId, options){
		console.log("PPBridge - Generic - execute ", callbackId, options);
		if (genericDevice && genericDevice.methodCall){
			return genericDevice.methodCall(options.functionName, options.actionId);
		}
	};
}(window.PPBridge));