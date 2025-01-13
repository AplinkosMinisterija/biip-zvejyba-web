import { createContext, useState } from 'react';
import { LocationType } from '../../utils';
import { useMutation } from 'react-query';
import api from '../../utils/api';

export type LocationContextType = {
  coordinates: any;
  location?: any;
  locationType?: LocationType;
  setLocationType: (type: LocationType) => void;
  setLocation: (location: Location) => void;
  getLocation: (type: LocationType, coordinates: any) => void;
  getLocationManually: (data: any) => Promise<any>;
  locationLoading: boolean;
  error?: any;
};

const defaultValue: LocationContextType = {
  coordinates: undefined,
  location: undefined,
  setLocationType: (type: LocationType) => {},
  setLocation: (location: Location) => {},
  getLocation: (type: LocationType, coordinates: any) => {},
  getLocationManually: () => Promise.resolve(),
  locationLoading: false,
  error: undefined,
};

export const LocationContext: any = createContext<LocationContextType>(defaultValue);

export const LocationProvider = ({ children }: any) => {
  const [location, setLocation] = useState<any>();

  const { mutateAsync, isLoading: locationLoading } = useMutation(
    async ({ coordinates, type }: { coordinates: any; type: LocationType }) => {
      if (coordinates && type) {
        return await api.getLocation({
          query: JSON.stringify({
            type,
            coordinates,
          }),
        });
      }
    },
  );

  const getLocation = (type: LocationType, coordinates: any) => {
    mutateAsync({ coordinates, type }).then((response) => {
      if (response?.id === location?.id && response?.type === type) {
        return;
      } else {
        setLocation(response);
      }
    });
  };

  const getLocationManually = mutateAsync;

  return (
    <LocationContext.Provider
      value={{
        location,
        getLocation,
        getLocationManually,
        locationLoading,
        setLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
