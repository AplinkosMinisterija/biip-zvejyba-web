import api from './api';
import { LocationType } from './constants';

export const defaultQueries = {
  currentLocation: (locationType: LocationType) => ({
    queryKey: ['currentLocation'],
    queryFn: () => {
      console.log('getLocation', locationType, window.coordinates);
      return api.getLocation({
        query: JSON.stringify({
          type: locationType,
          coordinates: window.coordinates,
        }),
      });
    },
    enabled: !!locationType,
  }),
};
