import { createSlice } from '@reduxjs/toolkit';
import { Coordinates } from '../../utils';

export interface FishingReducerProps {
  currentFishing?: number;
  coordinates?: Coordinates;
  location?: Location;
  error?: string;
}

export const initialState: FishingReducerProps = {
  currentFishing: undefined,
  coordinates: undefined,
  location: undefined,
  error: undefined,
};

export const FishingReducer = createSlice({
  name: 'fishing',
  initialState,
  reducers: {
    setCurrentFishing: (state, action) => {
      return {
        ...state,
        currentFishing: action.payload,
      };
    },
    setCoordinates: (state, action) => {
      return {
        ...state,
        coordinates: action.payload,
      };
    },
    setLocation: (state, action) => {
      return {
        ...state,
        location: action.payload,
      };
    },
    setError: (state, action) => {
      return {
        ...state,
        error: action.payload,
      };
    },
  },
});

export const actions = FishingReducer.actions;

export default FishingReducer.reducer;
