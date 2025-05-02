import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CustomNavBarProps {
  onHomePress?: () => void;
  onStorePress?: () => void;
  onMicPress?: () => void;
  onPlusPress?: () => void;
  onSettingsPress?: () => void;
}

export const CustomNavBar: React.FC<CustomNavBarProps> = ({
  onHomePress,
  onStorePress,
  onMicPress,
  onPlusPress,
  onSettingsPress,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.iconButton} onPress={onHomePress}>
          <View style={styles.iconBackground}>
            <Ionicons name="logo-android" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.iconButton} onPress={onStorePress}>
          <View style={styles.iconBackground}>
            <Ionicons name="calendar" size={24} color="#fff" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.micButton} onPress={onMicPress}>
          <View style={styles.micCircle}>
            <View style={styles.micInnerCircle}>
              <Ionicons name="mic" size={28} color="#fff" />
            </View>
          </View>
          <View style={styles.micGlow} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={onPlusPress}>
          <View style={styles.iconBackground}>
            <Ionicons name="add" size={24} color="#fff" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={onSettingsPress}>
          <View style={styles.iconBackground}>
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  iconButton: {
    padding: 8,
  },
  iconBackground: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: '#64B5F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#64B5F6',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  micButton: {
    marginTop: -40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#64B5F6',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  micInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#64B5F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#64B5F6',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  micGlow: {
    position: 'absolute',
    top: -10,
    width: 100,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#64B5F6',
    opacity: 0.15,
    transform: [{ scaleX: 1.2 }],
  },
}); 