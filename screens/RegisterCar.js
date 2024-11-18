import React, { useState } from 'react';
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../connection/firebaseConfig';

const RegisterCar = () => {
  const [year, setYear] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [vehiclePhoto, setVehiclePhoto] = useState(null);

  const navigation = useNavigation();

  const handleSelectPhoto = async (setImageFunction) => {
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
      setImageFunction(uri);
      const imageUrl = await uploadImageToStorage(uri);
      return imageUrl;
    }
  };

  const uploadImageToStorage = async (uri) => {
    const storage = getStorage();
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const storageRef = ref(storage, `images/${filename}`);

    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
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
        vehicleId,
        regDate: new Date().toISOString(),
      });

      setYear('');
      setBrand('');
      setModel('');
      setPricePerDay('');
      setVehiclePhoto(null);

      Alert.alert('Éxito', 'Vehículo registrado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar el vehículo: ' + error.message);
      console.error('Error al registrar el vehículo:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Registrar Vehículo</Text>
        <TextInput
          onChangeText={setYear}
          value={year}
          placeholder="Año del Vehículo"
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
          placeholder="Precio por Día"
          style={styles.input}
        />
        <TouchableOpacity onPress={() => handleSelectPhoto(setVehiclePhoto)} style={styles.button}>
          <Text style={styles.buttonText}>Seleccionar Foto</Text>
        </TouchableOpacity>
        {vehiclePhoto && (
          <Image source={{ uri: vehiclePhoto }} style={styles.vehicleImage} />
        )}
        <TouchableOpacity onPress={handleRegisterCar} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Registrar Vehículo</Text>
        </TouchableOpacity>
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
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: '#000',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#15297C',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  vehicleImage: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '90%',
  },
});

export default RegisterCar;
