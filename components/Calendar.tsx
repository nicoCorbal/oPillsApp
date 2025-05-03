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
    backgroundColor: 'black',
    paddingTop: 15,
    paddingBottom: 15,
    height: 120,
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
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
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
  },
  dayColumn: {
    alignItems: 'center',
    width: 40,
    paddingVertical: 5,
  },
  selectedDayColumn: {
    borderRadius: 4,
  },
  todayColumn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
  },
  dayNumber: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
  },
  selectedDayNumber: {
    fontWeight: 'bold',
  },
  todayDayNumber: {
    color: 'white',
    fontWeight: 'bold',
  },
  dayLetter: {
    color: 'white',
    fontSize: 16,
    marginTop: 4,
  },
  selectedDayLetter: {
    fontWeight: 'bold',
  },
  todayDayLetter: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedLine: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 2,
    backgroundColor: 'white',
  }
});