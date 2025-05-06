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
}

export const MedicationList: React.FC<MedicationListProps> = ({
  medications = [],
}) => {
  const { width } = useWindowDimensions();
  const [selectedMedicationIndex, setSelectedMedicationIndex] = useState(0);

  if (!medications || medications.length === 0) {
    return null;
  }

  const handleMedicationPress = (index: number) => {
    setSelectedMedicationIndex(index);
  };

  const getMedicationImage = (medication: Medication) => {
    if (medication.name.toLowerCase() === 'omeprazol') {
      return require('../assets/images/omeprazol.jpeg');
    }
    return medication.image ? { uri: medication.image } : null;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.medicationsContainer}>
        {medications.map((med, index) => (
          <TouchableOpacity
            key={med.id}
            style={[
              styles.medicationCard,
              index === selectedMedicationIndex && styles.selectedMedicationCard
            ]}
            onPress={() => handleMedicationPress(index)}
            activeOpacity={0.7}
          >
            <View style={styles.medicationInfo}>
              <Text style={[
                styles.medicationName,
                index === selectedMedicationIndex && styles.selectedMedicationName
              ]}>
                {med.name}
              </Text>
              <Text style={[
                styles.medicationDose,
                index === selectedMedicationIndex && styles.selectedMedicationDose
              ]}>
                {med.dose}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.imageSection}>
        {getMedicationImage(medications[selectedMedicationIndex]) ? (
          <Image
            source={getMedicationImage(medications[selectedMedicationIndex])}
            style={styles.medicineImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.noImageContainer}>
            <Ionicons name="image-outline" size={40} color="#666" />
            <Text style={styles.noImageText}>No hay imagen disponible</Text>
          </View>
        )}
        <View style={styles.dotIndicators}>
          {medications.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === selectedMedicationIndex && styles.activeDot
              ]}
            />
          ))}
        </View>
      </View>
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
  selectedMedicationCard: {
    backgroundColor: '#333',
    borderWidth: 2,
    borderColor: '#666',
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
  selectedMedicationName: {
    color: 'white',
    fontWeight: '700',
  },
  medicationDose: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  selectedMedicationDose: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  imageSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  medicineImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
  },
  noImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  dotIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
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
  }
}); 