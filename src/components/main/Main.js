import React, { Component } from 'react';
import { View, Text, Picker, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import Expo, { Notifications } from 'expo';
import { BOIL_TYPES } from '../../config/constans';
import { styles } from './style';
import cockcrow from '../../../assets/cockcrow.mp3';

let timer;
let localNotification = {};
const t = new Date();
t.setSeconds(t.getSeconds() + 10);

class Main extends Component {
  constructor(props) {
    super(props);
    this.audioPlayer = new Expo.Audio.Sound();
  }

  playSound = async () => {
    try {
      await this.audioPlayer.unloadAsync();
      await this.audioPlayer.loadAsync(cockcrow);
      await this.audioPlayer.playAsync();
    } catch (err) {
      console.warn("Couldn't Play audio", err);
    }
  };

  handleStartStopPress = () => {
    const { isOn, startTimer, stopTimer, timerTick } = this.props;

    if (isOn) {
      stopTimer();
      clearInterval(timer);
    } else {
      startTimer(Date.now());
      timer = setInterval(() => timerTick(), 1000);
    }
  };

  handleSelectBoilType = type => {
    const { selectBoilType } = this.props;
    selectBoilType(type);
  };

  render() {
    const { boilType, isOn, timeLeft } = this.props;
    localNotification = {
      title: 'Eggook',
      body: `Twoje jajko ${boilType.communicate} jest gotowe!`, // (string) — body text of the notification.
      ios: {
        // (optional) (object) — notification configuration specific to iOS.
        sound: true, // (optional) (boolean) — if true, play a sound. Default: false.
      },
      // (optional) (object) — notification configuration specific to Android.
      android: {
        sound: true, // (optional) (boolean) — if true, play a sound. Default: false.
        // icon (optional) (string) — URL of icon to display in notification drawer.
        // color (optional) (string) — color of the notification icon in notification drawer.
        priority: 'high', // (optional) (min | low | high | max) — android may present notifications according to the priority, for example a high priority notification will likely to be shown as a heads-up notification.
        sticky: false, // (optional) (boolean) — if true, the notification will be sticky and not dismissable by user. The notification must be programmatically dismissed. Default: false.
        vibrate: true, // (optional) (boolean or array) — if true, vibrate the device. An array can be supplied to specify the vibration pattern, e.g. - [ 0, 500 ].
        // link (optional) (string) — external link to open when notification is selected.
      },
    };

    if (timeLeft === 0) {
      this.playSound();
      Notifications.presentLocalNotificationAsync(localNotification);
    }
    const rawMinutes = Math.floor(timeLeft / 60);
    const minutes = rawMinutes < 10 ? `0${rawMinutes}` : `${rawMinutes}`;

    const rawSeconds = timeLeft - rawMinutes * 60;
    const seconds = rawSeconds < 10 ? `0${rawSeconds}` : `${rawSeconds}`;

    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.title}>Egg C</Text>
          <Ionicons style={[styles.title, styles.icon]} name="ios-egg-outline" />
          <Ionicons style={styles.title} name="ios-egg-outline" />
          <Text style={styles.title}>k</Text>
        </View>
        <Text style={styles.text}>Wybierz sposób ugotowania jajka</Text>
        <Picker enabled={!isOn} style={styles.picker} selectedValue={boilType} onValueChange={boilType => this.handleSelectBoilType(boilType)}>
          {BOIL_TYPES.map(t => (
            <Picker.Item style={styles.text} key={t.name} label={t.name} value={t} />
          ))}
        </Picker>
        <TouchableOpacity onPress={this.handleStartStopPress} style={styles.button}>
          <Text style={styles.text}>{isOn ? 'Stop' : 'Start'}</Text>
        </TouchableOpacity>
        <Text style={styles.text}>Pozostały czas:</Text>
        <Text style={styles.timer}>{`${minutes}:${seconds}`}</Text>
      </View>
    );
  }
}

Main.propTypes = {
  boilType: PropTypes.string.isRequired,
  selectBoilType: PropTypes.func.isRequired,
  timeLeft: PropTypes.number.isRequired,
  isOn: PropTypes.bool.isRequired,
  startTimer: PropTypes.func.isRequired,
  stopTimer: PropTypes.func.isRequired,
  timerTick: PropTypes.func.isRequired,
};

export default Main;
