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
import { supabase } from './lib/supabase';

function App() {
  const [session, setSession] = useState(null);
  const [currentStep, setCurrentStep] = useState('projects');
  const [currentProject, setCurrentProject] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const saveProject = useCallback(async (data) => {
    if (!currentProject) return;

    await supabase
      .from('projects')
      .update({
        data: { ...currentProject.data, ...data },
        updated_at: new Date().toISOString()
      })
      .eq('id', currentProject.id);
  }, [currentProject]);

  useEffect(() => {
    if (!currentProject) return;
    const interval = setInterval(() => {
      saveProject({});
    }, 30000); // Autosave every 30s
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
    switch (currentStep) {
      case 'dashboard':
        return <Dashboard onStartProject={handleStartProject} />;
      case 'projects':
        return <Projects
          onNew={handleStartProject}
          onResume={(p) => {
            setCurrentProject(p);
            setCurrentStep('research'); // or logic to resume from last step
          }}
        />;
      case 'research':
        return <Research onNext={(data) => {
          saveProject({ research: data });
          setCompletedSteps([...new Set([...completedSteps, 'research'])]);
          setCurrentStep('script');
        }} />;
      case 'script':
        return <Script onNext={(data) => {
          saveProject({ script: data });
          setCompletedSteps([...new Set([...completedSteps, 'script'])]);
          setCurrentStep('voice');
        }} />;
      case 'voice':
        return <Voice onNext={(data) => {
          saveProject({ audio: data });
          setCompletedSteps([...new Set([...completedSteps, 'voice'])]);
          setCurrentStep('video');
        }} />;
      case 'video':
        return <Video onNext={(data) => {
          saveProject({ video: data });
          setCompletedSteps([...new Set([...completedSteps, 'video'])]);
          setCurrentStep('editor');
        }} />;
      case 'editor':
        return <Editor onNext={(data) => {
          saveProject({ editor: data });
          setCompletedSteps([...new Set([...completedSteps, 'editor'])]);
          setCurrentStep('publish');
        }} />;
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
      <Sidebar
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        completedSteps={completedSteps}
      />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          {renderStep()}
        </div>
      </main>
    </div>
  );
}

export default App;
