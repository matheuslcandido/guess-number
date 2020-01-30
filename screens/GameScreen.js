import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, ScrollView, FlatList, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { ScreenOrientation } from 'expo';

import DefaultStyles from '../constants/default-styles';
import NumberContainer from '../components/NumberContainer';
import Card from '../components/Card';
import MainButton from '../components/MainButton';
import BodyText from '../components/BodyText';

const generateRandomBetween = (min, max, exclude) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const rndNum = Math.floor(Math.random() * (max - min)) + min;

  if (rndNum === exclude) {
    return generateRandomBetween(min, max, exclude);
  } else {
    return rndNum;
  }
};

const renderListItem = (listLenght, itemData) => {
  return (
    <View style={styles.listItem}>
      <BodyText>#{listLenght - itemData.index}</BodyText>
      <BodyText>{itemData.item}</BodyText>
    </View>
  );
};

const GameScreen = props => {
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

  initialGuess = generateRandomBetween(1, 100, props.userChoise);

  const [currentGess, SetCurrentGuess] = useState(initialGuess);
  const [pastGuesses, SetPastGuesses] = useState([initialGuess.toString()]);
  const [ avaibleDeviceWidth, SetAvaibleDeviceWidth ] = useState(Dimensions.get('window').width);
  const [ avaibleDeviceHeight, SetAvaibleDeviceHeight ] = useState(Dimensions.get('window').height);

  const currentLow = useRef(1);
  const currentHigh = useRef(100); 

  const { userChoise, onGameOver } = props;

  useEffect(() => {
    const updateLayout = () => {
      SetAvaibleDeviceWidth(Dimensions.get('window').width);
      SetAvaibleDeviceHeight(Dimensions.get('window').height);  
    }

    Dimensions.addEventListener('change', updateLayout);

    return () => {
      Dimensions.removeEventListener('change', updateLayout);
    }
  });

  useEffect(() => {
    if (currentGess === userChoise) {
      onGameOver(pastGuesses.length);
    }
  }, [ currentGess, userChoise, onGameOver ]);

  const nextGuessHandler = direction => {
    if ((direction === 'lower' && currentGess < props.userChoise) || (direction === 'greater' && currentGess > props.userChoise)) {
      Alert.alert(
        'Don\'t lie!', 
        'You know that this is wrong...', 
        [{ text: 'Sorry!', style: 'cancel' }]
      );
      return;
    }
    if (direction === 'lower') {
      currentHigh.current = currentGess;
    } else {
      currentLow.current = currentGess + 1;
    }
    const nextNumber = generateRandomBetween(currentLow.current, currentHigh.current, currentGess);
    SetCurrentGuess(nextNumber);
    SetPastGuesses(curPastGuesses => [nextNumber.toString(),...curPastGuesses]);
  }

  if (avaibleDeviceHeight < 500) {
    return (
      <View style={styles.screen}>
        <Text style={DefaultStyles.title}>Opponent's Guess</Text>
        <View style={styles.controls}>
          <MainButton onPress={nextGuessHandler.bind(this, 'lower')}>
            <Ionicons name="md-remove" size={24} color="white" />
          </MainButton>
          <NumberContainer>{currentGess}</NumberContainer>
          <MainButton onPress={nextGuessHandler.bind(this, 'greater')}>
          <Ionicons name="md-add" size={24} color="white" />
          </MainButton>
        </View>
        <View style={styles.listContainer}>
          <FlatList 
            keyExtractor={(item) => item} 
            data={pastGuesses} 
            renderItem={renderListItem.bind(this, pastGuesses.length)} 
            contentContainerStyle={styles.list}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={DefaultStyles.title}>Opponent's Guess</Text>
      <NumberContainer>{currentGess}</NumberContainer>
      <Card style={styles.buttonContainer}>
          <MainButton onPress={nextGuessHandler.bind(this, 'lower')}>
            <Ionicons name="md-remove" size={24} color="white" />
          </MainButton>
          <MainButton onPress={nextGuessHandler.bind(this, 'greater')}>
          <Ionicons name="md-add" size={24} color="white" />
          </MainButton>
      </Card>
      <View style={styles.listContainer}>
        <FlatList 
          keyExtractor={(item) => item} 
          data={pastGuesses} 
          renderItem={renderListItem.bind(this, pastGuesses.length)} 
          contentContainerStyle={styles.list}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Dimensions.get('window').height > 600 ? 30 : 10,
    width: 400,
    maxWidth: '90%',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '80%'
  },
  listContainer: {
    width: Dimensions.get('window').width > 350 ? '60%' : '90%',
    flex: 1,
  },
  list: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  listItem: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 15,
    marginVertical: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default GameScreen;