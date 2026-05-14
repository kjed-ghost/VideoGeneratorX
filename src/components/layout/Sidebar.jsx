import React from 'react';
import {
  Search,
  FileText,
  Mic,
  Video,
  Edit3,
  Send,
  Settings,
  LayoutDashboard,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import { cn } from '../../lib/utils';

const steps = [
  { id: 'research', label: 'Research', icon: Search },
  { id: 'script', label: 'Script', icon: FileText },
  { id: 'voice', label: 'Voice', icon: Mic },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'editor', label: 'Editor', icon: Edit3 },
  { id: 'publish', label: 'Publish', icon: Send },
];

export default function Sidebar({ currentStep, onStepChange, completedSteps = [] }) {
  return (
    <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-screen">
      <div className="p-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          ContentFlow
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <button
          onClick={() => onStepChange('projects')}
          className={cn(
            "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
            currentStep === 'projects' ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-900"
          )}
        >
          <FolderOpen size={20} />
          <span>Projects</span>
        </button>

        <button
          onClick={() => onStepChange('dashboard')}
          className={cn(
            "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
            currentStep === 'dashboard' ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-900"
          )}
        >
          <LayoutDashboard size={20} />
          <span>Analytics</span>
        </button>

        <div className="py-4">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Current Pipeline
          </p>
        </div>

        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = completedSteps.includes(step.id);
          const isActive = currentStep === step.id;

          return (
            <button
              key={step.id}
              onClick={() => onStepChange(step.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors",
                isActive ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-900"
              )}
            >
              <div className="flex items-center space-x-3">
                <Icon size={20} />
                <span>{step.label}</span>
              </div>
              {isCompleted && <CheckCircle2 size={16} className="text-green-500" />}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => onStepChange('settings')}
          className={cn(
            "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
            currentStep === 'settings' ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-900"
          )}
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}
