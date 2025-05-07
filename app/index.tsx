import React, { useState, useRef } from 'react';
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
  Image,
  Animated,
  PanResponder,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from '../components/Calendar';
import { Medication } from '../components/MedicationList';
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
        ]
      },
      {
        id: '3',
        name: 'Omeprazol',
        dose: '20mg',
        time: '09:00',
        image: require('../assets/images/omeprazol.jpeg'),
        description: 'Inhibidor de la bomba de protones utilizado para reducir la producción de ácido en el estómago.',
        instructions: [
          'Tomar en ayunas',
          'Preferiblemente por la mañana',
          'No masticar la cápsula'
        ]
      }
    ],
    '15:30': [
      {
        id: '2',
        name: 'Paracetamol',
        dose: '1g',
        time: '15:30',
        image: require('../assets/images/paracetamol.png'),
        description: 'Analgésico y antipirético utilizado para aliviar el dolor y reducir la fiebre.',
        instructions: [
          'Tomar con agua',
          'No tomar con alcohol',
          'Máximo 4 gramos al día'
        ]
      },
      {
        id: '4',
        name: 'Amoxicilina',
        dose: '500mg',
        time: '15:30',
        description: 'Antibiótico de la familia de las penicilinas.',
        instructions: [
          'Tomar cada 8 horas',
          'Completar el tratamiento',
          'Tomar con o sin alimentos'
        ]
      }
    ]
  }
};

// Función que se usará para crear medicamentos (preparada para el backend)
const createMedication = async (medicationData: {
  name: string;
  dose: string;
  time: string;
  image?: string;
  description?: string;
  instructions?: string[];
}) => {
  try {
    // Aquí irá la llamada al backend
    // const response = await fetch('tu-api/medications', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(medicationData),
    // });
    // const data = await response.json();
    
    // Por ahora, simulamos la respuesta del backend
    // const newMedication: Medication = {
    //   id: Date.now().toString(),
    //   ...medicationData,
    //   image: medicationData.image ? require(`../assets/images/${medicationData.image}`) : undefined
    // };

    // return newMedication;
  } catch (error) {
    console.error('Error al crear el medicamento:', error);
    throw error;
  }
};

export default function MainScreen() {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [medications, setMedications] = useState<MedicationsByDate>(INITIAL_MEDICATIONS);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [inputText, setInputText] = useState('');
  const [newMedication, setNewMedication] = useState({
    name: '',
    dose: '',
    time: '15:30',
  });
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<{[key: string]: any}>({});
  const [selectedMedicationIds, setSelectedMedicationIds] = useState<{[key: string]: string | null}>({});

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

  const handleAddMedication = async () => {
    if (newMedication.name && newMedication.dose) {
      try {
        const newMed = await createMedication({
          ...newMedication,
          instructions: ['Tomar según indicaciones del médico'],
          image: selectedImages[newMedication.time] || undefined
        });

        const dateKey = getDateKey(selectedDate);
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
        setSelectedImages(prev => ({
          ...prev,
          [newMedication.time]: null
        }));
      } catch (error) {
        console.error('Error al añadir el medicamento:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    }
  };

  const handleMedicationPress = (medication: Medication) => {
    // Mostrar vista detallada del medicamento
    setSelectedMedication(medication);
  };

  const handleMicPress = () => {
    // Implementar reconocimiento de voz
    console.log('Mic pressed');
  };

  const handleAddOptionPress = (option: string) => {
    setShowAddOptions(false);
    if (option === 'medication') {
      setShowAddModal(true);
    } else if (option === 'camera') {
      console.log('Abrir cámara');
      // Aquí iría la lógica para abrir la cámara
    } else if (option === 'gallery') {
      console.log('Abrir galería');
      // Aquí iría la lógica para abrir la galería
    }
  };
  
  // Función para eliminar un medicamento
  const handleDeleteMedication = (medicationId: string, time: string) => {
    Alert.alert(
      "Eliminar medicamento",
      "¿Estás seguro de que quieres eliminar este medicamento?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Eliminar", 
          onPress: () => {
            const dateKey = getDateKey(selectedDate);
            setMedications(prev => {
              const updatedMedications = {...prev};
              const timeSlot = [...(updatedMedications[dateKey][time] || [])];
              const filteredMedications = timeSlot.filter(med => med.id !== medicationId);
              
              if (filteredMedications.length === 0) {
                // Si no quedan medicamentos en este horario, eliminar el horario
                const updatedTimeSlots = {...updatedMedications[dateKey]};
                delete updatedTimeSlots[time];
                updatedMedications[dateKey] = updatedTimeSlots;
              } else {
                // Actualizar los medicamentos para este horario
                updatedMedications[dateKey][time] = filteredMedications;
              }
              
              return updatedMedications;
            });
          },
          style: "destructive"
        }
      ]
    );
  };
  
  // Componente para un medicamento con gesto de deslizamiento
  const SwipeableMedicationItem = ({ 
    medication, 
    index, 
    time,
    selectedMedicationId,
    onSelectMedication 
  }: { 
    medication: Medication, 
    index: number, 
    time: string,
    selectedMedicationId: string | null,
    onSelectMedication: (id: string) => void 
  }) => {
    const pan = useRef(new Animated.ValueXY()).current;
    const swipeThreshold = -80;
    
    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          Animated.event([null, { dx: pan.x }], { useNativeDriver: false })(_, gestureState);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < swipeThreshold) {
          Animated.timing(pan, {
            toValue: { x: -100, y: 0 },
            duration: 200,
            useNativeDriver: false
          }).start();
          handleDeleteMedication(medication.id, time);
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false
          }).start();
        }
      }
    });
    
    const handlePress = () => {
      onSelectMedication(medication.id);
      // Actualizar la imagen mostrada para este grupo de tiempo
      const imageSource = medication.image || null;
      setSelectedImages(prev => ({
        ...prev,
        [time]: imageSource
      }));
    };
    
    const isSelected = selectedMedicationId === medication.id;
    
    return (
      <Animated.View 
        style={[{ transform: [{ translateX: pan.x }] }]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={[styles.medicationItem, isSelected && styles.medicationItemSelected]}
          onPress={handlePress}
          activeOpacity={0.7}
        >
          <View style={[styles.medicationIcon, isSelected ? styles.medicationIconSelected : {}]}>
            <Ionicons name="medical-outline" size={18} color={isSelected ? "white" : "black"} />
          </View>
          <Text style={[styles.medicationName, isSelected && styles.medicationNameSelected]}>
            {medication.name} <Text style={[styles.medicationDose, isSelected && styles.medicationDoseSelected]}>{medication.dose}</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, { paddingTop: insets.top }]}>
          <View style={styles.calendarContainer}>
            <Calendar 
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
            />
          </View>

          <View style={styles.medicationsContainer}>
            {getMedicationsForSelectedDate().length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No hay medicamentos para este día</Text>
              </View>
            ) : (
              <ScrollView>
                {getMedicationsForSelectedDate().map(({ time, medications }) => (
                  <View key={time} style={styles.timeGroup}>
                    <View style={styles.medicationCard}>
                      <Text style={styles.timeText}>{time}</Text>
                      
                      {medications.map((med, index) => (
                        <SwipeableMedicationItem 
                          key={med.id}
                          medication={med}
                          index={index}
                          time={time}
                          selectedMedicationId={selectedMedicationIds[time]}
                          onSelectMedication={(id) => setSelectedMedicationIds(prev => ({
                            ...prev,
                            [time]: id
                          }))}
                        />
                      ))}
                      
                      <View style={styles.imageContainer}>
                        {selectedImages[time] ? (
                          <Image
                            source={selectedImages[time]}
                            style={styles.medicineImage}
                            resizeMode="contain"
                          />
                        ) : (
                          <View style={styles.noImageContainer}>
                            <Ionicons name="image-outline" size={40} color="#666" />
                            <Text style={styles.noImageText}>No hay imagen disponible</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          {!isKeyboardVisible && (
            <View style={styles.inputContainerCustom}>
              <TouchableOpacity 
                style={styles.addButtonCustom}
                onPress={() => setShowAddOptions(true)}
                accessibilityLabel="Añadir medicamento, foto o elemento de la galería"
                accessibilityHint="Pulsa para añadir un nuevo elemento"
              >
                <Ionicons name="camera" size={24} color="white" />
              </TouchableOpacity>
              <TextInput
                style={styles.inputCustom}
                placeholder="Type here...."
                placeholderTextColor="#999"
                value={inputText}
                onChangeText={setInputText}
                accessibilityLabel="Campo de texto para instrucciones"
                editable={true}
                autoCapitalize="none"
                onSubmitEditing={() => {
                  if (inputText.trim()) {
                    console.log('Mensaje enviado:', inputText);
                    setInputText('');
                  }
                }}
              />
              <TouchableOpacity 
                style={styles.micButtonCustom}
                onPress={handleMicPress}
                accessibilityLabel="Activar micrófono"
                accessibilityHint="Pulsa para dar instrucciones por voz"
              >
                <Ionicons name="mic" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}

          {/* Opciones del botón + */}
          {showAddOptions && (
            <View style={styles.addOptionsContainer}>
              <TouchableOpacity 
                style={styles.addOptionItem}
                onPress={() => handleAddOptionPress('medication')}
              >
                <View style={styles.addOptionIcon}>
                  <Ionicons name="medical" size={22} color="white" />
                </View>
                <Text style={styles.addOptionText}>Medicamento</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.addOptionItem}
                onPress={() => handleAddOptionPress('camera')}
              >
                <View style={styles.addOptionIcon}>
                  <Ionicons name="camera" size={22} color="white" />
                </View>
                <Text style={styles.addOptionText}>Cámara</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.addOptionItem}
                onPress={() => handleAddOptionPress('gallery')}
              >
                <View style={styles.addOptionIcon}>
                  <Ionicons name="images" size={22} color="white" />
                </View>
                <Text style={styles.addOptionText}>Galería</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.addOptionItem, styles.cancelOption]}
                onPress={() => setShowAddOptions(false)}
              >
                <Text style={styles.cancelOptionText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}

          <Modal
            visible={showAddModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowAddModal(false)}
            accessibilityViewIsModal={true}
            accessibilityLabel="Añadir nuevo elemento"
          >
            <KeyboardAvoidingView 
              style={styles.modalContainer}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Añadir Elemento</Text>
                    <View style={styles.modalTabsContainer}>
                      <TouchableOpacity style={[styles.modalTab, styles.modalTabActive]}>
                        <Ionicons name="medical" size={22} color="black" />
                        <Text style={styles.modalTabText}>Medicamento</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.modalTab}>
                        <Ionicons name="image" size={22} color="#666" />
                        <Text style={[styles.modalTabText, {color: '#666'}]}>Foto</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.modalTab}>
                        <Ionicons name="folder" size={22} color="#666" />
                        <Text style={[styles.modalTabText, {color: '#666'}]}>Galería</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity 
                      onPress={() => setShowAddModal(false)}
                      style={styles.closeButton}
                      accessibilityLabel="Cerrar"
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
  calendarContainer: {
    height: 120,
    backgroundColor: 'black',
    marginBottom: 10,
  },
  medicationsContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100, // Espacio para la barra inferior
    marginTop: 0, // Ya no necesitamos el margen negativo
  },
  timeGroup: {
    marginBottom: 20,
  },
  medicationCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  medicationItemSelected: {
    backgroundColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  timeText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 15,
    color: 'black',
  },
  medicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  medicationIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  medicationIconSelected: {
    backgroundColor: 'white',
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
  medicationNameSelected: {
    color: 'white',
    fontWeight: '600',
  },
  medicationDose: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'normal',
  },
  medicationDoseSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  medicineImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  noImageContainer: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 16,
    color: '#666',
  },
  dotContainer: {
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
    backgroundColor: '#333',
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
  inputContainerCustom: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 15,
    borderRadius: 25,
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addOptionsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  addOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  addOptionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  addOptionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  cancelOption: {
    justifyContent: 'center',
    borderBottomWidth: 0,
    paddingVertical: 15,
  },
  cancelOptionText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    width: '100%',
  },
  addButtonCustom: {
    backgroundColor: '#64B5F6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  inputCustom: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    height: 40,
    paddingHorizontal: 10,
  },
  micButtonCustom: {
    marginLeft: 10,
    padding: 5,
  },
  detailOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
    padding: 20,
  },
  detailCard: {
    backgroundColor: 'black',
    borderRadius: 15,
    padding: 20,
    paddingBottom: 50,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  detailDescription: {
    fontSize: 16,
    color: 'white',
    lineHeight: 22,
    marginBottom: 20,
  },
  soundButtonCustom: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: 'transparent',
    padding: 8,
    borderRadius: 20,
  },
  closeDetailButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 5,
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
    marginBottom: 20,
  },
  modalTabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  modalTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  modalTabActive: {
    backgroundColor: '#f0f0f0',
  },
  modalTabText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  closeButton: {
    padding: 5,
    position: 'absolute',
    top: 0,
    right: 0,
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
    backgroundColor: '#333',
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