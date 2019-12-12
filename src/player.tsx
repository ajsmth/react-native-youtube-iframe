import React from 'react';
import { StyleProp } from 'react-native';
import {
  WebView,
  WebViewMessageEvent,
  WebViewProps,
} from 'react-native-webview';
import { loadPlayer } from './player-html';

// TODO
// ref to control player directly?
// volume controls maybe?
// captions not working for some reason

interface PlayerState {
  id: string;
  duration: number;
  playlistIndex: number;
  videoURL: string;
  currentTime: number;
  playerState: number;
  percentLoaded: number;
  loaded: boolean;
  captions: boolean;
}

const initialPlayerState: PlayerState = {
  id: '',
  duration: 0,
  playlistIndex: -1,
  loaded: false,
  currentTime: 0,
  videoURL: '',
  playerState: -1,
  percentLoaded: 0,
  captions: false,
};

interface PlayerConfig {
  enablejsapi: number;
  controls: number;
  rel: number;
  playsinline: number;
  modestbranding: number;
  cc_lang_pref: string;
  cc_load_policy: number;
}

const defaultPlayerVars: PlayerConfig = {
  enablejsapi: 1,
  controls: 0,
  rel: 0,
  playsinline: 1,
  modestbranding: 1,
  cc_lang_pref: 'en',
  cc_load_policy: 1,
};

interface PlayerProps extends WebViewProps {
  id: string;
  playerVars?: PlayerConfig;
  onError?: (error: any) => void;
  playerState?: PlayerState;
  onPlayerChange?: (nextState: PlayerState) => void;
}

function Player({
  id,
  playerVars = defaultPlayerVars,
  onError = console.log,
  playerState: parentPlayerState,
  onPlayerChange: parentOnPlayerChange,
  style,
  ...rest
}: PlayerProps) {
  const [_playerState, _setPlayerState] = React.useState<PlayerState>(
    initialPlayerState
  );

  const isControlled = parentPlayerState !== undefined;

  // @ts-ignore
  const playerState: PlayerState = isControlled
    ? parentPlayerState
    : _playerState;

  const setPlayerState: any = isControlled
    ? parentOnPlayerChange
    : _setPlayerState;

  function handleMessage({ nativeEvent }: WebViewMessageEvent) {
    const playerData = JSON.parse(nativeEvent.data);

    if (playerData.type === 'onStateChange') {
      const nextState: PlayerState = playerData.data;
      setPlayerState(nextState);
    }

    if (
      playerData.type === 'onWindowError' ||
      playerData.type === 'onPlayerError'
    ) {
      onError(playerData.data);
    }
  }

  React.useEffect(() => {
    if (playerState.playerState === 1) {
      sendMessage({ method: 'playVideo' });
    }

    if (playerState.playerState === 2) {
      sendMessage({ method: 'pauseVideo' });
    }
  }, [playerState.playerState]);

  const previousCurrentTime = usePrevious(playerState.currentTime);

  React.useEffect(() => {
    if (Math.abs(previousCurrentTime - playerState.currentTime) > 0.5) {
      sendMessage({ method: 'seekTo', args: playerState.currentTime });
    }
  }, [playerState.currentTime]);

  React.useEffect(() => {
    if (playerState.captions) {
      sendMessage({ method: 'loadModule', args: 'captions' });
    } else {
      sendMessage({ method: 'unloadModule', args: 'captions' });
    }
  }, [playerState.captions]);

  function sendMessage(message: any) {
    webview.current.postMessage(JSON.stringify(message));
  }

  const html = loadPlayer(id, JSON.stringify(playerVars));
  const webview = React.useRef<any>();

  return (
    <WebView
      ref={webview}
      style={style || { flex: 1 }}
      source={{ html: html }}
      onMessage={handleMessage}
      onError={onError}
      {...rest}
    />
  );
}

export { Player };

function usePrevious(value: any) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = React.useRef<any>();

  // Store current value in ref
  React.useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}
