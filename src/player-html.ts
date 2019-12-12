function loadPlayer(videoId: string, playerVars: any) {
  return `<!DOCTYPE html>
    <html>
    <head>
        <title>RN Youtube Web Player</title>
        <meta charset="UTF-8">

        <style>
            #player {
                height: 100vh;
                width: 100vw;
            }

            body {
                margin: 0;
            }

            .overlay {
                height: 0;
                width: 0;
                margin: 0;
                padding: 0;
                z-index: 1000;
                position: absolute;
                top: 0;
                left: 0;
            }
        </style>
    </head>

    <body>
        <div id="player"></div>
        <div class="overlay"></div>

        <script>            
            var player;
            var overlay = document.querySelector('.overlay');

            function fetchYoutubePlayer() {                
                var tag = document.createElement("script");

                tag.src = "https://www.youtube.com/iframe_api";

                function onLoadingError(error) {
                    sendMessage('onLoadingError');
                }

                tag.onerror = onLoadingError;

                var firstScriptTag = document.getElementsByTagName("script")[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            } 
            
            function onYouTubeIframeAPIReady() {
                player = new YT.Player("player", {
                    videoId: '${videoId}',
                    playerVars: ${playerVars},
                    events: {
                        "onReady": onPlayerReady,
                        "onStateChange": onPlayerStateChange,
                        "onError": onPlayerError,
                    }
                });
            };

            function onPlayerError(event) {
              sendMessage('onPlayerError');
            }


            var data = {
                loaded: false,
                duration: 0,
                playlistIndex: -1,
                videoURL: '',
                currentTime: 0,
                playerState: -1,
                percentLoaded: 0,
                id: '${videoId}'
            };


            function updatePlayerData() {
                data.duration = player.getDuration();
                data.playerState = player.getPlayerState();
                data.percentLoaded = player.getVideoLoadedFraction();
                data.currentTime = player.getCurrentTime();
            }
      
            function onPlayerReady(event) {
                data.loaded = true;
                data.videoURL = player.getVideoUrl();
                data.playlistIndex = player.getPlaylistIndex();

                updatePlayerData();
                sendMessage('onPlayerReady');
            }
    
            function onPlayerStateChange(event) {
                updatePlayerData();
                sendMessage('onStateChange');             
            }

            function onMessageReceived(message) {    
                var data = JSON.parse(message.data);

                if (data && data.method) {
                    console.log({ player })
                    player[data.method](data.args);
                }
            }

            function onWindowError() {
                sendMessage('onWindowError');
            }

            function sendMessage(type) {
                var message = {
                    type: type,
                    data: data
                };

                window.ReactNativeWebView.postMessage(JSON.stringify(message), "*");
            }

            window.addEventListener("message", onMessageReceived);

            setTimeout(fetchYoutubePlayer, 0);

            window.onerror = onWindowError;

        </script>
    </body>
</html>`;
}

export { loadPlayer };
