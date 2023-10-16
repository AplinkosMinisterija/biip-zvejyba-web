import { createSlice } from '@reduxjs/toolkit';

interface FiltersState {
  users: any;
  permits: any;
  species: any;
  fosteredAnimals: any;
}

const initialState: FiltersState = {
  users: {},
  permits: {},
  species: {},
  fosteredAnimals: {},
};

export const FiltersReducer = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setUser: (state, action) => {
      return { ...state, users: action.payload };
    },
    setPermitsListFilter: (state, action) => {
      return { ...state, permits: action.payload };
    },
    setSpeciesFilters: (state, action) => {
      return { ...state, species: action.payload };
    },
    setFosteredAnimalsFilter: (state, action) => {
      return { ...state, fosteredAnimals: action.payload };
    },
  },
});

export default FiltersReducer.reducer;

export const actions = FiltersReducer.actions;
