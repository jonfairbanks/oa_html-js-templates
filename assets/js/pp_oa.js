//Global Javascript that will be used across the cart experience.

$(document).on('pageinit', '#confirm',  function(){
	calculate_pickup(15);
	$('#pickup_slider').change(function(){
		var lead_time = $(this).val();
		var pickup_time = calculate_pickup(lead_time);
		$('#pickup_time').text(pickup_time);
		$('#local_time_input').val(pickup_time);
	});

});


function calculate_pickup(lead_time){
	var now = new Date();
	var d = new Date(now.getTime() + lead_time*60000);
	var hour = d.getHours();
	if(hour > 12){
		var part = 'pm';
		hour = hour - 12;
	}else{
		if(hour == 0){
			var part = 'pm'
			hour = 12;
		}
		var part = 'am'
		hour = hour;
	}
	var minutes = d.getMinutes(); // =>  30
	if (minutes < 10){minutes = '0'+ minutes;}
	var thetime = hour+':'+minutes+' '+part;
	return(thetime);

}