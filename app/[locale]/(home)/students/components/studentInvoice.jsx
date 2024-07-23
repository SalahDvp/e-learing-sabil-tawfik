import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import React from 'react';

// Register the font
// // Font.register({
// //   family: 'Amiri',
// //   fonts: [
// //     {
// //       src: '/fonts/Amiri-Regular.ttf',
// //       fontWeight: 400,
// //     },
// //   ] // Path to the font file
// // });

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    width: '100%',
    padding: 20,
    //fontFamily: 'Amiri', // Set the default font family
  },
  section: {
    flex: 1,
    margin: 0,
    padding: 10,
    height: '33%', // Take a third of the page height
  },
  header: {
    fontSize: 20, // Larger font size for logo and school name
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 14,
    fontWeight: 'normal',
    margin: 5,
  },
  details: {
    marginBottom: 10,
    fontSize: 10, // Smaller font size for other text
  },
  detailItem: {
    marginBottom: 2,
  },
  signatureSection: {
    // Changes to provide space for signatures
    position: 'absolute',
    bottom: -30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    left: '5%',
  },
  signature: {
    fontSize: 10, // Smaller font size for signatures
    textAlign: 'center',
    borderTop: '1px solid black',
    width: '45%',
    paddingTop: 3,
  },
  cutLine: {
    position: 'absolute',
    left: '60%',
    height: '45%',
    width: 1,
    borderLeft: '2px dashed black',
    transform: 'translateX(-50%)',
  },
  paymentSection: {
    marginBottom: 10,
  },
  paymentTitle: {
    fontSize: 12,
    marginBottom: 5,
  },
  paymentAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentBox: {
   

    width: '48%',
    textAlign: 'center',
    fontSize: 12,
  },
});

const StudentInvoice = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cut Line */}
        <View style={styles.cutLine}></View>

        {/* Left Side */}
        <View style={styles.section}>
  <Text style={styles.header}>Nom de l'école & Logo</Text>
  <View style={styles.details}>
    <Text style={styles.subHeader}>Informations sur l'élève</Text>
    <Text style={styles.paymentBox}>Nom de l'élève: {data.name}</Text>
    <Text style={styles.paymentBox}>Matiere: {data.subject}</Text>
    <Text style={styles.paymentBox}>Classe: {data.year}</Text>
    <Text style={styles.paymentBox}>Le: {data.date} DZD</Text>
    
  </View>
  </View>



        {/* Right Side (Same as left) */}
        <View style={styles.section}>
  <Text style={styles.header}>Nom de l'école & Logo</Text>
  <View style={styles.details}>
    <Text style={styles.subHeader}>Informations sur l'élève</Text>
    <Text style={styles.paymentBox}>Nom de l'élève: {data.name}</Text>
    <Text style={styles.paymentBox}>Matiere: {data.subject}</Text>
    <Text style={styles.paymentBox}>Classe: {data.year}</Text>
    <Text style={styles.paymentBox}>Le: {data.date}</Text>
    
  </View>
  </View>
      </Page>
    </Document>
  );
};

export default StudentInvoice;