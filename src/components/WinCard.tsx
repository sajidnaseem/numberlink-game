import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type WinCardProps = {
  timeLabel: string;
  submitLoading: boolean;
  submitSuccess: boolean;
  submitError: boolean;
  onRetrySubmit: () => void;
  onBack: () => void;
  onPlayAgain: () => void;
};

export default function WinCard({
  timeLabel,
  submitLoading,
  submitSuccess,
  submitError,
  onRetrySubmit,
  onBack,
  onPlayAgain,
}: WinCardProps) {
  return (
    <View style={styles.section}>
      <View style={styles.card}>
        <Text style={styles.title}>You Win</Text>
        <Text style={styles.sub}>All pairs connected!</Text>
        <Text style={styles.time}>Time: {timeLabel}</Text>
        {submitLoading && (
          <Text style={styles.submitStatusText}>Saving score…</Text>
        )}
        {submitSuccess && !submitError && (
          <Text style={styles.submitSuccessText}>Score saved.</Text>
        )}
        {submitError && (
          <View style={styles.submitErrorWrap}>
            <Text style={styles.submitErrorText}>
              Score couldn't be saved. Check your connection and try again.
            </Text>
            <TouchableOpacity
              style={[styles.retryButton, submitLoading && styles.retryButtonDisabled]}
              onPress={onRetrySubmit}
              disabled={submitLoading}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity style={styles.winButton} onPress={onBack}>
          <Text style={styles.winButtonText}>Back to levels</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.winButtonSecondary} onPress={onPlayAgain}>
          <Text style={styles.winButtonTextSecondary}>Play again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    minWidth: 280,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2ecc71',
    marginBottom: 8,
  },
  sub: {
    fontSize: 16,
    color: '#b8b8b8',
    marginBottom: 8,
  },
  time: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2ecc71',
    marginBottom: 20,
  },
  submitStatusText: {
    color: '#95a5a6',
    fontSize: 14,
    marginBottom: 16,
  },
  submitSuccessText: {
    color: '#2ecc71',
    fontSize: 14,
    marginBottom: 16,
  },
  submitErrorWrap: {
    marginBottom: 16,
    alignItems: 'center',
  },
  submitErrorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#c0392b',
    borderRadius: 8,
  },
  retryButtonDisabled: {
    opacity: 0.6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  winButton: {
    backgroundColor: '#3498db',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  winButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  winButtonSecondary: {
    paddingVertical: 12,
  },
  winButtonTextSecondary: {
    color: '#95a5a6',
    fontSize: 15,
  },
});
