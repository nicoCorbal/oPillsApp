import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Modal,
  Text,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from '../components/Calendar';
import { MedicationList, Medication } from '../components/MedicationList';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MedicationsByDate {
  [date: string]: {
    [time: string]: Medication[];
  };
}

// Función auxiliar para obtener la fecha en formato YYYY-MM-DD
const getTodayKey = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const INITIAL_MEDICATIONS: MedicationsByDate = {
  [getTodayKey()]: {
    '09:00': [
      {
        id: '1',
        name: 'Ibuprofeno',
        dose: '600mg',
        time: '09:00',
        description: 'Antiinflamatorio no esteroideo (AINE) utilizado para aliviar el dolor, reducir la inflamación y bajar la fiebre.',
        instructions: [
          'Tomar con alimentos',
          'No exceder la dosis recomendada',
          'Consultar con el médico si los síntomas persisten'
        ],
        image: 'path_to_image'
      }
    ],
    '15:30': [
      {
        id: '2',
        name: 'Paracetamol',
        dose: '1g',
        time: '15:30',
        description: 'Analgésico y antipirético utilizado para aliviar el dolor y reducir la fiebre.',
        instructions: [
          'Tomar con agua',
          'No tomar con alcohol',
          'Máximo 4 gramos al día'
        ],
        image: 'path_to_image'
      }
    ]
  }
};

export default function MainScreen() {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [medications, setMedications] = useState<MedicationsByDate>(INITIAL_MEDICATIONS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dose: '',
    time: '15:30',
  });
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const getDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getMedicationsForSelectedDate = () => {
    const dateKey = getDateKey(selectedDate);
    const medicationsForDate = medications[dateKey] || {};
    
    // Convertir el objeto de horas a un array ordenado
    const sortedTimes = Object.keys(medicationsForDate).sort((a, b) => {
      // Convertir las horas a minutos para comparar
      const [aHours, aMinutes] = a.split(':').map(Number);
      const [bHours, bMinutes] = b.split(':').map(Number);
      const aTotal = aHours * 60 + aMinutes;
      const bTotal = bHours * 60 + bMinutes;
      return aTotal - bTotal;
    });
    
    return sortedTimes.map(time => ({
      time,
      medications: medicationsForDate[time]
    }));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddMedication = () => {
    if (newMedication.name && newMedication.dose) {
      const dateKey = getDateKey(selectedDate);
      const newMed: Medication = {
        id: Date.now().toString(),
        ...newMedication,
        instructions: ['Tomar según indicaciones del médico'],
        image: selectedImage || 'default_image_path'
      };

      setMedications(prev => {
        const currentDateMedications = prev[dateKey] || {};
        const currentTimeMedications = currentDateMedications[newMedication.time] || [];
        
        return {
          ...prev,
          [dateKey]: {
            ...currentDateMedications,
            [newMedication.time]: [...currentTimeMedications, newMed]
          }
        };
      });

      setShowAddModal(false);
      setNewMedication({ name: '', dose: '', time: '15:30' });
      setSelectedImage(null);
    }
  };

  const handleMedicationPress = (medication: Medication) => {
    // Implementar vista detallada del medicamento
  };

  const handleMicPress = () => {
    // Implementar reconocimiento de voz
    console.log('Mic pressed');
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { paddingTop: insets.top }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <View style={styles.calendarContainer}>
            <Calendar 
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
            />
          </View>
          
          <ScrollView style={styles.medicationsContainer}>
            {getMedicationsForSelectedDate().length > 0 ? (
              getMedicationsForSelectedDate().map(({ time, medications: meds }) => (
                <View key={time} style={styles.timeGroup}>
                  <Text style={styles.timeText}>{time}</Text>
                  <MedicationList 
                    medications={meds}
                    onMedicationPress={handleMedicationPress}
                  />
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No hay medicamentos para este día</Text>
              </View>
            )}
          </ScrollView>

          {!isKeyboardVisible && (
            <View style={styles.inputContainer}>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setShowAddModal(true)}
              >
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Type here...."
                placeholderTextColor="#666"
                onFocus={() => setShowAddModal(true)}
              />
              <TouchableOpacity 
                style={styles.micButton}
                onPress={handleMicPress}
              >
                <Ionicons name="mic" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}

          <Modal
            visible={showAddModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowAddModal(false)}
          >
            <KeyboardAvoidingView 
              style={styles.modalContainer}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Añadir Medicamento</Text>
                    <TouchableOpacity 
                      onPress={() => setShowAddModal(false)}
                      style={styles.closeButton}
                    >
                      <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView 
                    style={styles.modalScroll}
                    keyboardShouldPersistTaps="handled"
                  >
                    <TextInput
                      style={styles.modalInput}
                      placeholder="Nombre del medicamento"
                      value={newMedication.name}
                      onChangeText={(text) => setNewMedication({...newMedication, name: text})}
                      autoCapitalize="words"
                      returnKeyType="next"
                    />
                    <TextInput
                      style={styles.modalInput}
                      placeholder="Dosis (ej: 500mg)"
                      value={newMedication.dose}
                      onChangeText={(text) => setNewMedication({...newMedication, dose: text})}
                      returnKeyType="next"
                    />
                    <TextInput
                      style={styles.modalInput}
                      placeholder="Hora (ej: 15:30)"
                      value={newMedication.time}
                      onChangeText={(text) => setNewMedication({...newMedication, time: text})}
                      returnKeyType="done"
                    />

                    <TouchableOpacity 
                      style={styles.addMedicationButton}
                      onPress={handleAddMedication}
                    >
                      <Text style={styles.addMedicationButtonText}>Añadir</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 30,
    marginTop: 10,
  },
  calendarContainer: {
    height: 85,
    backgroundColor: 'black',
  },
  medicationsContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  timeGroup: {
    marginBottom: 20,
  },
  timeText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 15,
    margin: 15,
    borderRadius: 30,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  addButton: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  micButton: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  modalScroll: {
    maxHeight: '100%',
  },
  modalInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  addMedicationButton: {
    backgroundColor: '#64B5F6',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  addMedicationButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 