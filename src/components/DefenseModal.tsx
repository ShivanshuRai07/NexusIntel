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

export default function DefenseModal({ deal, onClose }: { deal: Deal, onClose: () => void }) {
  if (!deal) return null;
  
  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString("en-US", { 
      year: 'numeric', month: 'long', day: 'numeric', 
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-lg overflow-hidden flex flex-col relative animate-data-stream" style={{ border: '1px solid rgba(0, 212, 255, 0.4)' }}>
        
        {/* Header */}
        <div className="px-5 py-3 border-b border-white/10 flex justify-between items-center" style={{ background: 'rgba(0, 212, 255, 0.1)' }}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-blue shadow-[0_0_8px_#00D4FF] animate-pulse" />
            <h2 className="font-orbitron text-sm font-bold text-neon-blue tracking-wider uppercase">Strategic Defense Transfer</h2>
          </div>
          <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-base text-white">{deal.title}</h3>
              <div className="text-right shrink-0 ml-4">
                <div className="text-xs text-text-muted uppercase">Deal Value</div>
                <div className="font-orbitron font-bold text-neon-green text-sm">{deal.value}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-text-secondary">{deal.country1}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              <span className="text-xs text-white font-semibold">{deal.country2}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-2">
            <div className="bg-black/20 p-2.5 rounded border border-white/5">
              <div className="text-[9px] text-text-muted uppercase tracking-wider mb-1">Date Logged</div>
              <div className="text-xs text-text-secondary">{formatDate(deal.date)}</div>
            </div>
            <div className="bg-black/20 p-2.5 rounded border border-white/5">
              <div className="text-[9px] text-text-muted uppercase tracking-wider mb-1">Category</div>
              <div className="text-xs text-text-secondary">{deal.category}</div>
            </div>
          </div>

          <div className="bg-black/20 p-3 rounded border border-white/5">
            <div className="text-[9px] text-text-muted uppercase tracking-wider mb-2">Intelligence Briefing</div>
            <p className="text-xs text-text-primary leading-relaxed">
              {deal.details}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
            <div className="flex flex-wrap gap-2">
              {deal.tags.map(tag => (
                <span key={tag} className="text-[9px] px-2 py-1 rounded bg-white/5 border border-white/10 text-text-secondary uppercase tracking-widest">
                  {tag}
                </span>
              ))}
            </div>

            {deal.link && (
              <a 
                href={deal.link} 
                target="_blank" 
                rel="noreferrer"
                className="text-[9px] font-bold text-neon-blue uppercase tracking-widest px-3 py-1.5 rounded border border-neon-blue/30 hover:bg-neon-blue/10 hover:border-neon-blue transition-all flex items-center gap-1.5"
              >
                View Source Details
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
