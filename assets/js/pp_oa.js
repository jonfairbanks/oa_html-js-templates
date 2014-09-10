//Global Javascript that will be used across the cart experience.

$(document).on('pageinit', '#ordertype',  function(){
	set_order_type();
	set_pickup_time();
	
	$('#pickup_slider').change(function(){
		var lead_time = $(this).val();
		var pickup_time = calculate_pickup(lead_time);
		$('.pickup_time').text('Today at '+pickup_time);
		$('#local_time_input').val('Today at '+pickup_time);
	});

	$('#pickup_day, #pickup_time').change(function(){
		set_pickup_time();
	});
	
	$('#order_option').change(function(){
		set_order_type();
	});

});
$(document).on('pageinit', '#confirm',  function(){
	$('#tip-set').change(function(){
		var thetip = $(this).find('input:checked').val();
		if(thetip == 'other'){
			//TODO: finish calculation of manually enetered gratutity
		}else{
			thetip = parseFloat(thetip);
			var tip_amount = CART_TOTAL * (thetip/100);
			var new_grand = parseFloat(CART_TOTAL) + tip_amount;
			tip_amount = tip_amount.toFixed(2);
			new_grand = new_grand.toFixed(2);
			$('.tip_total').text('$'+tip_amount);
			$('.grand_total').text('$'+new_grand);
		}
	});
	$('#process-payment-button').click(function(){

		//open custom payment processing loader
		$.mobile.loading( 'show', {
					text: 'Processing Payment...',
					textVisible: true,
					theme: 'd',
					textonly: false, 
					html: '<div><p style="text-align:center;"><img src="assets/img/icons/ajax-loader.gif"</p><h1>Processing Payment...</h1></div>'
			});

		setTimeout("payment_complete();", 5000);
		return false;
	});

});
$(document).on('pageshow', '#done',  function(){  //when this page is shown, we should clear out the cart
	CART_COUNT = 0; 
	CART_ITEM_COUNT = 0;
 	CART_TOTAL = 0;
 	$('#cart-list li.cart_purchase_item').remove();
 	update_total();
});


//this function fires each time a page is loaded dynamically that has a footer
$(document).on("pageinit", '.has_footer', function( event ) {
	if(parseInt(CART_TOTAL) > 0){ //lets make sure this is updated
		$('.grand_total').text('$'+CART_TOTAL);
		$('.cart_count_bubble').text(CART_ITEM_COUNT);
		$('.cart_count_bubble').show();
		$('.no-empty').show();
	}else{
		$('.grand_total').text('$0');
		$('.cart_count_bubble').hide();
		$('.no-empty').hide();
	}
});
//had to duplicate for page show due to an cacheing issue.
$(document).on("pageshow", '.has_footer', function( event ) {
	if(parseInt(CART_TOTAL) > 0){ //lets make sure this is updated
		$('.grand_total').text('$'+CART_TOTAL);
		$('.cart_count_bubble').text(CART_ITEM_COUNT);
		$('.cart_count_bubble').show();
		$('.no-empty').show();
	}else{
		$('.grand_total').text('$0');
		$('.cart_count_bubble').hide();
		$('.no-empty').hide();
	}
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

function update_total(){  //this function updates all the totals.

	var sub_total = 0;
	var tax_total = 0;
	var item_count = 0;
	var line_count = 1;


    //lets loop throught the items in the cart
    $('#cart-list li.cart_purchase_item').each(function(){

        var this_price = parseFloat($(this).find('.cart_item_price').val());
	 	var this_quan = parseFloat($(this).find('.cart_item_quantity').val());
	 	var this_tax = parseFloat($(this).find('.cart_item_taxrate').val());
	 	var line_total = this_price*this_quan;
	 	$(this).attr('id', 'line_'+line_count);

	 	//update the sub totals
 		sub_total += line_total;
 		tax_total += line_total*(this_tax/100);
 		item_count += this_quan;
 		
 		if(this_quan == 0){ //if they do not want this lets remove the line
 			$(this).remove();
 		}else{
 			line_count += 1;
 		}

    });
	
	var grand_total = sub_total + tax_total; 
    tax_total = tax_total.toFixed(2);
    sub_total = sub_total.toFixed(2);
    if(line_count == 1){ //if there is nothing in here
    	var grand_total = 0;
    	$('.cart_count_bubble').hide();
		$('.no-empty').hide();
    }else{ //otherwise format the grand total
    	var grand_total = grand_total.toFixed(2);
    }

	 //now we can update the page
	 $('.sub_total').text('$'+sub_total);
	 $('.tax_total').text('$'+tax_total);
	 $('.grand_total').text('$'+grand_total);

	 //update the global variables
	 CART_TOTAL = grand_total;
	 CART_ITEM_COUNT = item_count; 
	 CART_COUNT = line_count-1;
}

function edit_cart(){
	if($('#cart-list').hasClass('edit-mode')){  //convert to regular
		
		//Add classes and modify the button
		$('#my-order-header .ui-btn-text').text('Edit');
		$('#cart-list').removeClass('edit-mode');
		$('#cart-list .quan_change_group').remove();
		$('.cart-move-on').show();
		update_total();


	}else{ //conver form to edit mode

		$('#cart-list li.cart_purchase_item').each(function(){ //loop through each item.
	        var this_price = parseFloat($(this).find('.cart_item_price').val());
		 	var this_quan = parseFloat($(this).find('.cart_item_quantity').val());
		 	var this_tax = parseFloat($(this).find('.cart_item_taxrate').val());
		 	var line_total = this_price*this_quan;
		 	var this_id = parseFloat($(this).attr('id'));

		 	var quan_code = '<div class="quan_change_group" data-role="controlgroup" data-type="horizontal" data-mini="true" >';
			quan_code += '<a href="#" data-role="button" quan-direction="-1" class="ui-icon-alt quan_changer" data-iconpos="notext" data-icon="minus" data-theme="c">Remove Item</a>';
			quan_code += '<a href="#" data-role="button" data-theme="d" class="quan-counter">'+this_quan+'</a>';
			quan_code += '<a href="#" data-role="button" quan-direction="1" class="quan_changer ui-icon-alt" data-iconpos="notext" data-icon="plus" data-theme="c">Add Item</a>';
			quan_code += '</div>'


		 	$(this).append(quan_code);


	    });

		//Add the button toggle functions
		$('.quan_change_group .quan_changer').click(function(){
			var direction = parseFloat($(this).attr('quan-direction'));
			var line = $(this).parent().parent().parent();
			var line_id = line.attr('id').split('_')[1];
			var current_quan = parseFloat(line.find('.cart_item_quantity').val());
			var item_price = parseFloat(line.find('.cart_item_price').val());
			var new_quan = current_quan + direction;
			if(new_quan == 0){ //maybe the person wants to remove it?
				if(confirm("Do you want to remove this item from your order?")){
					new_quan = 0;
				}else{
					new_quan = 1;
				}
			}
			var new_price = new_quan*item_price;
			new_price = new_price.toFixed(2);

			//update the values of the input ant the display
			line.find('.cart_item_quantity').val(new_quan);
			line.find('.quan-counter .ui-btn-text').text(new_quan);
			line.find('.quan_text span').text(new_quan);new_price
			line.find('.line_price').text('$'+new_price);

			//update the total cart
			update_total();

		});


		$('#cart-list').trigger('create'); //stylize this conrolgroup since it was dynamically added

		//add class and modify the buttons
		$('#my-order-header .ui-btn-text').text('Done');
		$('#cart-list').addClass('edit-mode');
		$('.cart-move-on').hide();
	}

}

function set_order_type(){
	var order_option = $('#order_option').val();
	if(order_option == "Delivery"){
		$('.eatin_details').hide();
		$('.delivery_details').show();
		var order_text = $('#order_option').val();
	}else{
		$('.eatin_details').show();
		$('.delivery_details').hide();
		var order_text = $('#order_option').val();
	}
	$('.order_option').text(order_option);
	$('#option_list').listview('refresh');
}

function set_pickup_time(){
	var day = $('#pickup_day').val();
	if(day == "Today"){
		$('.today').show();
		$('.future').hide();
		var pickup_time = 'Today at '+calculate_pickup($('#pickup_slider').val());
	}else{
		$('.today').hide();
		$('.future').show();
		var pickup_time = day + ' at '+$('#pickup_time').val();
	}

	$('.pickup_time').text(pickup_time);
	$('#local_time_input').val(pickup_time);
	$('#pickup_list').listview('refresh');
}

 function payment_complete(){  //items to do after successful payment

 	$.mobile.loading( 'hide' );
 	$.mobile.changePage( "#done", {
	  transition: "slide",
	  reverse: false
	});

 }


