import { createSlice } from '@reduxjs/toolkit';

export interface FishingReducerProps {
  currentFishing: number | null;
  coordinates: { x: number; y: number } | null;
  location: {
    id: string;
    name: string;
    municipality: {
      id: number;
      name: string;
    };
  } | null;
  error: string | null;
}

export const initialState: FishingReducerProps = {
  currentFishing: null,
  coordinates: null,
  location: null,
  error: null,
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
