"use client";

interface Deal {
  id: string;
  title: string;
  country1: string;
  country2: string;
  date: string;
  details: string;
  value: string;
  category: string;
  tags: string[];
  link?: string;
}

export default function DefenseModal({ deal, onClose }: { deal: Deal; onClose: () => void }) {
  if (!deal) return null;
  
  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString("en-US", { 
      year: 'numeric', month: 'long', day: 'numeric', 
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0F1626] border border-slate-700/80 w-full max-w-lg rounded-xl overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Strategic Procurement Briefing
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-start gap-4 mb-2">
              <h3 className="font-semibold text-base text-slate-100 leading-snug">
                {deal.title}
              </h3>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Contract Value</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{deal.value}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="font-medium text-slate-400">Supplier:</span>
              <span className="font-semibold text-slate-200">{deal.country1}</span>
              <span className="text-slate-500">→</span>
              <span className="font-medium text-slate-400">Recipient:</span>
              <span className="font-semibold text-slate-200">{deal.country2}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <div className="text-[9.5px] text-slate-400 uppercase tracking-wider mb-0.5">Execution / Timestamp</div>
              <div className="text-xs font-mono text-slate-300">{formatDate(deal.date)}</div>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <div className="text-[9.5px] text-slate-400 uppercase tracking-wider mb-0.5">Asset Category</div>
              <div className="text-xs font-medium text-slate-300">{deal.category}</div>
            </div>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
            <div className="text-[9.5px] text-slate-400 uppercase tracking-wider mb-1.5 font-semibold">
              Operational Scope & Intelligence Summary
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {deal.details}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
            <div className="flex flex-wrap gap-1.5">
              {deal.tags.map(tag => (
                <span key={tag} className="text-[9.5px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
                  {tag}
                </span>
              ))}
            </div>

            {deal.link && (
              <a 
                href={deal.link} 
                target="_blank" 
                rel="noreferrer"
                className="text-[10px] font-medium text-sky-400 hover:text-sky-300 bg-sky-500/10 px-3 py-1.5 rounded border border-sky-500/20 hover:border-sky-500/40 transition-colors flex items-center gap-1.5"
              >
                Official Verification Link
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                </svg>
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
