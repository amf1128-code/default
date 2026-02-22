import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// Placeholder stat cards to show what will eventually be displayed
const STAT_PLACEHOLDERS = [
  { label: 'Total Workouts', value: '—' },
  { label: 'Total Sets', value: '—' },
  { label: 'Heaviest Lift', value: '—' },
  { label: 'Workout Streak', value: '—' },
];

export default function ProgressScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText style={styles.screenTitle}>Progress</ThemedText>

        {/* Summary Stats */}
        <View style={styles.statsGrid}>
          {STAT_PLACEHOLDERS.map(stat => (
            <View key={stat.label} style={styles.statCard}>
              <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
              <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
            </View>
          ))}
        </View>

        {/* Chart Placeholder */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Volume Over Time</ThemedText>
          <View style={styles.chartPlaceholder}>
            <ThemedText style={styles.placeholderText}>
              Chart will appear here once workouts are logged
            </ThemedText>
          </View>
        </View>

        {/* History Placeholder */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Workout History</ThemedText>
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>
              No workouts logged yet.{'\n'}Go crush a session!
            </ThemedText>
          </View>
        </View>
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
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    width: '47%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.2)',
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.55,
    textAlign: 'center',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  chartPlaceholder: {
    height: 180,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.2)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    opacity: 0.4,
    textAlign: 'center',
    fontSize: 14,
  },
  emptyState: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.2)',
    borderStyle: 'dashed',
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    opacity: 0.5,
    textAlign: 'center',
    lineHeight: 22,
  },
});
