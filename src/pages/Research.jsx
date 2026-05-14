import React, { useState } from 'react';
import { Search, Loader2, FileText, LineChart, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

export default function Research({ onNext }) {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedSources, setSelectedSources] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword) return;

    setLoading(true);
    try {
      // For now, using news aggregator as a primary source
      const newsResponse = await axios.get(`https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/search?q=${encodeURIComponent(keyword)}`);

      setResults({
        news: newsResponse.data.items.slice(0, 10),
        trends: [
          { query: `${keyword} news`, volume: 'High' },
          { query: `${keyword} guide`, volume: 'Medium' },
          { query: `best ${keyword}`, volume: 'Rising' },
        ]
      });
    } catch (error) {
      console.error("Research failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSource = (item) => {
    const isSelected = selectedSources.find(s => s.link === item.link);
    if (isSelected) {
      setSelectedSources(selectedSources.filter(s => s.link !== item.link));
    } else {
      setSelectedSources([...selectedSources, item]);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white">Research & Context</h1>
        <p className="text-slate-400 mt-2">Enter a topic to gather trending data and news articles for your script.</p>
      </header>

      <form onSubmit={handleSearch} className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter keyword or topic..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <button
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
          Search
        </button>
      </form>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
              <FileText size={20} className="text-blue-400" />
              Latest News
            </h3>
            <div className="space-y-3">
              {results.news.map((item, idx) => {
                const isSelected = selectedSources.find(s => s.link === item.link);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleSource(item)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-900/20 border-blue-500/50'
                        : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-white leading-tight mb-1">{item.title}</h4>
                        <p className="text-xs text-slate-500">{item.pubDate} • {item.author || 'Google News'}</p>
                      </div>
                      {isSelected && <CheckCircle2 size={18} className="text-blue-500 shrink-0" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-white mb-4">
                <LineChart size={20} className="text-indigo-400" />
                Related Trends
              </h3>
              <div className="space-y-4">
                {results.trends.map((trend, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-700/50 last:border-0">
                    <span className="text-slate-300 font-medium">{trend.query}</span>
                    <span className="text-xs px-2 py-1 bg-slate-700 rounded-md text-slate-400">{trend.volume}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-xl">
              <h4 className="font-bold mb-2">Ready to continue?</h4>
              <p className="text-sm text-blue-100 mb-6">
                You have selected {selectedSources.length} sources to use as context for your script.
              </p>
              <button
                onClick={onNext}
                disabled={selectedSources.length === 0}
                className="w-full bg-white text-indigo-700 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Use Selected as Context
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
