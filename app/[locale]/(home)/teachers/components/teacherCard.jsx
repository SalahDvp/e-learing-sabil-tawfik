import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

// Define the styles for the PDF document
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    width: '100%',
    padding: 20,
    fontFamily: 'Amiri', // Set the default font family
  },
  section: {
    flex: 1,
    margin: 0,
    padding: 10,
    height: '33%', // Take a third of the page height
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: '50%',
  },
  text: {
    fontSize: 12,
    marginVertical: 2,
  },
  boldText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  qrCode: {
    width: 50,
    height: 50,
  }
});

// Create the TeacherCard component
const TeacherCard = ({ formData, qr }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Image src={formData.photo} style={styles.image} />
        <Text style={styles.boldText}>{formData.name}</Text>
        <Text style={styles.text}>{formData.year}</Text>
        <Text style={styles.text}>Born: {new Date(formData.birthdate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
        <Text style={styles.text}>School: {formData.school}</Text>
      </View>
      <View style={styles.section}>
        <Image src={qr} style={styles.qrCode} />
      </View>
      <View style={styles.section}>
        <Text style={styles.boldText}>Classes</Text>
        {formData.classes.map((classItem, index) => (
          <View key={index} style={{ marginVertical: 2 }}>
            <Text style={styles.text}>{classItem.subject}</Text>
            <Text style={styles.text}>{classItem.name}, {classItem.time}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default TeacherCard;