import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// A single logged set: how many reps and how much weight
type Set = {
  reps: string;
  weight: string;
};

// One exercise block with a name and a list of sets
type Exercise = {
  id: number;
  name: string;
  sets: Set[];
};

let nextId = 1;

function makeExercise(): Exercise {
  return { id: nextId++, name: '', sets: [{ reps: '', weight: '' }] };
}

export default function WorkoutScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([makeExercise()]);

  // Update the name of an exercise
  function updateExerciseName(id: number, name: string) {
    setExercises(prev =>
      prev.map(ex => (ex.id === id ? { ...ex, name } : ex))
    );
  }

  // Update a specific set's reps or weight
  function updateSet(exerciseId: number, setIndex: number, field: 'reps' | 'weight', value: string) {
    setExercises(prev =>
      prev.map(ex => {
        if (ex.id !== exerciseId) return ex;
        const updatedSets = ex.sets.map((s, i) =>
          i === setIndex ? { ...s, [field]: value } : s
        );
        return { ...ex, sets: updatedSets };
      })
    );
  }

  // Add a new empty set to an exercise
  function addSet(exerciseId: number) {
    setExercises(prev =>
      prev.map(ex =>
        ex.id === exerciseId
          ? { ...ex, sets: [...ex.sets, { reps: '', weight: '' }] }
          : ex
      )
    );
  }

  // Add a new exercise block
  function addExercise() {
    setExercises(prev => [...prev, makeExercise()]);
  }

  const inputStyle = [
    styles.input,
    isDark && styles.inputDark,
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Workout Name */}
        <ThemedText style={styles.screenTitle}>Log Workout</ThemedText>
        <TextInput
          style={inputStyle}
          placeholder="Workout name (e.g. Push Day)"
          placeholderTextColor={isDark ? '#666' : '#aaa'}
          value={workoutName}
          onChangeText={setWorkoutName}
        />

        {/* Exercise List */}
        {exercises.map((exercise, exIndex) => (
          <View key={exercise.id} style={styles.exerciseCard}>
            <TextInput
              style={inputStyle}
              placeholder={`Exercise ${exIndex + 1} (e.g. Bench Press)`}
              placeholderTextColor={isDark ? '#666' : '#aaa'}
              value={exercise.name}
              onChangeText={name => updateExerciseName(exercise.id, name)}
            />

            {/* Column Headers */}
            <View style={styles.setHeader}>
              <ThemedText style={[styles.setHeaderCell, styles.setNumCol]}>Set</ThemedText>
              <ThemedText style={[styles.setHeaderCell, styles.setInputCol]}>Reps</ThemedText>
              <ThemedText style={[styles.setHeaderCell, styles.setInputCol]}>Weight (lbs)</ThemedText>
            </View>

            {/* Set Rows */}
            {exercise.sets.map((set, setIndex) => (
              <View key={setIndex} style={styles.setRow}>
                <ThemedText style={[styles.setNum, styles.setNumCol]}>
                  {setIndex + 1}
                </ThemedText>
                <TextInput
                  style={[inputStyle, styles.setInputCol, styles.setInput]}
                  placeholder="0"
                  placeholderTextColor={isDark ? '#666' : '#aaa'}
                  keyboardType="number-pad"
                  value={set.reps}
                  onChangeText={v => updateSet(exercise.id, setIndex, 'reps', v)}
                />
                <TextInput
                  style={[inputStyle, styles.setInputCol, styles.setInput]}
                  placeholder="0"
                  placeholderTextColor={isDark ? '#666' : '#aaa'}
                  keyboardType="decimal-pad"
                  value={set.weight}
                  onChangeText={v => updateSet(exercise.id, setIndex, 'weight', v)}
                />
              </View>
            ))}

            <TouchableOpacity onPress={() => addSet(exercise.id)} style={styles.addSetButton}>
              <ThemedText style={styles.addSetText}>+ Add Set</ThemedText>
            </TouchableOpacity>
          </View>
        ))}

        {/* Add Exercise */}
        <TouchableOpacity onPress={addExercise} style={styles.addExerciseButton}>
          <ThemedText style={styles.addExerciseText}>+ Add Exercise</ThemedText>
        </TouchableOpacity>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} activeOpacity={0.8}>
          <ThemedText style={styles.saveButtonText}>Save Workout</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingTop: 64,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'rgba(128,128,128,0.1)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#000',
    marginBottom: 12,
  },
  inputDark: {
    color: '#fff',
  },
  exerciseCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.2)',
    padding: 14,
    marginBottom: 16,
  },
  setHeader: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  setHeaderCell: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.5,
    textTransform: 'uppercase',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  setNumCol: {
    width: 32,
    textAlign: 'center',
  },
  setInputCol: {
    flex: 1,
  },
  setNum: {
    fontSize: 15,
    fontWeight: '600',
    opacity: 0.5,
  },
  setInput: {
    marginBottom: 0,
    textAlign: 'center',
    paddingVertical: 8,
  },
  addSetButton: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  addSetText: {
    color: '#E63946',
    fontWeight: '600',
    fontSize: 14,
  },
  addExerciseButton: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E63946',
    borderStyle: 'dashed',
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  addExerciseText: {
    color: '#E63946',
    fontWeight: '600',
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: '#E63946',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
