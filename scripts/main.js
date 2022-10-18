var nowplaying = null;
var nowplayingFi = null;
var nowposition = 0;

var sandbox = Seq()
var survival = Seq()
var attack = Seq()
var pvp = Seq()
var general = Seq()
var menu = Seq()
var editor = Seq()
var planet = Seq()
var boss = Seq()
var waves = Seq()

Events.on(ClientLoadEvent, () => {
	Log.info("[CM]Started processing music...")
	var processMusic = (path) => {
		let array = Seq()
		let files = Core.files.get(path, Files.FileType.absolute).seq();
		for(let i = 0; i < files.size; i++) array.add(files.get(i));
		Log.info("[CM]Loaded music from " + path)
		return array
	}

	sandbox = processMusic(Vars.mods.getMod("custommusic").file.path() + "/music/sandbox");
	attack = processMusic(Vars.mods.getMod("custommusic").file.path() + "/music/attack");
	survival = processMusic(Vars.mods.getMod("custommusic").file.path() + "/music/survival");
	pvp = processMusic(Vars.mods.getMod("custommusic").file.path() + "/music/pvp");
	general = processMusic(Vars.mods.getMod("custommusic").file.path() + "/music/general");

	menu = processMusic(Vars.mods.getMod("custommusic").file.path() + "/music/menu");
	editor = processMusic(Vars.mods.getMod("custommusic").file.path() + "/music/editor");
	planet = processMusic(Vars.mods.getMod("custommusic").file.path() + "/music/planet",);
	boss = processMusic(Vars.mods.getMod("custommusic").file.path() + "/music/boss");

	processMusic(Vars.mods.getMod("custommusic").file.path() + "/music/waves", waves);

	Log.info("[CM]Defining functions...")
	var play = (music) => {
		if (isplaying()) return false;
		nowplayingFi = music
		nowplaying = Music(music);
		nowplaying.setVolume(Core.settings.getInt("musicvol") / 100); 
		nowplaying.play();
		Vars.ui.showInfoFade("Now playing " + music.parent().name() + "\":" + music.name() + "\"");
		return true;
	}
	var stop = () => {
		if (nowplaying == null) return false
		nowplaying.stop()
		nowplaying = null
		nowposition = 0
		return true
	}
	var setVolume = (volume) => {
		if (!isplaying()) return false;
		nowplaying.setVolume(volume);
		return true;
	}
	var isplaying = () => {

		return nowplaying && nowplaying.isPlaying()
	}
	var fade = (time) => {
		let i = 0;
		Timer.schedule(() => {
	    	setVolume((Core.settings.getInt("musicvol") / 100) * 1 - i);
	    	i = i + 0.01;
		}, 100, time / 100);
		stop()
	}
	var getMusic = () => {
		let playing = Vars.state.isGame();
		if(playing){
			switch(Vars.state.rules.mode()){
				case Gamemode.survival:
					return survival;
				case Gamemode.sandbox:
					return sandbox;
				case Gamemode.attack:
					return attack;
				case Gamemode.pvp:
					return pvp;
			}
		}
		let ineditor = Vars.ui.editor.isShown();
		let inplanet = Vars.ui.planet.isShown();
		if(ineditor) return editor;
		if(inplanet) return planet;
		return menu;
	}
	var playRandom = (musicarray) => {

		if (musicarray.size != 0) {
		    play(
		        musicarray.get(
		            Math.floor(Math.random()*musicarray.size+1)
		            )
		        )
		}
	}
	var musicIsGamemodes = (musicarray) => {

		return musicarray.toArray().includes(nowplayingFi);
	}
	var tryResume = () => {
		let attempts = 0;
		while(attempts < 3){
			nowplayingMusic.setPosition(nowposition);
			nowplayingMusic.play();
		}
	}
	var musicCheck = (musicarray) => {
		if(boss.size != 0){
			Musics.boss1.stop();
			Musics.boss2.stop();
		}
		if(musicarray.size != 0){
			Musics.game1.stop();
			Musics.game2.stop();
			Musics.game3.stop();
			Musics.game4.stop();
			Musics.game5.stop();
			Musics.game6.stop();
			Musics.game7.stop();
			Musics.game8.stop();
			Musics.game9.stop();
			Musics.fine.stop();
		}
		if(editor.size != 0) Musics.editor.stop();
		if(menu.size != 0) Musics.menu.stop();
		if(planet.size != 0) Musics.planet.stop();
	}
/*
	Log.info("[CM]Wave event handler register")
	Events.on(WaveEvent, (e) => { //on wave
		if(waves[0] != null){
			fade(5)
			Time.run(5, (e) => {
				let boss = Vars.state.rules.spawns.contains(group => group.getSpawned(state.wave - 2) > 0 && group.effect == StatusEffects.boss);
		        if(boss && boss[0] != null){
		            play(boss[Math.floor(Math.random()*boss.length)])
		        }else if (waves[0] != null){
		        	play(waves[Math.floor(Math.random()*waves.length)])
		        }
	    	}
	    }
    });
*/
	var update = () => {
		let musicarray = getMusic()
		musicCheck(musicarray)
		if(!isplaying()){
			if(nowplaying != null){
				tryResume();
			}
			Time.run(0.19, () => {
				if(!isplaying()){
					playRandom(musicarray);
				}
			})
		}
		if(isplaying()){
			nowposition = nowplaying.getPosition()
		}
		if(!musicIsGamemodes(musicarray)){
			stop();
			playRandom(musicarray);
		}
	}
	Log.info("[CM]Running update task")
	Timer.schedule(() => {
	    update()
	}, 0, 0.02);
	Log.info("[CM]Successfully loaded!")
});
