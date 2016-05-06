(function($){
	var siege_creep = {
		 'current_hp': 700,
		 'base_hp': 700,
		 'damage': 0,
		 'current_armor': 15,
		 'base_armor': 15,
		 'current_mr': 0,
		 'base_mr':0,
		 'hp_growth': 27,
		 'armor_growth': 3,
		 'mr_growth':3,
		 'initial_spawn':150
	}
	var melee_creep = {
		 'current_hp': 445,
		 'base_hp': 445,
		 'damage': 0,
		 'current_armor': 0,
		 'base_armor': 0,
		 'current_mr': 0,
		 'base_mr':0,
		 'hp_growth': 20,
		 'armor_growth': 3,
		 'mr_growth':1.25,
 		 'initial_spawn':75
	}
	var caster_creep = {
		 'current_hp': 280,
		 'base_hp': 280,
		 'damage': 0,
		 'current_armor': 0,
		 'base_armor': 0,
		 'current_mr': 0,
		 'base_mr':0,
		 'hp_growth': 15,
		 'armor_growth': 1.25,
		 'mr_growth':1.25,
 		 'initial_spawn':90
	}
	var creep_list = [siege_creep,melee_creep,caster_creep];

	creep_index = 0;
	//formula  100 / (100 + Armor) = D
	$('#timeslider').slider({
		value:90,
		min:90,
		max:4320,
		step:1,
		slide: function(event,ui){
			var total_seconds = ui.value;
			minutes = Math.floor(total_seconds/60);
			seconds = total_seconds % 60;
			$('#time-span').html(minutes+':'+seconds);
			compute_minion_stats(total_seconds);
			set_displays();
		}
	});

	$('.pick-creeps').on('click',function(e){
		var the_id = $(this).context.id;
		var image = $(this).attr('src');
		$('.main-image').css('background',"url("+image+")");
		creep_index = (the_id == 'siege') ? 0 : (the_id =='melee') ? 1 : 2;
		var seconds = $('#timeslider').slider("option", "value");
		compute_minion_stats(seconds);
		set_displays();
	});

	function compute_minion_stats(seconds){
		var seconds_since_spawn = seconds - creep_list[creep_index].initial_spawn;
		if(seconds_since_spawn<0){
			seconds_since_spawn = 0;
		}
		creep_list[creep_index].current_hp = creep_list[creep_index].base_hp + (creep_list[creep_index].hp_growth*(Math.floor(seconds_since_spawn/180)));
		creep_list[creep_index].current_armor = creep_list[creep_index].base_armor + (creep_list[creep_index].armor_growth*(Math.floor(seconds_since_spawn/180)));
		creep_list[creep_index].current_mr = creep_list[creep_index].base_mr + (creep_list[creep_index].mr_growth*(Math.floor(seconds_since_spawn/180)));

	}
	$('#reset-hp').click(function(){
		console.log('here');
		creep_list[creep_index].damage = 0;
		set_displays();
		
	});
	$('#auto-attack').click(function(){
		var ad = $('#attack-damage').val();
		creep_list[creep_index].damage += ad * (100 / (100 + creep_list[creep_index].current_armor));
		set_displays();
	});

	function set_displays(){
		$('#num-span').html((Math.floor(creep_list[creep_index].current_hp - creep_list[creep_index].damage))+'/'+creep_list[creep_index].current_hp+ ' hp - ' + creep_list[creep_index].current_armor + ' armor - ' + creep_list[creep_index].current_mr + ' mr');
		$('#percents').html(Math.floor(100-(100*(100 / (100 + creep_list[creep_index].current_armor))))+'% reduced physical - '+ Math.floor(100-100*((100 / (100 + creep_list[creep_index].current_mr))))+'% reduced magic');
		var hp_bar = 100 - (100 * (creep_list[creep_index].damage / creep_list[creep_index].current_hp)); //bar len formula
		$('.main-image-hp').css('width', hp_bar + '%');
	}
})(jQuery);