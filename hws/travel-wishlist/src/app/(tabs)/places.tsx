import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { usePlaces } from '../../context/PlacesContext';
import { CategoryId, TravelPlace } from '../../types/travel';
import { CATEGORIES, getCategoryById } from '../../constants/categories';

export default function PlacesScreen() {
  const router = useRouter();
  const { places, deletePlace, setSelectedPlaceForFocus } = usePlaces();

  const [selectedFilter, setSelectedFilter] = useState<CategoryId | 'all'>('all');

  const filteredPlaces = places.filter((p) => {
    if (selectedFilter === 'all') return true;
    return p.categoryId === selectedFilter;
  });

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      'Видалення місця',
      `Ви дійсно хочете видалити "${title}" з вашого списку?`,
      [
        { text: 'Скасувати', style: 'cancel' },
        {
          text: 'Видалити',
          style: 'destructive',
          onPress: () => deletePlace(id),
        },
      ]
    );
  };

  const handleSelectPlace = (place: TravelPlace) => {
    setSelectedPlaceForFocus(place);
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📋 Мій Wishlist подорожей</Text>
          <Text style={styles.headerSubtitle}>
            Збережено місць: {filteredPlaces.length} з {places.length}
          </Text>
        </View>

        <View style={styles.filtersWrapper}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[{ id: 'all', label: 'Всі', emoji: '🌍', color: '#0F172A' }, ...CATEGORIES]}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.filtersContent}
            renderItem={({ item }) => {
              const isActive = selectedFilter === item.id;
              return (
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    isActive && { backgroundColor: item.color || '#0F172A' },
                  ]}
                  onPress={() => setSelectedFilter(item.id as CategoryId | 'all')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.filterEmoji}>{item.emoji}</Text>
                  <Text style={[styles.filterLabel, isActive && styles.filterLabelActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <FlatList
          data={filteredPlaces}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🗺️</Text>
              <Text style={styles.emptyTitle}>Список поки що порожній</Text>
              <Text style={styles.emptySubtitle}>
                Перейдіть на вкладку «Карта», торкніться будь-якого місця та додайте свою першу точку!
              </Text>
              <TouchableOpacity
                style={styles.goToMapButton}
                onPress={() => router.push('/(tabs)')}
                activeOpacity={0.8}
              >
                <Text style={styles.goToMapButtonText}>Перейти до карти ➔</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => {
            const cat = getCategoryById(item.categoryId);

            return (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.75}
                onPress={() => handleSelectPlace(item)}
              >
                <View style={[styles.iconCircle, { backgroundColor: cat.color }]}>
                  <Text style={styles.iconEmoji}>{cat.emoji}</Text>
                </View>

                <View style={styles.cardInfo}>
                  <View style={styles.titleRow}>
                    <Text style={styles.placeTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.ratingStars}>{'⭐'.repeat(item.rating)}</Text>
                  </View>

                  <Text style={styles.categoryLabel}>{cat.label}</Text>

                  {item.description ? (
                    <Text style={styles.descriptionText} numberOfLines={2}>
                      {item.description}
                    </Text>
                  ) : null}

                  <Text style={styles.coordsHint}>
                    📍 {item.coordinate.latitude.toFixed(4)}, {item.coordinate.longitude.toFixed(4)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(item.id, item.title)}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  activeOpacity={0.6}
                >
                  <Text style={styles.deleteIcon}>🗑️</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1, paddingHorizontal: 16 },
  header: { marginTop: 16, marginBottom: 12 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  headerSubtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },
  filtersWrapper: { marginBottom: 12 },
  filtersContent: { gap: 8, paddingVertical: 4 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  filterEmoji: { fontSize: 14 },
  filterLabel: { fontSize: 13, fontWeight: '600', color: '#475569' },
  filterLabelActive: { color: '#FFFFFF', fontWeight: '700' },
  listContent: { paddingBottom: 24, gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: { fontSize: 22 },
  cardInfo: { flex: 1, marginLeft: 12 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  placeTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', flex: 1 },
  ratingStars: { fontSize: 11, marginLeft: 6 },
  categoryLabel: { fontSize: 12, color: '#64748B', fontWeight: '600', marginBottom: 4 },
  descriptionText: { fontSize: 12, color: '#475569', lineHeight: 16, marginBottom: 4 },
  coordsHint: { fontSize: 10, color: '#94A3B8', fontFamily: 'monospace' },
  deleteBtn: { padding: 8, marginLeft: 6 },
  deleteIcon: { fontSize: 18 },
  emptyContainer: { alignItems: 'center', paddingVertical: 50, paddingHorizontal: 20 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#334155' },
  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  goToMapButton: {
    marginTop: 20,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  goToMapButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
