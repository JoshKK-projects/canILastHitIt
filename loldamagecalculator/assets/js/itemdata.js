var bonus_hp = 0;
var bonus_mana = 0;
var bonus_armor = 0;
var bonus_mr = 0;
var bonus_ad = 0;
var bonus_ap = 0;
var bonus_ms = 0;
var bonus_as = 0;
var pcent_bonus_as = 0;
var bonus_crit = 0;
var bonus_lifesteal = 0;
var calc_stats; 

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
			var name = all_items[the_id].name
			if(!name.includes(search)){
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
			console.log(the_id);
			console.log(image);
			console.log($(the_id));
			$(the_id).css('background',"url("+image+")");
			num_items++;
			equipped_items.push(all_items[item]);
			var before_ad = bonus_ad;
			calc_stats();
			var after_ad = bonus_ad - before_ad;
			$('#attack-damage').val(parseInt($('#attack-damage').val())+after_ad);
		}
		console.log(equipped_items);

	});

	$('.remove').on('click', function(e){
		var slot = $(this).context.id.split('-')[1];
		var item_slot = '#slot-'+slot;
		$(item_slot).css('background','');
		num_items--;
		equipped_items.splice(slot-1,1);
		var before_ad = bonus_ad;
		calc_stats();
		var after_ad = bonus_ad - before_ad;
		$('#attack-damage').val(parseInt($('#attack-damage').val())+after_ad);
	});

	calc_stats = function calculate_bonus_stats(){
		bonus_hp = 0;
		bonus_mana = 0;
		bonus_armor = 0;
		bonus_mr = 0;
		bonus_ad = 0;
		bonus_ap = 0;
		bonus_ms = 0;
		bonus_as = 0;
		pcent_bonus_as = 0;
		bonus_crit = 0;
		bonus_lifesteal = 0;
		for(var item in equipped_items){
			for(stat in equipped_items[item].stats){
				var nums = equipped_items[item].stats[stat];
				switch(stat){
					case 'FlatCritChanceMod':
						bonus_crit+= nums*100;
						break;
					case 'FlatHpPoolMode':
						bonus_hp+=nums;
						break;
					case 'FlatMPPoolMod':
						bonus_mana+=nums;
						break;
					case 'FlatPhysicalDamageMod':
						bonus_ad+=nums;
						break;
					case 'PercentAttackSpeedMod':
						pcent_bonus_as+=nums*100;
						break;
					case 'PercentMovementSpeedMod':
						bonus_ms+=nums*100;
					case 'FlatMagicDamageMod':
						bonus_ap+=nums;
				}
			}
		}
		console.log(bonus_ad);
	}
})(jQuery);