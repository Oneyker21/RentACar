import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, BackHandler, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

// Importaciones de pantallas
import HomeScreen from "../screens/HomeScreen";
import RegisterCar from "../screens/RegisterCar";
import ReportGraphic from "../screens/ReportGraphic";
import DetailCar from "../screens/DetailCar";

// Creación de Stack Navigator para HomeScreen y DetailCar
const HomeStack = createStackNavigator();
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}

      />
      <HomeStack.Screen
        name="DetailCar"
        component={DetailCar}
        options={{ headerShown: true }}
      />
    </HomeStack.Navigator>
  );
}

// Creación de Tab Navigator
const Tab = createBottomTabNavigator();
function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="RegisterCar"
        component={RegisterCar}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="ReportGraphic"
        component={ReportGraphic}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

// Componente principal que envuelve toda la navegación en un contenedor
export default function Navegacion() {
  const [isSessionActive, setIsSessionActive] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const session = await AsyncStorage.getItem("userSession");
      setIsSessionActive(session === "active");
    };

    checkSession();

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      async () => {
        const sessionActive = await AsyncStorage.getItem("userSession");
        if (sessionActive === "active") {
          Alert.alert(
            "¡Espera!",
            "¿Estás seguro de que quieres salir de la aplicación?",
            [
              {
                text: "Cancelar",
                onPress: () => null,
                style: "cancel",
              },
              { text: "Salir", onPress: () => BackHandler.exitApp() },
            ]
          );
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, []);

  if (isSessionActive === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <MainTabNavigator />
    </NavigationContainer>
  );
}
