(function($){
	var all_champions = [];
	var current_champ;
	var current_Q;
	var current_W;
	var current_E;
	var current_R;
	var level = 1;

	
	$('#level-slider').slider({
		value:1,
		min:1,
		max:18,
		step:1,
		slide: function(event,ui){
			level = ui.value;
			$('#level-span').html('Level ' +level);
			$('#attack-damage').val(Math.floor(current_champ.stats.attackdamage + get_level_ad(current_champ)));
		}
	});


	$('.description-text').hide();
	$('.ability').hover(function(){
		var ability = this.className.split(' ')[0];
		var to_show = document.getElementById(ability).id;
		to_show = '#' + to_show;
		$(to_show).show();
	},
	function(){
		var ability = this.className.split(' ')[0];
		var to_show = document.getElementById(ability).id;
		to_show = '#' + to_show;
		$(to_show).hide();
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
		if(name=='Aatrox'){
			asign_champs(all_champions['Aatrox']);
		}

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
		asign_champs(current_champ);
		
	});

	function asign_champs(current_champ){
		$('.selected-champion').attr('src','http://ddragon.leagueoflegends.com/cdn/6.8.1/img/champion/'+current_champ.id+'.png' )
		$('#attack-damage').val(Math.floor(current_champ.stats.attackdamage + get_level_ad(current_champ)));
		$('.Q.ability').attr('src', 'http://ddragon.leagueoflegends.com/cdn/6.8.1/img/spell/'+current_champ.spells[0].image.full);
		$('.W.ability').attr('src', 'http://ddragon.leagueoflegends.com/cdn/6.8.1/img/spell/'+current_champ.spells[1].image.full);
		$('.E.ability').attr('src', 'http://ddragon.leagueoflegends.com/cdn/6.8.1/img/spell/'+current_champ.spells[2].image.full);
		$('.R.ability').attr('src', 'http://ddragon.leagueoflegends.com/cdn/6.8.1/img/spell/'+current_champ.spells[3].image.full);
		var Q = current_champ.spells[0].tooltip;
		var W = current_champ.spells[1].tooltip;
		var E = current_champ.spells[2].tooltip;
		var R = current_champ.spells[3].tooltip;
		desc_replacer(current_champ,Q,0,0,'#Q');
		desc_replacer(current_champ,W,1,0,'#W');
		desc_replacer(current_champ,E,2,0,'#E');
		desc_replacer(current_champ,R,3,0,'#R');
	}

	function desc_replacer(champ,stat_desc,spell,spelllevel,qwer){
		if(stat_desc.includes('{{ a1 }}')){
			stat_desc = stat_desc.replace('{{ a1 }}', 100 * champ.spells[spell].vars[0].coeff +'% ' +champ.spells[spell].vars[0].link ).replace('class','style').replace('color','color:#');			
		}
		if(stat_desc.includes('{{ a2 }}')){
			stat_desc = stat_desc.replace('{{ a2 }}', 100 * champ.spells[spell].vars[0].coeff +'% ' +champ.spells[spell].vars[1].link ).replace('class','style').replace('color','color:#');			
		}
		if(stat_desc.includes('{{ e1 }}')){
			stat_desc = stat_desc.replace('{{ e1 }}',champ.spells[spell].effect[1][spelllevel]);			
		}
		if(stat_desc.includes('{{ e2 }}')){
			stat_desc = stat_desc.replace('{{ e2 }}',champ.spells[spell].effect[2][spelllevel]);
		}
		if(stat_desc.includes('{{ e3 }}')){
			stat_desc = stat_desc.replace('{{ e3 }}',champ.spells[spell].effect[3][spelllevel]);
		}
		if(stat_desc.includes('{{ e4 }}')){
			stat_desc = stat_desc.replace('{{ e4 }}',champ.spells[spell].effect[4][spelllevel]);
		}
		if(stat_desc.includes('{{ e5 }}')){
			stat_desc = stat_desc.replace('{{ e5 }}',champ.spells[spell].effect[5][spelllevel]);
		}
		if(stat_desc.includes('{{ e6 }}')){
			stat_desc = stat_desc.replace('{{ e6 }}',champ.spells[spell].effect[6][spelllevel]);
		}
		if(stat_desc.includes('{{ e7 }}')){
			stat_desc = stat_desc.replace('{{ e7 }}',champ.spells[spell].effect[7][spelllevel]);
		}
		if(stat_desc.includes('{{ e8 }}')){
			stat_desc = stat_desc.replace('{{ e8 }}',champ.spells[spell].effect[8][spelllevel]);
		}
		$(qwer).html('');
		$(qwer).append('<br/>' +stat_desc );
	}

	function get_level_ad(current_champ){

		return parseInt(level *current_champ.stats.attackdamageperlevel);
	}


})(jQuery);