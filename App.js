import React, { useState, useEffect } from 'react';
import { LogBox } from 'react-native';
import MainNavigator from './navigation/MainNavigator';

LogBox.ignoreLogs([
  "Bottom Tab Navigator: 'tabBarOptions' is deprecated",
  "'home-outline' is not a valid icon name for family 'material'"
]);
  
const App = () => {
  return (
      <MainNavigator></MainNavigator>
  );
};

export default App;



