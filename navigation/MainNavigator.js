import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, BackHandler, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// Importaciones de pantallas
import HomeScreen from "../screens/HomeScreen";
import RegisterCar from "../screens/RegisterCar";
import ReportGraphic from "../screens/ReportGraphic";



// Creación de Tab Navigator
const Tab = createBottomTabNavigator();
function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ 
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={30} color="black" />
          ),
          headerShown: false,
         }}
      />
      <Tab.Screen
        name="RegisterCar"
        component={RegisterCar}
        options={{ 
          tabBarLabel: "Registro",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="add-circle" size={30} color="black" />
          ),
          headerShown: false,
         }}
      />
      <Tab.Screen
        name="ReportGraphic"
        component={ReportGraphic}
        options={{ 
          tabBarLabel: "Reporte",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="pie-chart" size={30} color="black" />
          ),
          headerShown: false,
        }}
      />

    </Tab.Navigator>
  );
}

// Componente principal que envuelve toda la navegación en un contenedor
export default function Navegacion() {
  const [isSessionActive, setIsSessionActive] = useState(null);


  return (
    <NavigationContainer>
      <MainTabNavigator />
    </NavigationContainer>
  );
}
