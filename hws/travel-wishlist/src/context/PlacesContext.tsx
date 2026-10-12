import React, { createContext, useContext, useEffect, useState } from 'react';
import { TravelPlace } from '../types/travel';
import { loadPlacesFromStorage, savePlacesToStorage } from '../services/storage';

// Опис інтерфейсу стану та методів контексту
interface PlacesContextType {
  places: TravelPlace[];
  selectedPlaceForFocus: TravelPlace | null;
  setSelectedPlaceForFocus: (place: TravelPlace | null) => void;
  addPlace: (newPlace: TravelPlace) => Promise<void>;
  deletePlace: (id: string) => Promise<void>;
}

const PlacesContext = createContext<PlacesContextType | undefined>(undefined);

export const PlacesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [places, setPlaces] = useState<TravelPlace[]>([]);
  const [selectedPlaceForFocus, setSelectedPlaceForFocus] = useState<TravelPlace | null>(null);

  // При старті додатку зчитуємо збережені дані з пам'яті
  useEffect(() => {
    const initData = async () => {
      const stored = await loadPlacesFromStorage();
      setPlaces(stored);
    };
    initData();
  }, []);

  const addPlace = async (newPlace: TravelPlace) => {
    const updated = [newPlace, ...places];
    setPlaces(updated);
    await savePlacesToStorage(updated);
  };

  const deletePlace = async (id: string) => {
    const updated = places.filter((p) => p.id !== id);
    setPlaces(updated);
    await savePlacesToStorage(updated);
  };

  return (
    <PlacesContext.Provider
      value={{
        places,
        selectedPlaceForFocus,
        setSelectedPlaceForFocus,
        addPlace,
        deletePlace,
      }}
    >
      {children}
    </PlacesContext.Provider>
  );
};

export const usePlaces = (): PlacesContextType => {
  const context = useContext(PlacesContext);
  if (!context) {
    throw new Error('usePlaces must be used within a PlacesProvider');
  }
  return context;
};
