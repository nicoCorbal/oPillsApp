import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CalendarProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

const COLORS = {
  primary: '#008CFF',
  secondary: '#FF4A6C',
  background: '#008CFF',
  text: '#222',
  textLight: '#FFFFFF',
  border: '#000000',
};

const BORDER_RADIUS = {
  small: 10,
  medium: 15,
  large: 25,
};

const { width } = Dimensions.get('window');
const WEEK_DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export const Calendar: React.FC<CalendarProps> = ({ onDateSelect, selectedDate }) => {
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  
  useEffect(() => {
    generateWeekDays(selectedDate);
  }, [selectedDate]);

  const generateWeekDays = (date: Date) => {
    const newDate = new Date(date);
    // Ajustamos al lunes de la semana
    const currentDay = newDate.getDay() || 7; // Convertimos domingo (0) a 7
    const diff = newDate.getDate() - currentDay + 1; // Obtenemos el lunes
    newDate.setDate(diff);
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(newDate);
      day.setDate(newDate.getDate() + i);
      week.push(day);
    }

    setCurrentWeek(week);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 7 : -7));
    onDateSelect(newDate);
  };

  const handleDayPress = (date: Date) => {
    onDateSelect(new Date(date));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const formatMonth = (date: Date) => {
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    const monthNum = String(date.getMonth() + 1).padStart(2, '0');
    return `${monthNum} ${month}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.monthContainer}>
          <Text style={styles.monthNumber}>{formatMonth(selectedDate)}</Text>
        </View>

        <View style={styles.daysContainer}>
          <TouchableOpacity 
            style={styles.navigationButton} 
            onPress={() => navigateWeek('prev')}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>

          {currentWeek.map((date, index) => (
            <TouchableOpacity
              key={date.toISOString()}
              style={[
                styles.dayColumn,
                isSelected(date) && styles.selectedDayColumn,
                isToday(date) && styles.todayColumn
              ]}
              onPress={() => handleDayPress(date)}
            >
              <Text style={[
                styles.dayNumber,
                isSelected(date) && styles.selectedDayNumber,
                isToday(date) && styles.todayDayNumber
              ]}>
                {date.getDate()}
              </Text>
              <Text style={[
                styles.dayLetter,
                isSelected(date) && styles.selectedDayLetter,
                isToday(date) && styles.todayDayLetter
              ]}>
                {WEEK_DAYS[index]}
              </Text>
              {isSelected(date) && <View style={styles.selectedLine} />}
            </TouchableOpacity>
          ))}

          <TouchableOpacity 
            style={styles.navigationButton} 
            onPress={() => navigateWeek('next')}
          >
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingTop: 15,
    paddingBottom: 15,
    height: 120,
    borderRadius: BORDER_RADIUS.large,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  monthContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  monthNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  daysContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 5,
  },
  navigationButton: {
    padding: 5,
    color: COLORS.textLight,
  },
  dayColumn: {
    alignItems: 'center',
    width: 40,
    paddingVertical: 5,
  },
  selectedDayColumn: {
    borderRadius: BORDER_RADIUS.small,
  },
  todayColumn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.textLight,
  },
  selectedDayNumber: {
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  todayDayNumber: {
    color: COLORS.textLight,
    fontWeight: 'bold',
  },
  dayLetter: {
    fontSize: 16,
    marginTop: 4,
    color: COLORS.textLight,
  },
  selectedDayLetter: {
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  todayDayLetter: {
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  selectedLine: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 2,
    backgroundColor: COLORS.textLight,
  }
});