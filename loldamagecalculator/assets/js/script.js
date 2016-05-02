(function($){
	var siege_creep = {
		 'hp': 700,
		 'damage': 0,
		 'armor': 15,
		 'mr':0
	}
	//formula  100 / (100 + Armor) = D
	$('#timeslider').slider({
		value:100,
		min:75,
		max:4320,
		step:1,
		slide: function(event,ui){
			var total_seconds = ui.value;
			minutes = Math.floor(total_seconds/60);
			seconds = total_seconds % 60;
			$('#time-span').html(minutes+':'+seconds);
			compute_siege_stats(total_seconds);
			set_displays();
		}
	});

	function compute_siege_stats(seconds){
		var seconds_since_spawn = seconds - 75;
		siege_creep.hp = 700 + (27*(Math.floor(seconds_since_spawn/180)));
		siege_creep.armor = 15 + (3*(Math.floor(seconds_since_spawn/180)));
		siege_creep.mr = 0 + (3*(Math.floor(seconds_since_spawn/180)));
	}
	$('#reset-hp').click(function(){
		console.log('here');
		siege_creep.damage = 0;
		set_displays();
		
	});
	$('#auto-attack').click(function(){
		var ad = $('#attack-damage').val();
		siege_creep.damage += ad * (100 / (100 + siege_creep.armor));
		set_displays();
	});

	function set_displays(){
		$('#num-span').html((Math.floor(siege_creep.hp - siege_creep.damage))+'/'+siege_creep.hp+ ' hp - ' + siege_creep.armor + ' armor - ' + siege_creep.mr + ' mr');
		$('#percents').html(Math.floor(100-(100*(100 / (100 + siege_creep.armor))))+'% reduced physical - '+ Math.floor(100-100*((100 / (100 + siege_creep.mr))))+'% reduced magic');
		var siege_bar_len = 100 - (100 * (siege_creep.damage / siege_creep.hp)); //bar len formula
		$('.main-image-hp').css('width', siege_bar_len + '%');
	}
})(jQuery);