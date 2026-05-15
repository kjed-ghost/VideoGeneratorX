import React from 'react';
import {
  Plus,
  Clock,
  MoreVertical,
  Play,
  FileVideo,
  BarChart2
} from 'lucide-react';

export default function Dashboard({ onStartProject }) {
  const recentProjects = [
    { id: 1, title: 'Future of AI Automation', date: '2 hours ago', status: 'In Progress', step: 'Video' },
    { id: 2, title: '10 Productivity Hacks', date: 'Yesterday', status: 'Completed', step: 'Publish' },
    { id: 3, title: 'Crypto Market Update', date: '3 days ago', status: 'Draft', step: 'Research' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back!</h1>
          <p className="text-slate-400 mt-2">Manage your video projects and automation pipelines.</p>
        </div>
        <button
          onClick={onStartProject}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          New Project
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-400">
            <FileVideo size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase">Total Projects</p>
            <p className="text-2xl font-bold text-white">12</p>
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-900/30 rounded-xl flex items-center justify-center text-green-400">
            <BarChart2 size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase">Minutes Generated</p>
            <p className="text-2xl font-bold text-white">142</p>
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-400">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase">Avg. Build Time</p>
            <p className="text-2xl font-bold text-white">8.5m</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock size={20} className="text-slate-500" />
          Recent Projects
        </h3>
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-700/30">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Project Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Step</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {recentProjects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-700/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{project.title}</p>
                    <p className="text-xs text-slate-500">{project.date}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                      project.status === 'Completed' ? "bg-green-900/30 text-green-500" :
                      project.status === 'In Progress' ? "bg-blue-900/30 text-blue-500" :
                      "bg-slate-700 text-slate-400"
                    )}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{project.step}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-600 rounded-lg transition-colors">
                      <Play size={16} className="text-slate-400 group-hover:text-blue-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
