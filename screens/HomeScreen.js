import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Modal, TouchableOpacity, Button, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../connection/firebaseConfig';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default HomeScreen = () => {
    const [vehicles, setVehicles] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [editableVehicle, setEditableVehicle] = useState({ brand: '', model: '', year: '', pricePerDay: '', vehiclePhoto: '' });
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "Vehicles"), (querySnapshot) => {
            const vehiclesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setVehicles(vehiclesData);
        });

        return () => unsubscribe();
    }, []);

    const handlePress = (vehicle) => {
        setSelectedVehicle(vehicle);
        setEditableVehicle({ ...vehicle });
        setModalVisible(true);
    };

    const handleEdit = () => {
        setModalVisible(false);
        setEditModalVisible(true);
    };

    const handleAccept = async () => {
        if (selectedVehicle && selectedVehicle.id) {
            const vehicleRef = doc(db, "Vehicles", selectedVehicle.id);
            try {
                await updateDoc(vehicleRef, {
                    ...editableVehicle
                });
                console.log('Datos actualizados:', editableVehicle);
                setEditModalVisible(false);
                const updatedVehicles = vehicles.map(v => v.id === selectedVehicle.id ? { ...v, ...editableVehicle } : v);
                setVehicles(updatedVehicles);
            } catch (error) {
                console.error("Error al actualizar el vehículo:", error);
            }
        }
    };

    const handleCancel = () => {
        setEditModalVisible(false);
    };

    const handleDelete = async () => {
        if (selectedVehicle && selectedVehicle.id) {
            const vehicleRef = doc(db, "Vehicles", selectedVehicle.id);
            try {
                await deleteDoc(vehicleRef);
                console.log('Vehículo eliminado');
                setModalVisible(false);
                const filteredVehicles = vehicles.filter(v => v.id !== selectedVehicle.id);
                setVehicles(filteredVehicles);
            } catch (error) {
                console.error("Error al eliminar el vehículo:", error);
                Alert.alert("Error", "No se pudo eliminar el vehículo.");
            }
        }
    };

    return (
        <ScrollView style={styles.container}>
            {vehicles.map((vehicle) => (
                <TouchableOpacity key={vehicle.id} style={styles.card} onPress={() => handlePress(vehicle)}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.cardText}>Marca: {vehicle.brand}</Text>
                        <Text style={styles.cardText}>Modelo: {vehicle.model}</Text>
                        <Text style={styles.cardText}>Año: {vehicle.year}</Text>
                        <Text style={styles.cardText}>Precio/Día: ${vehicle.pricePerDay}</Text>
                    </View>
                    <Image source={{ uri: vehicle.vehiclePhoto }} style={styles.image} />
                </TouchableOpacity>
            ))}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView1}>
                    <View style={styles.modalView}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Icon name="close" size={20} color="#000" />
                        </TouchableOpacity>
                        <Text style={styles.modalText}>Editar o Eliminar Vehículo</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.buttonEdit} onPress={handleEdit}>
                                <Text style={styles.buttonEditText}>Editar</Text>
                            </TouchableOpacity>
                            <View style={styles.buttonSpacer} />
                            <TouchableOpacity style={styles.buttonDelete} onPress={handleDelete}>
                                <Text style={styles.buttonDeleteText}>Eliminar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={() => {
                    setEditModalVisible(!editModalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Editar Vehículo</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Marca"
                            value={editableVehicle.brand}
                            onChangeText={(text) => setEditableVehicle({ ...editableVehicle, brand: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Modelo"
                            value={editableVehicle.model}
                            onChangeText={(text) => setEditableVehicle({ ...editableVehicle, model: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Año"
                            value={editableVehicle.year}
                            onChangeText={(text) => setEditableVehicle({ ...editableVehicle, year: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Precio/Día"
                            value={editableVehicle.pricePerDay}
                            onChangeText={(text) => setEditableVehicle({ ...editableVehicle, pricePerDay: text })}
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.buttonAccept} onPress={handleAccept}>
                                <Text style={styles.buttonAcceptText}>Aceptar</Text>
                            </TouchableOpacity>
                            <View style={styles.buttonSpacer} />
                            <TouchableOpacity style={styles.buttonCancel} onPress={handleCancel}>
                                <Text style={styles.buttonCancelText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        marginTop:50,
    },
    buttonClose: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    buttonEdit: {
        backgroundColor: 'blue',
        paddingBottom: 10,
        paddingTop:10,
        paddingLeft:17,
        paddingRight:17,
        borderRadius: 5,
        marginRight: 10,
    },
    buttonEditText: {
        color: 'white',
        fontWeight: 'bold',
    },
    buttonDelete: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
    buttonDeleteText: {
        color: 'white',
        fontWeight: 'bold',
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    infoContainer: {
        flex: 1,
    },
    cardText: {
        fontSize: 16,
        marginBottom: 5,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    centeredView1: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center'
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    buttonSpacer: {
        width: 5,
    },
    closeButton: {
        position: 'absolute',
        right: 5,
        top: 5,
        backgroundColor: 'transparent',
        padding: 8,
        borderRadius: 20,
    },
    closeButtonText: {
        fontSize: 24,
        color: '#000',
    },
    buttonAccept: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    buttonAcceptText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonCancel: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
    },
    buttonCancelText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
