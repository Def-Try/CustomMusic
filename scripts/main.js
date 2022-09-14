let nowplaying = null;
let playing = false;
let paused = false;
let sboxmusics = [];
let atkmusics = [];
let survmusics = [];
let pvpmusics = [];
let genmusics = [];
let bossmusics = [];
let state = null;
let attempts = 42;
let nowposition = 0;
let nomusic = false;

Events.on(ClientLoadEvent, () => {
	let files = Fi(Vars.mods.getMod("custommusic").file.path() + "/music/sandbox").seq()
	for(let i = 0; i < files.size; i++){sboxmusics.splice(0,0,files.get(i));}
	files = Fi(Vars.mods.getMod("custommusic").file.path() + "/music/attack").seq()
	for(let i = 0; i < files.size; i++){atkmusics.splice(0,0,files.get(i));}
	files = Fi(Vars.mods.getMod("custommusic").file.path() + "/music/survival").seq()
	for(let i = 0; i < files.size; i++){survmusics.splice(0,0,files.get(i));}
	files = Fi(Vars.mods.getMod("custommusic").file.path() + "/music/pvp").seq()
	for(let i = 0; i < files.size; i++){pvpmusics.splice(0,0,files.get(i));}
	files = Fi(Vars.mods.getMod("custommusic").file.path() + "/music/general").seq()
	for(let i = 0; i < files.size; i++){genmusics.splice(0,0,files.get(i));}
	files = Fi(Vars.mods.getMod("custommusic").file.path() + "/music/boss").seq()
	for(let i = 0; i < files.size; i++){bossmusics.splice(0,0,files.get(i));}
	//some functions that i can use later so uhh
	var play = (music, volume) => {
		if (isplaying()) {
			return false
		}
		nowplaying = music
		nowplaying.setVolume(volume); 
		nowplaying.play()
		return true
	}
	var stop = () => {
		if (nowplaying == null) return 0
		nowplaying.stop()
		nowplaying = null
		attempts = 42
		nowposition = 0
		return true
	}
	var setvolume = (volume) => {
		if (isplaying()) {
			nowplaying.setVolume(volume)
			return true
		}
		return false
	}
	var isplaying = () => {
		return nowplaying && nowplaying.isPlaying() ? true : false
	}
	var musicCheck = () => {
		if(bossmusics[0] != null){
			Musics.boss1.stop()
			Musics.boss2.stop()
		}
		if(!nomusic) {
			Musics.game1.stop()
			Musics.game2.stop()
			Musics.game3.stop()
			Musics.game4.stop()
			Musics.game5.stop()
			Musics.game6.stop()
			Musics.game7.stop()
			Musics.game8.stop()
			Musics.game9.stop()
			Musics.fine.stop()
		}
		if(nomusic && genmusics[0] != null){
			if (isplaying()) return 0;
			    if (!isplaying()) {
			    	Core.audio.soundBus.stop()
			    	Core.audio.musicBus.play()
			    	Core.audio.soundBus.play()
			    	if(attempts < 3){
			    		play(nowplaying, Core.settings.getInt("musicvol") / 100)
			    		nowplaying.setPosition(nowposition)
			    		attempts++
			    		return 0
			    	}
			    	if(nowplaying != null){
			    		nowplaying.dispose()
			    	}
			    	play(Music(genmusics[Math.floor(Math.random()*genmusics.length)]), Core.settings.getInt("musicvol") / 100)
			    	attempts = 0
			    	return 0
			    }
			    nowposition = nowplaying.getPosition()
			    setvolume(Core.settings.getInt("musicvol") / 100)
			    return 0
		}
	}

	Events.on(WaveEvent, e => Time.run(Math.random()*(15-8)+8 * 60, () => { //on boss
        let boss = Vars.state.rules.spawns.contains(group => group.getSpawned(state.wave - 2) > 0 && group.effect == StatusEffects.boss);

        if(boss){
            stop()
            play(Music(bossmusics[Math.floor(Math.random()*bossmusics.length)]), Core.settings.getInt("musicvol") / 100)
        }
    }));

	var update = () => {
		playing = Vars.state.isGame(); // some checks
		paused = Vars.state.isGame() && Core.scene.hasDialog();
		if (paused) {
			Core.audio.musicBus.setFilter(0, Filters.BiquadFilter)
		}else{
			Core.audio.musicBus.setFilter(0, null)
		}
		if (!playing){ stop(); return 0}
		if (Vars.state.rules.mode() == Gamemode.sandbox) { // sbox musics
			if(sboxmusics[0] == null) {return 0; nomusic = true;}
			if (isplaying()) return 0;
		    if (!isplaying()) {
		    	Core.audio.soundBus.stop()
		    	Core.audio.musicBus.play()
		    	Core.audio.soundBus.play()
		    	if(attempts < 3){
		    		play(nowplaying, Core.settings.getInt("musicvol") / 100)
		    		nowplaying.setPosition(nowposition)
		    		attempts++
		    		return 0
		    	}
		    	if(nowplaying != null){
		    		nowplaying.dispose()
		    	}
		    	play(Music(sboxmusics[Math.floor(Math.random()*sboxmusics.length)]), Core.settings.getInt("musicvol") / 100)
		    	attempts = 0
		    	return 0
		    }
		    nowposition = nowplaying.getPosition()
		    return 0
		}else if (Vars.state.rules.mode() == Gamemode.attack) { // atk musics
			if(atkmusics[0] == null) {return 0; nomusic = true;}
			if (isplaying()) return 0;
		    if (!isplaying()) {
		    	Core.audio.soundBus.stop()
		    	Core.audio.musicBus.play()
		    	Core.audio.soundBus.play()
		    	if(attempts < 3){
		    		play(nowplaying, Core.settings.getInt("musicvol") / 100)
		    		nowplaying.setPosition(nowposition)
		    		attempts++
		    		return 0
		    	}
		    	if(nowplaying != null){
		    		nowplaying.dispose()
		    	}
		    	play(Music(atkmusics[Math.floor(Math.random()*atkmusics.length)]), Core.settings.getInt("musicvol") / 100)
		    	attempts = 0
		    	return 0
		    }
		    nowposition = nowplaying.getPosition()
		    return 0
		}else if (Vars.state.rules.mode() == Gamemode.survival) { // surv musics
			if(survmusics[0] == null) {return 0; nomusic = true;}
			if (isplaying()) return 0;
		    if (!isplaying()) {
		    	Core.audio.soundBus.stop()
		    	Core.audio.musicBus.play()
		    	Core.audio.soundBus.play()
		    	if(attempts < 3){
		    		play(nowplaying, Core.settings.getInt("musicvol") / 100)
		    		nowplaying.setPosition(nowposition)
		    		attempts++
		    		return 0
		    	}
		    	if(nowplaying != null){
		    		nowplaying.dispose()
		    	}
		    	play(Music(survmusics[Math.floor(Math.random()*survmusics.length)]), Core.settings.getInt("musicvol") / 100)
		    	attempts = 0
		    	return 0
		    }
		    nowposition = nowplaying.getPosition()
		    return 0
		}else if (Vars.state.rules.mode() == Gamemode.pvp) { // pvp musics
			if(pvpmusics[0] == null) {return 0; nomusic = true;}
			if (isplaying()) return 0;
		    if (!isplaying()) {
		    	Core.audio.soundBus.stop()
		    	Core.audio.musicBus.play()
		    	Core.audio.soundBus.play()
		    	if(attempts < 3){
		    		play(nowplaying, Core.settings.getInt("musicvol") / 100)
		    		nowplaying.setPosition(nowposition)
		    		attempts++
		    		return 0
		    	}
		    	if(nowplaying != null){
		    		nowplaying.dispose()
		    	}
		    	play(Music(pvpmusics[Math.floor(Math.random()*pvpmusics.length)]), Core.settings.getInt("musicvol") / 100)
		    	attempts = 0
		    	return 0
		    }
		    nowposition = nowplaying.getPosition()
		    return 0
		}
		stop()
		setvolume(Core.settings.getInt("musicvol") / 100)
		return
	}

	Timer.schedule(() => {
	    update()
	    musicCheck()
	}, 0, 0.02);
})