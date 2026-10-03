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

interface AllDealsModalProps {
  deals: Deal[];
  onClose: () => void;
  onSelectDeal: (deal: Deal) => void;
}

export default function AllDealsModal({ deals, onClose, onSelectDeal }: AllDealsModalProps) {
  const getRelativeTime = (isoString: string) => {
    if (!isoString) return "just now";
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0F1626] border border-slate-700/80 w-full max-w-4xl max-h-[85vh] rounded-xl overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-100">
                Defense Procurement & Strategic Transfer Register
              </h2>
              <p className="text-[11px] text-slate-400">
                Verified international military contracts, bilateral agreements & defense acquisitions
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-md hover:bg-slate-800 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2.5 thin-scroll">
          {deals.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-slate-400 text-xs font-mono">
              No procurement records available in current timeframe.
            </div>
          ) : (
            deals.map((deal) => (
              <div 
                key={deal.id}
                onClick={() => {
                  onClose();
                  onSelectDeal(deal);
                }}
                className="bg-slate-900/50 border border-slate-800 rounded-lg p-3.5 cursor-pointer hover:border-slate-700 hover:bg-slate-800/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wide">
                      {deal.country1} → {deal.country2}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
                      {deal.category}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-[9px] text-slate-500 font-mono">
                      {getRelativeTime(deal.date)}
                    </span>
                  </div>

                  <h3 className="font-semibold text-xs text-slate-200 group-hover:text-sky-300 transition-colors line-clamp-1">
                    {deal.title}
                  </h3>
                  
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {deal.details}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <div className="text-right">
                    <span className="text-[9px] text-slate-500 uppercase block">Value</span>
                    <span className="font-mono font-bold text-xs text-emerald-400">
                      {deal.value}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors">
                    →
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>Displaying {deals.length} verified procurement events</span>
          <button 
            onClick={onClose}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close Register
          </button>
        </div>

      </div>
    </div>
  );
}
