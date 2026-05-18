import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Research from './pages/Research';
import Script from './pages/Script';
import Voice from './pages/Voice';
import Video from './pages/Video';
import Editor from './pages/Editor';
import Publish from './pages/Publish';
import Auth from './pages/Auth';
import Projects from './pages/Projects';
import Onboarding from './pages/Onboarding';
import { supabase } from './lib/supabase';

function App() {
  const [session, setSession] = useState(null);
  const [currentStep, setCurrentStep] = useState('projects');
  const [currentProject, setCurrentProject] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkOnboarding(session.user.id);
      else setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkOnboarding(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkOnboarding = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('api_keys')
      .eq('id', userId)
      .single();

    // If no keys are set, show onboarding
    if (!data?.api_keys || Object.keys(data.api_keys).length === 0) {
      setShowOnboarding(true);
      setCurrentStep('onboarding');
    }
    setLoading(false);
  };

  const saveProject = useCallback(async (data) => {
    if (!currentProject) return;

    const { data: updated, error } = await supabase
      .from('projects')
      .update({
        data: { ...currentProject.data, ...data },
        updated_at: new Date().toISOString()
      })
      .eq('id', currentProject.id)
      .select()
      .single();

    if (updated) setCurrentProject(updated);
  }, [currentProject]);

  useEffect(() => {
    if (!currentProject) return;
    const interval = setInterval(() => {
      saveProject({});
    }, 30000);
    return () => clearInterval(interval);
  }, [currentProject, saveProject]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  const handleStartProject = async () => {
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        user_id: session.user.id,
        title: 'New Video Project',
        status: 'draft',
        current_step: 0,
        data: {}
      }])
      .select()
      .single();

    if (data) {
      setCurrentProject(data);
      setCurrentStep('research');
    }
  };

  const renderStep = () => {
    if (showOnboarding || currentStep === 'onboarding') {
      return <Onboarding onComplete={() => {
        setShowOnboarding(false);
        setCurrentStep('projects');
      }} />;
    }

    switch (currentStep) {
      case 'dashboard':
        return <Dashboard onStartProject={handleStartProject} />;
      case 'projects':
        return <Projects
          onNew={handleStartProject}
          onResume={(p) => {
            setCurrentProject(p);
            // Resume at the right step based on project data
            const lastStep = p.data?.lastStep || 'research';
            setCurrentStep(lastStep);
          }}
        />;
      case 'research':
        return <Research onNext={(data) => {
          saveProject({ research: data, lastStep: 'script' });
          setCompletedSteps([...new Set([...completedSteps, 'research'])]);
          setCurrentStep('script');
        }} />;
      case 'script':
        return <Script
          context={currentProject?.data?.research}
          onNext={(data) => {
            saveProject({ script: data, lastStep: 'voice' });
            setCompletedSteps([...new Set([...completedSteps, 'script'])]);
            setCurrentStep('voice');
          }}
        />;
      case 'voice':
        return <Voice
          script={currentProject?.data?.script}
          onNext={(data) => {
            saveProject({ audio: data, lastStep: 'video' });
            setCompletedSteps([...new Set([...completedSteps, 'voice'])]);
            setCurrentStep('video');
          }}
        />;
      case 'video':
        return <Video
          script={currentProject?.data?.script}
          onNext={(data) => {
            saveProject({ video: data, lastStep: 'editor' });
            setCompletedSteps([...new Set([...completedSteps, 'video'])]);
            setCurrentStep('editor');
          }}
        />;
      case 'editor':
        return <Editor
          project={currentProject}
          onNext={(data) => {
            saveProject({ editor: data, lastStep: 'publish' });
            setCompletedSteps([...new Set([...completedSteps, 'editor'])]);
            setCurrentStep('publish');
          }}
        />;
      case 'publish':
        return <Publish projectData={currentProject} />;
      case 'settings':
        return <Settings />;
      default:
        return <Projects onNew={handleStartProject} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
      {!showOnboarding && currentStep !== 'onboarding' && (
        <Sidebar
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          completedSteps={completedSteps}
          userEmail={session.user.email}
        />
      )}
      <main className="flex-1 overflow-y-auto">
        <div className={showOnboarding || currentStep === 'onboarding' ? "" : "max-w-5xl mx-auto p-8"}>
          {renderStep()}
        </div>
      </main>
    </div>
  );
}

export default App;
