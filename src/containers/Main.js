import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Expo, { Notifications } from 'expo';
import PropTypes from 'prop-types';
import Main from '../components/main/Main';
import { selectBoilType, startTimer, stopTimer, timerTick, notify } from '../modules/timer/actions';
import cockcrow from '../../assets/cockcrow.mp3';
import { localNotification } from '../config/notification';

let timerInterval;

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.audioPlayer = new Expo.Audio.Sound();
  }

  componentDidUpdate() {
    const { timeLeft } = this.props;
    if (timeLeft <= 0) {
      this.handleTimePassedEvent();
    }
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
      clearInterval(timerInterval);
    } else {
      startTimer(Date.now());
      timerInterval = setInterval(() => timerTick(), 1000);
    }
  };

  handleSelectBoilType = type => {
    const { selectBoilType } = this.props;
    selectBoilType(type);
  };

  handleTimePassedEvent = () => {
    const { stopTimer, notify, boilType } = this.props;

    stopTimer();
    notify();

    this.playSound();
    Notifications.presentLocalNotificationAsync(localNotification(boilType));

    clearInterval(timerInterval);
  };

  render() {
    return <Main {...this.props} handleStartStopPress={this.handleStartStopPress} handleSelectBoilType={this.handleSelectBoilType} />;
  }
}

MainScreen.propTypes = {
  boilType: PropTypes.object.isRequired,
  eggBoiled: PropTypes.bool.isRequired,
  selectBoilType: PropTypes.func.isRequired,
  timeLeft: PropTypes.number.isRequired,
  isOn: PropTypes.bool.isRequired,
  startTimer: PropTypes.func.isRequired,
  stopTimer: PropTypes.func.isRequired,
  timerTick: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isOn: state.timer.isOn,
  timeLeft: state.timer.timeLeft,
  boilType: state.timer.boilType,
  eggBoiled: state.timer.eggBoiled,
});

const mapDispatchToProps = dispatch => bindActionCreators({ selectBoilType, startTimer, stopTimer, timerTick, notify }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainScreen);
