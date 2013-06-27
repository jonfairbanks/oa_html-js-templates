$('.item-form').on('submit', function(e){

	//these will be used to keep track of the adjustments to price based on user selection.
	var price_adjustment = 0;
	var mod_descrip = [];
	var num_modifiers = 0;

	// get all the inputs into an array.
    var $inputs = $(this).find(':input');

    // get an associative array of just the values.
    var values = {};
    
    $inputs.each(function() {
    	
    	var input_type = $(this).attr('type');

    	if( input_type == 'checkbox' || input_type == 'radio'){  // if it is a checkbox or radio we have to look into it.
    		if($(this).is(':checked')){
    			
    			//lets check to see if this selected modifier has an additional cost.
    			if($(this).attr('mod-cost')){
    				price_adjustment += parseFloat($(this).attr('mod-cost'));
    			}
    			
    			if($(this).attr('name') == 'add_on[]'){  //lets make a sentance for the modifications
    				mod_descrip[num_modifiers] = 'add '+ $(this).val();
    				num_modifiers += 1;
    			}else if ($(this).attr('name') == 'bread'){  //lets make a sentance for bread
    				mod_descrip[num_modifiers] = 'on '+ $(this).val();
    				num_modifiers += 1;
    			}else if ($(this).attr('name') == 'side'){  //lets make a sentance for bread
    				mod_descrip[num_modifiers] = 'with '+ $(this).val();
    				num_modifiers += 1;
    			}else if ($(this).attr('name') == 'toppings[]'){  //lets check the toppings
    				if($(this).attr('mod-default') == 'true'){
    					//this is a default option so no need to add it
    				}else{
	    				mod_descrip[num_modifiers] = 'add '+ $(this).val();
	    				num_modifiers += 1;
    				}
    			}else{
    				mod_descrip[num_modifiers] = $(this).val()+' '+this.name;
    				num_modifiers += 1;
    			}

    			values[this.name] = $(this).val();
    			
    		
    		}else{  //if it was not checked
    			if($(this).attr('mod-default') == 'true'){ //if it was a default option we have to say not to include it
    				mod_descrip[num_modifiers] = 'no '+ $(this).val();
    				num_modifiers += 1;
    			}
    		}
    	}else if(input_type == 'hidden'){  //just add hidden values
        	values[this.name] = $(this).val();
    	}else{ //non hidden inputs
    		values[this.name] = $(this).val();
    	}
        
    });  //end loop through form inputs

    var item_total = parseFloat(values['item_price']) + price_adjustment;
    var line_total = item_total * parseFloat(values['item_quantity']); //times it by the quantity
    var option_text = mod_descrip.join(', ');


    //lets first check to see if we already have one of these items.
    if($('#cart-list .item-'+values['item_id']).length > 0){
    	//we have to make sure that the modifiers are the same
    	//alert('this item already is in the cart');
    	$('#cart-list .item-'+values['item_id']).each(function(){

    	});
    }


    CART_COUNT += 1;
    var new_line_item = '<li data-theme="d" class="cart_purchase_item item-'+values['item_id']+'">';
    new_line_item += '<input type="hidden" name="item['+CART_COUNT+'][item_id]" value="'+values['item_id']+'" />';
    new_line_item += '<input type="hidden" name="item['+CART_COUNT+'][item_name]" value="'+values['item_name']+'" />';
    new_line_item += '<input type="hidden" name="item['+CART_COUNT+'][modifiers]" value="'+option_text+'" />';
    new_line_item += '<input id="'+CART_COUNT+'_quantity" type="hidden" name="item['+CART_COUNT+'][item_quantity]" value="'+values['item_quantity']+'" />';
    new_line_item += '<input id="'+CART_COUNT+'_price" type="hidden" name="item['+CART_COUNT+'][item_price]" value="'+item_total+'" />';
    new_line_item += '<input id="'+CART_COUNT+'_taxrate" type="hidden" name="item['+CART_COUNT+'][item_tax_rate]" value="'+values['item_tax_rate']+'" />';
    new_line_item += '<h4>'+values['item_name']+'</h4><span class="ui-li-count">$'+line_total.toFixed(2)+'</span>';
    if(values['item_quantity'] > 1){ 
    	new_line_item += '<p class="quan_text" >Qty '+values['item_quantity']+' | @$'+values['item_price']+'</p>';
	}
	if(mod_descrip.length > 0){ 
    	new_line_item += '<p class="mod_text" >'+option_text+'</p>';
	}
	new_line_item += '</li>';
	//alert(new_line_item);
	$('#confirm_subtotals').before(new_line_item);
	$.mobile.changePage($("#cart"), "slide");
	$('#cart-list').listview('refresh');
	update_total();
	return false;

});

$('.quan_up').click(function(){
	var item_id = $(this).attr('id').split('_')[1];
	var current_quantity = parseInt($('#item_'+item_id+'_quantity').val());
	$('#item_'+item_id+'_quantity').val(current_quantity + 1);
	$('#item_'+item_id+'_count .ui-btn-text').text(current_quantity + 1);
});
$('.quan_down').click(function(){
	var item_id = $(this).attr('id').split('_')[1];
	var current_quantity = parseInt($('#item_'+item_id+'_quantity').val());
	if(current_quantity > 0){ 
		$('#item_'+item_id+'_quantity').val(current_quantity - 1);
		$('#item_'+item_id+'_count .ui-btn-text').text(current_quantity + 1);
	}else{
		$('#item_'+item_id+'_quantity').val(0);
		$('#item_'+item_id+'_count .ui-btn-text').text(0);
	}
});


function update_total(){  //this function updates all the totals.

	var sub_total = 0;
	var tax_total = 0;
	var item_spot = 1;

	 if(CART_COUNT > 0){
	 	while(item_spot <= CART_COUNT){
	 		var this_price = parseFloat($('#'+item_spot+'_price').val());
	 		var this_quan = parseFloat($('#'+item_spot+'_quantity').val());
	 		var this_tax = parseFloat($('#'+item_spot+'_taxrate').val());

	 		sub_total += this_price*this_quan;
	 		tax_total += this_price*this_quan*(this_tax/100) 
	 		item_spot +=1;
	 	}
	 }
	 var grand_total = sub_total+tax_total
	 grand_total = grand_total.toFixed(2);
	 sub_total = sub_total.toFixed(2);
	 tax_total = tax_total.toFixed(2);

	 //now we can update the pages
	 $('.sub_total').text('$'+sub_total);
	 $('.tax_total').text('$'+tax_total);
	 $('.grand_total').text('$'+grand_total);

	 //update the global variables
	 CART_TOTAL = grand_total;
}





