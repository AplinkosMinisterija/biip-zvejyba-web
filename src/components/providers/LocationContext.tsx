import { createContext, useState } from 'react';
import { LocationType, useGeolocationWatcher } from '../../utils';
import { useMutation } from 'react-query';
import api from '../../utils/api';

export type LocationContextType = {
  coordinates: any;
  location?: any;
  setLocationType: (type: LocationType) => void;
  setLocation: (location: Location) => void;
  getLocation: (type: LocationType) => Promise<any>; //Todo: must be removed
  getLocationManually: (data: any) => Promise<any>; //Todo: must be removed
  locationLoading: boolean;
  error?: any;
};

const defaultValue: LocationContextType = {
  coordinates: undefined,
  location: undefined,
  setLocationType: (type: LocationType) => {},
  setLocation: (location: Location) => {},
  getLocation: () => Promise.resolve(), //Todo: must be removed
  getLocationManually: () => Promise.resolve(), //Todo: must be removed
  locationLoading: false,
  error: undefined,
};

export const LocationContext: any = createContext<LocationContextType>(defaultValue);

export const LocationProvider = ({ children }: any) => {
  const [locationType, setLocationType] = useState<LocationType | undefined>(); //Todo: must be persisted
  const [location, setLocation] = useState(); //Todo: must be persisted
  const { coordinates, error } = useGeolocationWatcher(); //Todo: must be persisted

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
