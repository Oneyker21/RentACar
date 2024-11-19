import React, { useState } from 'react';
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../connection/firebaseConfig';

const RegisterCar = () => {
  const [year, setYear] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [vehiclePhoto, setVehiclePhoto] = useState(null);

  const navigation = useNavigation();

  const handleSelectPhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permissions are required to take photos.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setVehiclePhoto(uri);
    }
  };

  const handleLimpiarCamposS = () => {
    setYear('');
    setBrand('');
    setModel('');
    setPricePerDay('');
    setVehiclePhoto(null);
  };

  const handleRegisterCar = async () => {
    if (!vehiclePhoto) {
      Alert.alert('Error', 'Por favor, seleccione una foto del vehículo.');
      return;
    }

    try {
      const vehicleId = `Vehicle_${new Date().getTime()}`;
      await setDoc(doc(db, 'Vehicles', vehicleId), {
        year,
        brand,
        model,
        pricePerDay,
        vehiclePhoto,
        vehiclZeId,
        regDate: new Date().toISOString(),
      });

      handleLimpiarCamposS();
      Alert.alert('Éxito', 'Vehículo registrado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar el vehículo: ' + error.message);
      console.error('Error al registrar el vehículo:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Registrar Vehículo</Text>
        <TextInput
          onChangeText={setYear}
          value={year}
          placeholder="Año del Vehículo"
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          onChangeText={setBrand}
          value={brand}
          placeholder="Marca del Vehículo"
          style={styles.input}
        />
        <TextInput
          onChangeText={setModel}
          value={model}
          placeholder="Modelo del Vehículo"
          style={styles.input}
        />
        <TextInput
          onChangeText={setPricePerDay}
          value={pricePerDay}
          keyboardType="numeric"
          placeholder="Precio por Día"
          style={styles.input}
        />

        <TouchableOpacity onPress={handleSelectPhoto} style={styles.vehicleImageContainer}>
          {vehiclePhoto ? (
            <Image source={{ uri: vehiclePhoto }} style={styles.vehicleImage} />
          ) : (
            <Text style={styles.imagePlaceholderText}>Tocar para seleccionar imagen</Text>
          )}
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleRegisterCar} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Registrar Vehículo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLimpiarCamposS} style={styles.limpiarButton}>
            <Text style={styles.limpiarButtonText}>Limpiar Campos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  scrollView: {
    marginHorizontal: 20,
  },
  scrollViewContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: '#000',
    padding: 10,
    width: '90%',
    marginBottom: 10,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  vehicleImageContainer: {
    width: 200,
    height: 200,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholderText: {
    color: '#ccc',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  limpiarButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  limpiarButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default RegisterCar;
