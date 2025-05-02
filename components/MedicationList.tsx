import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  useWindowDimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MedicationDetail } from './MedicationDetail';

const { width: screenWidth } = Dimensions.get('window');

export interface Medication {
  id: string;
  name: string;
  dose: string;
  time: string;
  image?: string;
  description?: string;
  instructions?: string[];
}

interface MedicationListProps {
  medications: Medication[] | undefined;
  onMedicationPress: (medication: Medication) => void;
}

export const MedicationList: React.FC<MedicationListProps> = ({
  medications = [],
  onMedicationPress,
}) => {
  const { width } = useWindowDimensions();
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const handleMedicationPress = (medication: Medication) => {
    setSelectedMedication(medication);
    setShowDetail(true);
    onMedicationPress(medication);
  };

  if (!medications || medications.length === 0) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.medicationsContainer}>
        {medications.map((med) => (
          <TouchableOpacity
            key={med.id}
            style={styles.medicationCard}
            onPress={() => handleMedicationPress(med)}
          >
            <View style={styles.medicationInfo}>
              <Text style={styles.medicationName}>{med.name}</Text>
              <Text style={styles.medicationDose}>{med.dose}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.imageSection}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.imageScroll}
        >
          {medications.map((med, index) => (
            <View key={med.id} style={[styles.imageContainer, { width: width - 40 }]}>
              <Image
                source={require('../assets/images/paracetamol.png')}
                style={styles.medicineImage}
                resizeMode="contain"
              />
            </View>
          ))}
        </ScrollView>
        <View style={styles.dotIndicators}>
          {medications.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === 0 && styles.activeDot
              ]}
            />
          ))}
        </View>
      </View>

      {selectedMedication && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Descripción</Text>
          <Text style={styles.descriptionText}>
            {selectedMedication.description || 'No hay descripción disponible.'}
          </Text>
          <TouchableOpacity style={styles.soundButton}>
            <Ionicons name="volume-high" size={24} color="black" />
          </TouchableOpacity>
        </View>
      )}

      <MedicationDetail
        medication={selectedMedication}
        visible={showDetail}
        onClose={() => setShowDetail(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  medicationsContainer: {
    paddingHorizontal: 20,
  },
  medicationCard: {
    backgroundColor: 'black',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  medicationDose: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  imageSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  imageScroll: {
    flexGrow: 0,
  },
  imageContainer: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medicineImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  dotIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'black',
  },
  descriptionContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: 'black',
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  descriptionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descriptionText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  soundButton: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
}); 