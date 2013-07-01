
$( ".has_footer" ).on( "pageshow", function( event ) {
	if(CART_TOTAL > 0){ //lets make sure this is updated
		$('.grand_total').text('$'+CART_TOTAL);
	}else{
		
	}
});