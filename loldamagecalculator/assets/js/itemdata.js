(function($){

	var equipped_items = [];

	var all_items = {};
	var num_items = 0;

	function get_all_items(){
		console.log('here');
		jQuery.ajax({
			type: 'GET',
			dataType: 'json',
			url: 'http://ddragon.leagueoflegends.com/cdn/6.9.1/data/en_US/item.json',
			success: function(items){
				for(var item in items.data){
					all_items[item] = items.data[item];
					populate_item_icons(item);
					populate_item_search(item);
				}
				console.log(items);
			},
			error: function(e){
				console.log('error');
				console.log(e);
			}
		});
	}
	get_all_items();

	function populate_item_icons(item){
		var image = 'http://ddragon.leagueoflegends.com/cdn/6.9.1/img/item/'+item+'.png';
		$('.item-icon-div').append('<img id="'+item+'" class="item-icon" src="'+image+'">');
	}

	function populate_item_search(item){
		$('#item-data-list').append("<option value='"+all_items[item].name +"'>");
	}

	$('.item-search').on('keyup',function(){
		var search = $('.item-search').val();
		console.log(search);
		$('.item-icon-div').children().each(function(){
			var the_id = $(this).context.id; //Name-image
			if(!the_id.split('-')[0].includes(search)){
				$(this).hide();
			}
			else{
				$(this).show();
			}
		});
	});	

	$('.item-icon-div').on('click', '.item-icon', function(e){
		var item = e.target.id;
		if(num_items<6){
			var image = 'http://ddragon.leagueoflegends.com/cdn/6.9.1/img/item/'+item+'.png';
			var id_num = +num_items+1;
			var the_id = '#slot-'+id_num;
			$(the_id).attr('src',image);
			num_items++;
			equipped_items.push(all_items[item]);
		}
		console.log(equipped_items);

	});
})(jQuery);