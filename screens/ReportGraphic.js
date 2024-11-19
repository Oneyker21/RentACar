// screens/Reports.js
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../connection/firebaseConfig'; // Asegúrate de que la ruta es correcta
import { captureRef } from 'react-native-view-shot';
import { jsPDF } from 'jspdf';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function Reports() {
  const [dataVehicles, setDataVehicles] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

  const chartRef = useRef();

  // Lista de colores estáticos para el gráfico
  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

  const captureChart = async () => {
    try {
      const uri = await captureRef(chartRef, {
        format: "png",
        quality: 1,
      });
      console.log("Imagen capturada en:", uri);
      return uri;
    } catch (error) {
      console.error("Error al capturar el gráfico:", error);
    }
  };

  const generarPDF = async () => {
    const uri = await captureChart();
    if (!uri) return;

    try {
      const doc = new jsPDF();
      doc.text("Reporte de Vehículos por Marca", 10, 10);

      const chartImage = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      doc.addImage(`data:image/png;base64,${chartImage}`, "PNG", 10, 20, 180, 100);

      dataVehicles.labels.forEach((label, index) => {
        const value = dataVehicles.datasets[0].data[index];
        doc.text(`${label}: ${value}`, 10, 130 + index * 10);
      });

      const pdfBase64 = doc.output('datauristring').split(',')[1];
      const fileUri = `${FileSystem.documentDirectory}reporte_vehiculos_por_marca.pdf`;

      await FileSystem.writeAsStringAsync(fileUri, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64
      });

      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Error al generar o compartir el PDF: ", error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "Vehicles"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const countByBrand = {};
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const { brand } = data; // Asegúrate de que 'brand' es el campo correcto
        countByBrand[brand] = (countByBrand[brand] || 0) + 1;
      });

      const labels = Object.keys(countByBrand);
      const data = Object.values(countByBrand);

      setDataVehicles({
        labels,
        datasets: [{ data }],
      });
    }, (error) => {
      console.error("Error al obtener datos de Firestore: ", error);
    });

    return () => unsubscribe(); // Esto desuscribe el listener cuando el componente se desmonta
  }, []);

  return (
    <View style={styles.container}>
      <View ref={chartRef} collapsable={false} style={styles.chartContainer}>
        <PieChart
          data={dataVehicles.labels.map((label, index) => ({
            name: label,
            population: dataVehicles.datasets[0].data[index],
            color: colors[index % colors.length],
            legendFontColor: "#000",
            legendFontSize: 15,
          }))}
          width={300}
          height={220}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
      <Button title="Generar y Compartir PDF" onPress={generarPDF} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  chartContainer: {
    width: 300,
    height: 220,
    backgroundColor: '#fff',
  },
});