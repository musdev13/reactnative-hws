import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { TravelPlace } from '../types/travel';
import { getCategoryById } from '../constants/categories';

interface PlaceMarkerProps {
  place: TravelPlace;
  onPress?: () => void;
}

export const PlaceMarker: React.FC<PlaceMarkerProps> = ({ place, onPress }) => {
  const category = getCategoryById(place.categoryId);

  return (
    <Marker
      coordinate={place.coordinate}
      onPress={onPress}
      tracksViewChanges={false}
      anchor={{ x: 0.5, y: 1.0 }}
    >
      <View style={styles.markerContainer}>
        <View style={[styles.bubble, { backgroundColor: category.color }]}>
          <Text style={styles.emoji}>{category.emoji}</Text>
        </View>
        <View style={[styles.arrow, { borderTopColor: category.color }]} />
      </View>

      <Callout tooltip>
        <View style={styles.callout}>
          <View style={styles.calloutHeader}>
            <Text style={styles.calloutCategory}>{category.label}</Text>
            <Text style={styles.calloutRating}>{'⭐'.repeat(place.rating)}</Text>
          </View>
          <Text style={styles.calloutTitle}>{place.title}</Text>
          {place.description ? (
            <Text style={styles.calloutDesc} numberOfLines={2}>
              {place.description}
            </Text>
          ) : null}
        </View>
      </Callout>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    width: 44,
    height: 48,
  },
  bubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  emoji: {
    fontSize: 18,
  },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  callout: {
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 6,
  },
  calloutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  calloutCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  calloutRating: {
    fontSize: 10,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  calloutDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
  },
});
