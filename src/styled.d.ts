import 'styled-components';

// styled-components 6.1.8+ types `DefaultTheme` as `{}`; the app reads its theme
// untyped, as it did on 6.1.1.
declare module 'styled-components' {
  export interface DefaultTheme {
    [key: string]: any;
  }
}
