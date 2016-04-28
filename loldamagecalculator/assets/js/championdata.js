(function($){
	var all_champions = [];
	var current_champ;

	
	$('#level-slider').slider({
		value:1,
		min:1,
		max:18,
		step:1,
		slide: function(event,ui){
			$('#level-span').html('Level ' + +ui.value);
			$('#attack-damage').val(Math.floor(current_champ.stats.attackdamage + get_level_ad()));
		}
	});




	function get_all_champs(){
		jQuery.ajax({
			type: 'GET',
			dataType: 'json',
			url: 'http://ddragon.leagueoflegends.com/cdn/6.8.1/data/en_US/champion.json',
			success: function(champions){
				// console.log(champions);
				for(var champ in champions.data){
					get_indev_champ(champ);
				}

			},
			error: function(e){
				console.log('error');
				console.log(e);
			}
		});
	}

	get_all_champs();

	function get_indev_champ(champion){
		jQuery.ajax({
			type: 'GET',
			dataType: 'json',
			url: 'http://ddragon.leagueoflegends.com/cdn/6.8.1/data/en_US/champion/'+champion+'.json',
			success: function(champ){
				populate_icons(champion);
				populate_champion_search(champion);
				fill_all_champions(champion,champ.data[champion]);

			},
			error: function(e){
				console.log('error');
				console.log(e);
			}
		});
	}

	function fill_all_champions(name,stats){
		all_champions[name] = stats;
	}

	function populate_champion_search(champ){
		current_champ = all_champions['Aatrox'];
		$('#champion-data-list').append("<option value='"+champ +"'>")
	}

	$('.champion-search').on('keyup',function(){
		var search = $('.champion-search').val();
		console.log(search);
		$('.champion-div').children().each(function(){
			var the_class = $(this).context.className; //champ-icon
			var the_id = $(this).context.id; //Name-image
			if(the_class == 'champ-icon' && !the_id.split('-')[0].includes(search)){
				$(this).hide();
			}
			else{
				$(this).show();
			}
		});
	});	


	function populate_icons(champ){
		var image = 'http://ddragon.leagueoflegends.com/cdn/6.8.1/img/champion/'+champ+'.png'
		$('.champion-div').append("<img id='"+champ+"-image' class='champ-icon' src='"+image+"'>");
	}
	$('.champion-div').on('click', '.champ-icon', function(e){
		current_champ = all_champions[e.target.id.split('-')[0]];
		console.log(current_champ);
		$('.selected-champion').attr('src','http://ddragon.leagueoflegends.com/cdn/6.8.1/img/champion/'+current_champ.id+'.png' )
		$('#attack-damage').val(Math.floor(current_champ.stats.attackdamage + get_level_ad()));
		$('.Q.ability').attr('src', 'http://ddragon.leagueoflegends.com/cdn/6.8.1/img/spell/'+current_champ.spells[0].image.full);
		$('.W.ability').attr('src', 'http://ddragon.leagueoflegends.com/cdn/6.8.1/img/spell/'+current_champ.spells[1].image.full);
		$('.E.ability').attr('src', 'http://ddragon.leagueoflegends.com/cdn/6.8.1/img/spell/'+current_champ.spells[2].image.full);
		$('.R.ability').attr('src', 'http://ddragon.leagueoflegends.com/cdn/6.8.1/img/spell/'+current_champ.spells[3].image.full);
	});

	function get_level_ad(){
		return parseInt($('#level-slider').slider('option','value'))*current_champ.stats.attackdamageperlevel;
	}


})(jQuery);