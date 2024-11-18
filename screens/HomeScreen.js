import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default HomeScreen = () => {
    const navigation = useNavigation();
    return (
        <View>
            <Text>HomeScreen</Text>
        </View>
    );
};
