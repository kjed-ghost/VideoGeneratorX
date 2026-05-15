import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Clock, Play, FileVideo, MoreVertical } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Projects({ onResume, onNew }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });

    if (data) setProjects(data);
    setLoading(false);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Your Projects</h1>
          <p className="text-slate-400 mt-2">Manage and resume your video creation workflows.</p>
        </div>
        <button
          onClick={onNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all"
        >
          <Plus size={20} />
          New Project
        </button>
      </header>

      {projects.length === 0 ? (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-20 text-center">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500">
            <FileVideo size={32} />
          </div>
          <h3 className="text-xl font-bold text-white">No projects yet</h3>
          <p className="text-slate-400 mt-2 mb-8">Start your first video automation journey today.</p>
          <button onClick={onNew} className="text-blue-400 hover:underline font-semibold">Create your first project →</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden hover:border-slate-500 transition-all group">
              <div className="aspect-video bg-slate-900 relative flex items-center justify-center">
                <FileVideo size={48} className="text-slate-700 group-hover:text-blue-500/50 transition-colors" />
                <div className="absolute top-4 right-4">
                  <span className="bg-slate-800/80 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase text-blue-400">
                    Step {project.current_step + 1}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-white truncate">{project.title}</h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Clock size={12} />
                  Updated {new Date(project.updated_at).toLocaleDateString()}
                </p>
                <div className="mt-6 flex justify-between items-center">
                   <button
                    onClick={() => onResume(project)}
                    className="flex items-center gap-2 text-sm font-bold text-white bg-slate-700 hover:bg-blue-600 px-4 py-2 rounded-lg transition-all"
                   >
                     <Play size={14} fill="currentColor" />
                     Resume
                   </button>
                   <button className="text-slate-500 hover:text-white p-2">
                     <MoreVertical size={18} />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
