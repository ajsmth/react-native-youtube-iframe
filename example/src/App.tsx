/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {Player} from 'my-library';

function App() {
  const [playerState, setPlayerState] = React.useState({
    id: '',
    duration: 0,
    playlistIndex: -1,
    loaded: false,
    currentTime: 0,
    videoURL: '',
    playerState: -1,
    percentLoaded: 0,
  });

  function pausePlayer() {
    setPlayerState(state => {
      return {
        ...state,
        playerState: 2,
      };
    });
  }

  function toggleCaptions() {
    setPlayerState(state => {
      return {
        ...state,
        captions: !state.captions,
      };
    });
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Player
            id="10tXmE1IXw0"
            playerState={playerState}
            onPlayerChange={setPlayerState}
          />

          <Button title="Pause" onPress={pausePlayer} />
          <Button title="Captions" onPress={toggleCaptions} />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
