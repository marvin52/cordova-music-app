(function() {
	'use strict';

	angular
	  .module('music-player')
	  .controller('nowPlayingCtrl', nowPlayingCtrl);

	nowPlayingCtrl.$inject = ['$ionicLoading','$cordovaSocialSharing','$ionicPopover','$scope','$rootScope','$localForage','$stateParams','$cordovaMedia','favoriteSongs'];

	function nowPlayingCtrl($ionicLoading,$cordovaSocialSharing,$ionicPopover,$scope,$rootScope,$localForage,$stateParams,$cordovaMedia,favoriteSongs) {
		//content
		var vm = this,
		duration = 0,
		currentSongPosition = parseInt($stateParams.position),
		currentSongId = $stateParams.id,
		playSongAtEnter = $stateParams.play
		vm.song = "";
		vm.totalDuration = 0
		var currentTiemSong = {
			h : 0,
			m : 0,
			s : 0
		}

		vm.playlists
		vm.submenu = false

		vm.isFavorite = false
		$rootScope.isShuffle = false
		$rootScope.isFromPlaylist = false

		$rootScope.songhasend = false

		//@$stateParams.id identificador de cancion
		//@$stateParams.position posición del arreglo

		$ionicPopover.fromTemplateUrl('templates/popover.html', {
	    	scope: $scope
	 	}).then(function(popover) {
	    	$scope.popover = popover;
	  	});

		vm.openPopover = function($event){
			$scope.popover.show($event);

			//get al playlist
	 		$localForage.getItem('playlist').then(function(playlists){
	 			vm.playlists = playlists
	 		})
	 	}

	 	vm.closePopover = function(){
	 		$scope.popover.hide()
	 	}

	 	$rootScope.shareVia = function(platform){
	 		$ionicLoading.show({
		      template: '<ion-spinner></ion-spinner><p>Please wait ...</p>'
		    });
	 		$rootScope.closePopOver()

	 		//imagen o url
	 		if($rootScope.songCover.indexOf('http') == -1){
	 			$rootScope.songCover = 'file://'+$rootScope.songCover
	 		}

	 		switch(platform){
	 			case 'Facebook':
	 				
 				$cordovaSocialSharing
			    .shareViaFacebook('I\'m listening '+$rootScope.songTitle+' | '+$rootScope.songAuthor, $rootScope.songCover, '')
			    .then(function(result) {
			      // Success!
			      $ionicLoading.hide();
			    }, function(err) {
			    	$ionicLoading.hide();
			      // An error occurred. Show a message to the user
			    });

	 			break;
	 			case 'Twitter':

	 			$cordovaSocialSharing
			    .shareViaTwitter('I\'m listening '+$rootScope.songTitle+' | '+$rootScope.songAuthor, $rootScope.songCover, '')
			    .then(function(result) {
			      // Success!
			      $ionicLoading.hide();
			    }, function(err) {
			    	$ionicLoading.hide();
			      // An error occurred. Show a message to the user
			    });

	 			break;
	 			case 'Whatsapp':

	 			$cordovaSocialSharing
			    .shareViaWhatsApp('I\'m listening '+$rootScope.songTitle+' | '+$rootScope.songAuthor, $rootScope.songCover, '')
			    .then(function(result) {
			      // Success!
			      $ionicLoading.hide();
			    }, function(err) {
			    	$ionicLoading.hide();
			      // An error occurred. Show a message to the user
			    });

	 			break;
	 		}
	 	}

	 	$rootScope.closePopOver = vm.closePopover

	 	vm.addToPlaylist = function(pid,sid){
	 		if(undefined != pid && undefined != sid){
	 			//buscar la cancion en songList
	 			$localForage.getItem('songList').then(function(songs){
	 			
	 				if(undefined != songs && songs.length > 0){
	 					var song = _.find(songs,{'Id' : sid})

	 					if(undefined != song){
	 						//añadimos la canción la playlist
	 						song.pid = pid

	 						$localForage.getItem('playlistSongs').then(function(psongs){
	 							if(undefined != psongs && psongs.length > 0){
	 								//existen canciones
	 								//verificar que no exista en la playlist
	 								var exist = _.findIndex(psongs,song);
	 								//console.log('exist => '+exist,psongs[exist])

	 								if(undefined != psongs[exist] || null != psongs[exist]){
	 									//avisar
	 									console.log('ya existe en esta lista')
	 								}else{
	 									//console.log('no existe')
	 									psongs.push(song)
	 									$localForage.setItem('playlistSongs',psongs)
	 								}
	 							}else{
	 								var psongs = []
	 								psongs.push(song)
	 								$localForage.setItem('playlistSongs',psongs)
	 								//no existen canciones
	 							}
	 						})
	 					}
	 				}
	 			})
	 		}
	 	}

		vm.getCurrentSong = function(id,position,plsid){
			document.getElementById('timer').style.width = '0%'
			//colores
			setTimeout(function(){


			var img = document.querySelector('#vibimg'),
			vibrant = new Vibrant(img),
            swatches = vibrant.swatches(),
            vibrantColor = swatches['Vibrant'],
             
            // ['Vibrant', 'Mutted', ...]
            // swatches;
         
            // Regresa el color en RGB
            rgb = vibrantColor.getRgb(),
         
            // Regresa el color en hexadecimal                   
            hex = vibrantColor.getHex(),
         
            // Regresa el color en HSL
            hsl = vibrantColor.getHsl(),
         
            // Regresa la cantidad de veces que el color aparece en la imagen procesada
            population = vibrantColor.getPopulation(),            
         
            // Regresa el color recomendado para títulos sobre este color
            titleColor = vibrantColor.getTitleTextColor(), 
         
            // Regresa el color recomendado para párrafos sobre este color
            bodyColor = vibrantColor.getBodyTextColor();

            //window.plugins.tintstatusbar.setColor(hex)

            //cambiar los colores de los controles dependiendo de vagrant
            var components = document.getElementsByClassName('control'),
            buttons = document.getElementsByClassName('action-box')

            for(var i = 0; i < components.length; i++){
			    components[i].style.color = hex //color
			    components[i].style['text-shadow'] = '1px 0px 13px '+hex //shadow
			}

			for(var i = 0; i < buttons.length; i++){
			    buttons[i].style.border = hex //color
			    buttons[i].style['box-shadow'] = '1px 0px 13px '+hex //shadow
			}

            //console.log(rgb,hex,hsl,population,titleColor,bodyColor);

            //setear colores recomendados 
            document.getElementById('song-artist').style.color = titleColor
            document.getElementById('song-duration').style.color = titleColor
            document.getElementById('song-title').style.color = titleColor
            },250)
			$rootScope.songhasend = false
			//si el id y la posición no están vacíos
			$rootScope.hideMiniControls = false
			vm.durationensecs = 0
			///console.log(id,position,plsid)
			if(undefined != id && undefined != position){

				//verificar que la canción provenga de una playlist
				var db = 'songList'
				if($rootScope.isFromPlaylist && plsid > 0){
					db = 'playlistSongs'
					$rootScope.plsid = plsid
				}else{
					$rootScope.isFromPlaylist = false
				}
				$localForage.getItem(db).then(function(songs) {
					//se parseo el Id porque sino, no encuentra la canción,
					//por el tipo de dato
					//limpiar el intervalo de tiempo
					clearInterval(duration)
					clearIntervals()
					if($rootScope.isFromPlaylist){
						//console.log(songs)
						//buscar las canciones de la playlist
						vm.song = _.find(songs,{ 'pid' : parseInt(plsid), 'Id': id })
						//console.log('desde play list => '+JSON.stringify(vm.song))
						//buscar la canción en cuestión
						//vm.song = _.find(plsSongs, { 'Id': id });
					}else{
						vm.song = _.find(songs, { 'Id': id });
						//console.log('reprod normal => '+JSON.stringify(vm.song))
					}	
					
					vm.sonDuration = vm.song.Duration / 1000
					vm.durationensecs = parseInt(vm.song.Duration) / 1000       
		        	vm.totalDuration = secs2time(parseInt(vm.song.Duration)/1000);
		        	vm.song.Duration = secs2time(parseInt(vm.song.Duration)/1000);
		        	$rootScope.songTitle = vm.song.Title
		        	$rootScope.songAuthor = vm.song.Author
		        	$rootScope.songCover = vm.song.Cover
		        	$rootScope.songId = id
		        	$rootScope.songPosition = position
		        	//console.log(id)

		        	//verificar que sea favorita
		        	favoriteSongs.isFavorite(id).then(function(is){
		        		//console.log('la cancion es favorita? => '+is)
		        		if(is == 'true'){
			    			vm.isFavorite = true
		        		}else{
		        			vm.isFavorite = false
		        		}
		        	})

		        	//widget
			        MusicControls.destroy()

			        MusicControls.create({
					    track: vm.song.Title,				//Requierd 
						artist: vm.song.Author,			//Required 
					    cover: vm.song.Cover,	//Required 
						album: vm.song.Album,				//Optional, Only visible on Android 
					    isPlaying: true,				//Required
						ticker : "Escuchando : "+vm.song.Title
					}, onSuccess, onError);

			        if($rootScope.isPlaying){
						vm.stopSong(); //detener la canción actual
					}
			        //comienza para reproducción
					$rootScope.media = $cordovaMedia.newMedia(vm.song.Path);
					
					$rootScope.playSong()
					
					//almacenar la posición actual de la canción
					$rootScope.songPosition = position
					$rootScope.isPlaying = true;

					document.getElementById('circle').style['stroke-dashoffset'] = 200
					//actualizar la barra de tiempo
					var time = vm.durationensecs; /* how long the timer runs for */
					var initialOffset = '200';
					var i = 1
					$rootScope.interval = setInterval(function() {
					document.getElementById('circle').style['stroke-dashoffset'] = initialOffset-(i*(initialOffset/time))
					    if (i == time) {
					    	clearIntervals()
					    }
					    if(!$rootScope.pauseInterval){
					    	i++;  
					    }
					}, 1000);

					//duración de canción
					duration = setInterval(function(){
						//vm.song.Duration => {h,i,s}
						$rootScope.media.currentTime().then(
							function(data){
								//console.log('tiempo => '+data)
								if(undefined == data.status){
									clearInterval(duration)
									$rootScope.nextSong($rootScope.songPosition);
								}
								var tiempoActual = secs2time(Math.round(data.status.value))
								//var maxDuration = data.status.value
								var sec = 0;
								var mins = 0;
								var hrs = 0;
								if(tiempoActual.h <= 9){
									hrs = '0'+tiempoActual.h
								}else{
									hrs = tiempoActual.h
								}
								if(tiempoActual.m <= 9){
									mins = '0'+tiempoActual.m
								}else{
									mins = tiempoActual.m
								}
								if(tiempoActual.s <= 9){
									sec = '0'+tiempoActual.s
								}else{
									sec = tiempoActual.s
								}

								//actualizar el tiempo de la canción
								vm.song.Duration.h = hrs
								vm.song.Duration.m = mins
								vm.song.Duration.s = sec
								//console.log(data.status.value,vm.sonDuration)
								//material design
								//var timer = parseInt(document.getElementById('timer').style.width)
								var current = (data.status.value * 100) / vm.sonDuration
                            	//mediaDiv =  self.$actualSongStatus ? self.$actualSongStatus : $('#SongStatus');
                            	document.getElementById('timer').style.width = current+'%'
                        		//mediaDiv.css("width",current+'%');
								//verificar cuado acabe una canción y cambiar a la siguiente
								
								if(parseInt(hrs) == vm.totalDuration.h 
									&& parseInt(mins) == vm.totalDuration.m 
									&& parseInt(sec) == (vm.totalDuration.s)
								){
									//console.log(hrs,mins,sec,vm.totalDuration.h,vm.totalDuration.m,vm.totalDuration.s-2)
									if($rootScope.inBackground){
										$rootScope.songhasend = true
									}else{
										$rootScope.nextSong($rootScope.songPosition);
									}
									

								}
							},
							function(error){
								console.log('error => '+error)
							}
						);
						
					},1000)
		        });

			}
		}

		function clearIntervals(){
			clearInterval($rootScope.interval);
		}

		function onSuccess(success){
			//console.log('Bien! => '+success)

			function events(action) {
				switch(action){
					case 'music-controls-next':
						//Do something 
						clearIntervals()
						$rootScope.nextSong($rootScope.songPosition);
					break;
					case 'music-controls-previous':
						//Do something 
						clearIntervals()
						$rootScope.prevSong($rootScope.songPosition);
					break;
					case 'music-controls-pause':
						//Do something
						if($rootScope.isPlaying){
							$rootScope.pauseSong()
							MusicControls.updateIsPlaying(false);
						}else{
							$rootScope.playSong()
							MusicControls.updateIsPlaying(true);
						}
					break;
					case 'music-controls-play':
						//Do something 
						$rootScope.playSong()
						MusicControls.updateIsPlaying(true);
					break;
			 
					//Headset events 
					case 'music-controls-headset-unplugged':
						//Do something 
						break;
					case 'music-controls-headset-plugged':
						//Do something 
						break;
					case 'music-controls-headset-button':
						//Do something 
						break;
					default:
						break;
				}
			}

			//Register callback 
			MusicControls.subscribe(events);
			 
			//Start listening for events 
			MusicControls.listen();
		}

		function onError(error){
			console.log('error => '+error)
		}

		$rootScope.playSong = function(){
			$rootScope.isPlaying = true
			$rootScope.pauseInterval = false
			$rootScope.media.play()
		}
		$rootScope.pauseSong = function(){
			$rootScope.isPlaying = false
			$rootScope.pauseInterval = true
			$rootScope.media.pause()
		}
		vm.stopSong = function(){
			$rootScope.media.stop()
		}
		$rootScope.nextSong = function(position){
			position = (undefined != position) ? position : 0;
			
			var db = 'songList'
			if($rootScope.isFromPlaylist){
				db = 'playlistSongs'
				console.log('posición actual => '+position)
			}
			//si está activado el shuffle
			if(!$rootScope.isShuffle){
				$localForage.getItem(db).then(function(songs) {

					//buscar la posición de playlists
					if($rootScope.isFromPlaylist){
						var newSongs = []
						for(var i = 0; i < songs.length; i++){
							if(songs[i].pid == parseInt($rootScope.plsid)){
								newSongs.push(songs[i])
							}
						}

						songs = newSongs
						//console.log(songs)
					}

					var posicion = songs[position+1]

					//posicion devuelve un objeto de cancion
					var Id = (undefined != posicion) ? posicion.Id : songs[0].Id ;
					if(undefined != posicion){
					   if($rootScope.isFromPlaylist){
					   		vm.getCurrentSong(Id,parseInt(position)+1,$rootScope.plsid)
					   }else{
					   		vm.getCurrentSong(Id,parseInt(position)+1)
					   }	
					}else{
						//mostrar la primera canción de la lista
					    if($rootScope.isFromPlaylist){
					   		vm.getCurrentSong(Id,0,$rootScope.plsid)
					   }else{
					   		vm.getCurrentSong(Id,0)
					   }
					}
				});
			}else{
				$localForage.getItem(db).then(function(songs){

					//buscar la posición de playlists
					if($rootScope.isFromPlaylist){
						var newSongs = []
						for(var i = 0; i < songs.length; i++){
							if(songs[i].pid == parseInt($rootScope.plsid)){
								newSongs.push(songs[i])
							}
						}

						songs = newSongs
						//console.log(songs)
					}

		    		var length = songs.length,
		    		newposition = _.random(length),
		    		playthis = songs[newposition]

		    		//buscar la posición de playlists
					if($rootScope.isFromPlaylist){
						vm.getCurrentSong(playthis.Id,newposition,$rootScope.plsid)
					}else{
						vm.getCurrentSong(playthis.Id,newposition)
					}
		    		
		    	})
			}
		}

		$rootScope.prevSong = function(position){
			position = (undefined != position) ? position : 0;
			
			var db = 'songList'
			if($rootScope.isFromPlaylist){
				db = 'playlistSongs'
				console.log('posición actual => '+position)
			}
			//si está activado el shuffle
			if(!$rootScope.isShuffle){
				$localForage.getItem(db).then(function(songs) {

					//buscar la posición de playlists
					if($rootScope.isFromPlaylist){
						var newSongs = []
						for(var i = 0; i < songs.length; i++){
							if(songs[i].pid == parseInt($rootScope.plsid)){
								newSongs.push(songs[i])
							}
						}

						songs = newSongs
						//console.log(songs)
					}

					var posicion = songs[position-1]

					//posicion devuelve un objeto de cancion
					var Id = (undefined != posicion) ? posicion.Id : songs[0].Id ;
					if(undefined != posicion){
					   if($rootScope.isFromPlaylist){
					   		vm.getCurrentSong(Id,parseInt(position)-1,$rootScope.plsid)
					   }else{
					   		vm.getCurrentSong(Id,parseInt(position)-1)
					   }	
					}else{
						//mostrar la primera canción de la lista
					    if($rootScope.isFromPlaylist){
					   		vm.getCurrentSong(Id,0,$rootScope.plsid)
					   }else{
					   		vm.getCurrentSong(Id,0)
					   }
					}
				});
			}else{
				$localForage.getItem(db).then(function(songs){

					//buscar la posición de playlists
					if($rootScope.isFromPlaylist){
						var newSongs = []
						for(var i = 0; i < songs.length; i++){
							if(songs[i].pid == parseInt($rootScope.plsid)){
								newSongs.push(songs[i])
							}
						}

						songs = newSongs
						//console.log(songs)
					}

		    		var length = songs.length,
		    		newposition = _.random(length),
		    		playthis = songs[newposition]

		    		//buscar la posición de playlists
					if($rootScope.isFromPlaylist){
						vm.getCurrentSong(playthis.Id,newposition,$rootScope.plsid)
					}else{
						vm.getCurrentSong(playthis.Id,newposition)
					}
		    		
		    	})
			}	
		}

		function secs2time(secs){
	        var hours = Math.floor(secs / (60 * 60));

	        var divisor_for_minutes = secs % (60 * 60);
	        var minutes = Math.floor(divisor_for_minutes / 60);

	        var divisor_for_seconds = divisor_for_minutes % 60;
	        var seconds = Math.ceil(divisor_for_seconds);

	        var obj = {
	            "h": hours,
	            "m": minutes,
	            "s": seconds
	        };
	        return obj;
	    }

	    //other controls
	    $rootScope.shuffle = function(){
	    	//reproducir canciones aleatorias (sencillo)
	    	//obtener la longitud de las canciones
	    	if($rootScope.isShuffle){
	    		$rootScope.isShuffle = false
	    	}else{
		    	$rootScope.isShuffle = true
	    	}
	    	
	    }

	    $rootScope.addtoFavorites = function(id){
	    	//añadir a favoritos
	    	favoriteSongs.isFavorite(id).then(function(is){
        		//console.log('la cancion es favorita? => '+is,id)
        		if(is == 'true'){
        			//console.log('si es favorita')
        			favoriteSongs.deleteSong(id)
	    			vm.isFavorite = false
        		}else{
        			//console.log('no es favorita')
        			favoriteSongs.addtoFavorite(id)
	    			vm.isFavorite = true
        		}
        	})
	    }

	    $rootScope.$on('playSong', function(event, args) {
	    	vm.getCurrentSong(args.id,args.position)
	    });

	    $rootScope.$on('fromPlaylist',function(event,args){
	    	$rootScope.isFromPlaylist = true
	    	console.log('datos => '+JSON.stringify(args))
	    	vm.getCurrentSong(args.id,args.position,args.plsid)
	    })

	}
})();