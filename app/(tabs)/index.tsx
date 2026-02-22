import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getTodayLabel(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.greeting}>{getGreeting()}</ThemedText>
        <ThemedText style={styles.date}>{getTodayLabel()}</ThemedText>
      </View>

      {/* Start Workout Button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => router.push('/(tabs)/workout')}
        activeOpacity={0.8}>
        <ThemedText style={styles.startButtonText}>Start Workout</ThemedText>
      </TouchableOpacity>

      {/* Quick Stats Placeholder */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <ThemedText style={styles.statValue}>—</ThemedText>
          <ThemedText style={styles.statLabel}>Workouts this week</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={styles.statValue}>—</ThemedText>
          <ThemedText style={styles.statLabel}>Total sets logged</ThemedText>
        </View>
      </View>

      {/* Recent Activity Placeholder */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Recent Workouts</ThemedText>
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyText}>
            No workouts logged yet. Hit the gym!
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 32,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
  },
  date: {
    fontSize: 16,
    opacity: 0.6,
    marginTop: 4,
  },
  startButton: {
    backgroundColor: '#E63946',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 24,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.2)',
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
  },
  section: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  emptyState: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.2)',
    borderStyle: 'dashed',
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    opacity: 0.5,
    textAlign: 'center',
  },
});
