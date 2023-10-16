import { createGlobalStyle } from 'styled-components';

export interface Theme {
    colors: {
        primary: string;
        secondary: string;
        tertiary: string;
        transparent: string;
        danger: string;
        success: string;
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
        };
        input: string;
        border: string;
        label: string;
        error: string;
        light: string;
        white: string;
        darkerWhite: string;
        pending: string;
        grey: string;
    };
}

export const theme: Theme = {
    colors: {
        primary: '#667302',
        secondary: '#f89572',
        tertiary: '#919f7a',
        transparent: 'transparent',
        danger: '#FE5B78',
        success: '#4FB922',
        hover: {
            primary: '#859122',
            secondary: '#f8ad93',
            tertiary: '#a4af92',
            transparent: 'transparent',
            danger: '#FE5B78E6',
            success: '#4FB922B3',
        },
        text: {
            primary: '#231F20',
            secondary: '#121926',
            tertiary: '#4B5565',
            labels: '#697586',
            accent: '#667302',
            error: '#FE5B78',
            input: '#231f20',
        },
        input: '#F3F3F7',
        border: '#CDD5DF',
        label: '#0B1F51',
        error: '#FE5B78',
        light: '#f3f3f7',
        white: '#ffffff',
        darkerWhite: '#A4A7BD',
        pending: '#fea700',
        grey: '#B3B5C4',
    },
};

export const GlobalStyle = createGlobalStyle`
  
  * {
    box-sizing: border-box;
    font-family: "Atkinson Hyperlegible";
  }

  html {
    font-size: 62.5%;
    width: 100vw;
  }

  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #ffffff;
    font-size: 1.6rem;
    overflow: hidden;
    justify-content: center;
  }

  h1 {
    font-size: 3.2rem;
    color: #22231f;
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
