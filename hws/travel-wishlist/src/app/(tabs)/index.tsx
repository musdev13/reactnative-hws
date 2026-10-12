import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapView, { MapPressEvent, PROVIDER_GOOGLE } from 'react-native-maps';
import { INITIAL_MAP_REGION } from '../../constants/categories';
import { PendingPoint, TravelPlace } from '../../types/travel';
import { getUserCurrentLocation } from '../../services/location';
import { usePlaces } from '../../context/PlacesContext';
import { PlaceMarker } from '../../components/PlaceMarker';
import { DraggablePendingMarker } from '../../components/DraggablePendingMarker';
import { AddPlaceModal } from '../../components/AddPlaceModal';

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);

  const { places, addPlace, selectedPlaceForFocus, setSelectedPlaceForFocus } = usePlaces();

  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [pendingPoint, setPendingPoint] = useState<PendingPoint | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // Ефект: реакція на перехід зі списку Wishlist (політ камери)
  useEffect(() => {
    if (selectedPlaceForFocus) {
      mapRef.current?.animateToRegion(
        {
          latitude: selectedPlaceForFocus.coordinate.latitude,
          longitude: selectedPlaceForFocus.coordinate.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        1000
      );
      setSelectedPlaceForFocus(null);
    }
  }, [selectedPlaceForFocus]);

  const handleMapPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setPendingPoint({ latitude, longitude });
  };

  const handleSavePlace = async (newPlace: TravelPlace) => {
    await addPlace(newPlace);
    setPendingPoint(null);
  };

  const handleFindMe = async () => {
    const coords = await getUserCurrentLocation();
    if (coords) {
      setUserCoords(coords);
      mapRef.current?.animateToRegion(
        {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        },
        800
      );
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_MAP_REGION}
        showsUserLocation={true}
        showsMyLocationButton={false}
        onPress={handleMapPress}
      >
        {places.map((place) => (
          <PlaceMarker key={place.id} place={place} />
        ))}

        {pendingPoint && (
          <DraggablePendingMarker
            coordinate={pendingPoint}
            onDragEnd={(coords) => setPendingPoint(coords)}
          />
        )}
      </MapView>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>🌍 Мій тревел-щоденник</Text>
        <Text style={styles.headerSubtitle}>
          {pendingPoint
            ? 'Натисніть кнопку внизу або перетягніть маркер'
            : 'Торкніться карти, щоб поставити мітку'}
        </Text>
      </View>

      <TouchableOpacity style={styles.fabLocation} onPress={handleFindMe} activeOpacity={0.8}>
        <Text style={styles.fabIcon}>🎯</Text>
      </TouchableOpacity>

      {pendingPoint && (
        <TouchableOpacity
          style={styles.confirmPinButton}
          activeOpacity={0.85}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.confirmPinText}>✨ Додати це місце у Wishlist</Text>
        </TouchableOpacity>
      )}

      <AddPlaceModal
        visible={isModalVisible}
        coordinate={pendingPoint}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSavePlace}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    position: 'absolute',
    top: 54,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  fabLocation: {
    position: 'absolute',
    right: 20,
    top: 140,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  fabIcon: {
    fontSize: 22,
  },
  confirmPinButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmPinText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
