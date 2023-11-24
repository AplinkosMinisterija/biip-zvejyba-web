import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { captureException } from '@sentry/react';

const ErrorBoundary = ({ children }: any) => {
  const [error, setError] = useState<any>();

  useEffect(() => {
    const handleError = (event: any) => {
      captureException(error);
      setError(event.error || new Error('An error occurred'));
    };
    window.addEventListener('error', handleError);
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (error) {
    console.error(error);
    return (
      <Container>
        <h2>Įvyko nenumatyta klaida, prašome pabandyti vėliau</h2>
      </Container>
    );
  }
  return children;
};

export default ErrorBoundary;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  height: 100vh;
  text-align: center;
`;
