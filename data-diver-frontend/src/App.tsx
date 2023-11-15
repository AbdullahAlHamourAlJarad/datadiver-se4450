import React from 'react';
import './App.css';
import DummyForm from './components/DummyForm';
import { ErrorBoundary } from 'react-error-boundary';

function App() {
  return (
    <ErrorBoundary fallback={<div>Error Occurred</div>}>
      <DummyForm />
    </ErrorBoundary>
  );
}

export default App;
