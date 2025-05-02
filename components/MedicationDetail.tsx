import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Medication } from './MedicationList';

interface MedicationDetailProps {
  medication: Medication | null;
  visible: boolean;
  onClose: () => void;
}

export const MedicationDetail: React.FC<MedicationDetailProps> = ({
  medication,
  visible,
  onClose,
}) => {
  if (!medication) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{medication.name}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dosis</Text>
              <Text style={styles.sectionText}>{medication.dose}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Hora</Text>
              <Text style={styles.sectionText}>{medication.time}</Text>
            </View>

            {medication.image && (
              <View style={styles.imageSection}>
                <Image
                  source={{ uri: medication.image }}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <Text style={styles.descriptionText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Instrucciones</Text>
              <Text style={styles.descriptionText}>
                - Tomar con agua
                {'\n'}- No exceder la dosis recomendada
                {'\n'}- Consultar con el médico si los síntomas persisten
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  scrollContent: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: '#666',
  },
  imageSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 15,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
}); 