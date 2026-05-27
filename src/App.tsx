import { useState } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { IntakeFlow } from './components/IntakeFlow';
import { MethodLibrary } from './components/MethodLibrary';
import type { AppView, FlowStep, IntakeAnswers } from './types/research';
import { EXAMPLE_SCENARIOS } from './data/exampleScenarios';
import './index.css';

function App() {
  const [view, setView] = useState<AppView>('landing');
  const [initialAnswers, setInitialAnswers] = useState<IntakeAnswers | undefined>(undefined);
  const [flowKey, setFlowKey] = useState(0);

  const handleStart = () => {
    setInitialAnswers(undefined);
    setFlowKey((k) => k + 1);
    setView('flow');
  };

  const handleLoadScenario = (scenario: { answers: IntakeAnswers }) => {
    setInitialAnswers(scenario.answers);
    setFlowKey((k) => k + 1);
    setView('flow');
  };

  const handleNavigate = (v: AppView) => {
    setView(v);
    if (v === 'landing') {
      setInitialAnswers(undefined);
    }
  };

  return (
    <Layout view={view} onNavigate={handleNavigate}>
      {view === 'landing' && (
        <LandingPage
          scenarios={EXAMPLE_SCENARIOS}
          onStart={handleStart}
          onLoadScenario={handleLoadScenario}
        />
      )}
      {view === 'flow' && (
        <IntakeFlow
          key={flowKey}
          initialAnswers={initialAnswers}
          initialStep={initialAnswers ? ('decision' as FlowStep) : undefined}
        />
      )}
      {view === 'library' && <MethodLibrary />}
    </Layout>
  );
}

export default App;
