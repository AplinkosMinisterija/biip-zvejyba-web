import { createContext, useEffect, useState } from 'react';
import { LocationType, useGeolocationWatcher } from '../../utils';
import { useMutation } from 'react-query';
import api from '../../utils/api';

export type LocationContextType = {
  coordinates: any;
  error?: any;
  location?: any;
  getLocation: (type: LocationType) => Promise<any>;
  getLocationManually: (data: any) => Promise<any>;
  locationLoading: boolean;
};

const defaultValue: LocationContextType = {
  coordinates: undefined,
  error: undefined,
  location: undefined,
  getLocation: () => Promise.resolve(),
  getLocationManually: () => Promise.resolve(),
  locationLoading: false,
};

export const LocationContext: any = createContext<LocationContextType>(defaultValue);

export const LocationProvider = ({ children }: any) => {
  const [location, setLocation] = useState();
  const { coordinates, error } = useGeolocationWatcher();

  const { mutateAsync, isLoading: locationLoading } = useMutation(
    async ({ coordinates, type }: { coordinates: any; type: LocationType }) => {
      console.log('getting location');
      if (coordinates && type) {
        return await api.getLocation({
          query: JSON.stringify({
            type,
            coordinates,
          }),
        });
      }
    },
    {
      onSuccess: (value) => {
        setLocation(value);
      },
    },
  );

  const getLocation = async (type: LocationType) => {
    return await mutateAsync({ coordinates, type });
  };

  const getLocationManually = mutateAsync;

  return (
    <LocationContext.Provider
      value={{
        coordinates,
        error,
        location,
        getLocation,
        getLocationManually,
        locationLoading,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
