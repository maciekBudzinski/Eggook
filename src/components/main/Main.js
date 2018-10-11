import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import { BOIL_TYPES } from '../../config/constans';
import { styles } from './style';

const Main = ({ timeLeft, boilType, isOn, eggBoiled, handleStartStopPress, handleSelectBoilType }) => {
  const rawMinutes = Math.floor(timeLeft / 60);
  const minutes = rawMinutes < 10 ? `0${rawMinutes}` : `${rawMinutes}`;

  const rawSeconds = timeLeft - rawMinutes * 60;
  const seconds = rawSeconds < 10 ? `0${rawSeconds}` : `${rawSeconds}`;
  console.log(timeLeft);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.title}>EGG C</Text>
        <Ionicons style={[styles.title, styles.icon]} name="ios-egg-outline" />
        <Ionicons style={styles.title} name="ios-egg-outline" />
        <Text style={styles.title}>K</Text>
      </View>
      <Text style={styles.text}>Wybierz sposób ugotowania jajka:</Text>
      <View style={{ flexDirection: 'row' }}>
        {BOIL_TYPES.map(t => (
          <TouchableOpacity
            key={t.name}
            disabled={isOn}
            style={[styles.typeButton, boilType.name === t.name && styles.typeButtonSelected, isOn && styles.disabled]}
            onPress={() => handleSelectBoilType(t)}
          >
            <Text style={styles.text}>{t.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={handleStartStopPress} style={styles.button}>
        <Text style={styles.text}>{isOn ? 'Stop' : 'Start'}</Text>
      </TouchableOpacity>
      {!eggBoiled && <Text style={styles.text}>Pozostały czas:</Text>}
      {!eggBoiled && <Text style={styles.timer}>{`${minutes}:${seconds}`}</Text>}
      {eggBoiled && <Text style={[styles.text]}> Twoje jajko jest gotowe! </Text>}
    </View>
  );
};

Main.propTypes = {
  boilType: PropTypes.object.isRequired,
  eggBoiled: PropTypes.bool.isRequired,
  timeLeft: PropTypes.number.isRequired,
  isOn: PropTypes.bool.isRequired,
  handleStartStopPress: PropTypes.func.isRequired,
  handleSelectBoilType: PropTypes.func.isRequired,
};

export default Main;
