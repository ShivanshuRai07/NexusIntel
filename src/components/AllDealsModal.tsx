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
    if(!isoString) return "just now";
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
    if(diff < 60) return `${diff}m ago`;
    if(diff < 1440) return `${Math.floor(diff/60)}h ago`;
    return `${Math.floor(diff/1440)}d ago`;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col relative animate-data-stream" style={{ border: '1px solid rgba(255, 140, 0, 0.4)' }}>
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center bg-neon-orange/10 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-neon-orange animate-pulse">⚔</span>
            <h2 className="font-orbitron text-lg font-bold text-neon-orange tracking-widest uppercase">Global Strategic Defense Events - 72 Hour Log</h2>
          </div>
          <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors bg-black/30 p-1.5 rounded-full hover:bg-white/10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 thin-scroll">
          {deals.length === 0 ? (
            <div className="h-full flex items-center justify-center text-neon-orange/60 animate-pulse font-orbitron">No recent deals located...</div>
          ) : (
            deals.map((deal) => (
              <div 
                key={deal.id}
                onClick={() => {
                  onClose();
                  onSelectDeal(deal);
                }}
                className="bg-black/40 border border-white/10 rounded-lg p-4 cursor-pointer hover:border-neon-orange/50 hover:bg-neon-orange/10 transition-all flex flex-col md:flex-row gap-4"
              >
                {/* Meta / Time */}
                <div className="shrink-0 md:w-32 flex flex-col md:border-r border-white/10 pr-4">
                  <div className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-1">Time Logged</div>
                  <div className="text-sm font-orbitron text-white">{getRelativeTime(deal.date)}</div>
                  <div className="text-[9px] text-text-secondary mt-1">{new Date(deal.date).toLocaleDateString()}</div>
                  <div className="mt-auto pt-2">
                     <span className="text-[8px] text-neon-blue px-1.5 py-0.5 rounded bg-neon-blue/10 border border-neon-blue/20 uppercase">
                       {deal.category}
                     </span>
                  </div>
                </div>

                {/* Main Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[10px] text-text-secondary uppercase tracking-widest mb-1.5 font-bold">
                    <span>{deal.country1}</span>
                    <span className="text-neon-orange">→</span>
                    <span>{deal.country2}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 leading-tight">{deal.title}</h3>
                  <p className="text-[11px] text-text-primary leading-relaxed line-clamp-2">{deal.details}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {deal.tags.map(tag => (
                      <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-text-secondary uppercase">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Value Column */}
                <div className="shrink-0 md:w-32 flex flex-col items-end justify-center md:border-l border-white/10 pl-4 text-right">
                  <div className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Transfer Value</div>
                  <div className="text-lg font-orbitron font-bold text-neon-green">{deal.value}</div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
