import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { PendingPoint } from '../types/travel';

interface Props {
  coordinate: PendingPoint;
  onDragEnd: (coords: { latitude: number; longitude: number }) => void;
}

export const DraggablePendingMarker: React.FC<Props> = ({ coordinate, onDragEnd }) => {
  return (
    <Marker
      draggable
      coordinate={coordinate}
      onDragEnd={(e) => {
        onDragEnd(e.nativeEvent.coordinate);
      }}
      anchor={{ x: 0.5, y: 1.0 }}
    >
      <View style={styles.pinWrapper}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Утримуй і тягни</Text>
        </View>
        <View style={styles.pinCircle}>
          <Text style={styles.pinIcon}>📍</Text>
        </View>
        <View style={styles.pinTip} />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  pinWrapper: {
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  pinCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 8,
  },
  pinIcon: {
    fontSize: 20,
  },
  pinTip: {
    width: 4,
    height: 8,
    backgroundColor: '#EF4444',
  },
});
