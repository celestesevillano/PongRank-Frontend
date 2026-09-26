import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Spacing } from '@/constants/theme';
import { useSession } from '@/context/session';

export default function DashboardScreen() {
  const { player, signOut } = useSession();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title">Hola, {player?.name?.split(' ')[0] ?? 'jugador'}</ThemedText>

        <ThemedView type="backgroundElement" style={styles.ratingCard}>
          <ThemedText type="small" style={{ color: Brand.textSecondary }}>
            Tu rating
          </ThemedText>
          <ThemedText type="title" style={{ color: Brand.red, fontSize: 48 }}>
            {Math.round(player?.ratingGlicko ?? 1500)}
          </ThemedText>
        </ThemedView>

        <ThemedText type="small" style={{ color: Brand.textSecondary, textAlign: 'center' }}>
          El resto del dashboard (partidas, ranking, buscar rival) viene en la siguiente pasada.
        </ThemedText>

        <Pressable style={styles.signOutButton} onPress={() => signOut()}>
          <ThemedText style={{ color: Brand.red }}>Cerrar sesión</ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.four,
    paddingHorizontal: Spacing.four,
  },
  ratingCard: {
    alignItems: 'center',
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.six,
    borderRadius: Spacing.four,
    gap: Spacing.one,
  },
  signOutButton: {
    marginTop: Spacing.four,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
});
