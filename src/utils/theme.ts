import { createGlobalStyle } from 'styled-components';

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    transparent: string;
    label: string;
    error: string;
    success: string;
    powder: string;
    hover: {
      primary: string;
      secondary: string;
      tertiary: string;
      transparent: string;
      danger: string;
      success: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      labels: string;
      accent: string;
      error: string;
      input: string;
      powder: string;
      retroBlack: string;
    };
    border: string;
    background: string;
    largeButton: {
      FLORAL_WHITE: string;
      GHOST_WHITE: string;
      AZURE: string;
      HONEY_DEW: string;
      ALICE_BLUE: string;
      GREY: string;
    };
  };
}

export const theme: Theme = {
  colors: {
    primary: '#102eb1',
    secondary: '#121A55',
    tertiary: '#101010',
    transparent: 'transparent',
    label: '#4B5565',
    error: '#FE5B78',
    success: '#4FB922',
    powder: '#FFFFFFCC',

    hover: {
      primary: '#102EB1',
      secondary: '#121A55',
      tertiary: '#F7F7F7',
      transparent: 'transparent',
      danger: '#FE5B78E6',
      success: '#4FB922B3',
    },
    text: {
      primary: '#2C2C2C',
      secondary: '#525252',
      tertiary: '#4B5565',
      labels: '#697586',
      accent: '#102EB1',
      error: '#FE5B78',
      input: '#231f20',
      powder: '#FFFFFFCC',
      retroBlack: '#101010',
    },
    border: '#CDD5DF',
    background: '#f7f7f7',
    largeButton: {
      FLORAL_WHITE: '#FFF5E8',
      GHOST_WHITE: '#EBEDFD', //'#F0F0FF'
      AZURE: '#EAFBF6',
      HONEY_DEW: '#E3F5E1',
      ALICE_BLUE: '#E6F4FF',
      GREY: '#f7f7f7',
    },
  },
};

export const GlobalStyle = createGlobalStyle`

  * {
    box-sizing: border-box;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  html {
    font-size: 62.5%;
    width: 100vw;
    color: #2C2C2C;

  }

  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #f7f7f7;
    font-size: 1.6rem;
    overflow: hidden;
    justify-content: center;
  }

  h1 {
    font-size: 3.2rem;
    color: #2C2C2C;
  }

  a {
    text-decoration: none;
    color: inherit;

    :hover {
      color: inherit;
    }
  }

  button {
    outline: none;
    text-decoration: none;
    display: block;
    border: none;
    background-color: transparent;
  }

  #__next {
    height: 100%;
  }

  textarea {
    font-size: 1.6rem;
  }


  .leaflet-div-icon {
    background: transparent;
    border: none;
  }


`;

export const device = {
  mobileS: `(max-width: 320px)`,
  mobileM: `(max-width: 425px)`,
  mobileL: `(max-width: 868px)`,
  desktop: `(min-width: 869px)`,
};
