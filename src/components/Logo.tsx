import { Cpu } from 'lucide-react';

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 group shrink-0 ${className}`}>
      <div className="relative">
        {/* Logo Mark Container */}
        <div className="w-10 h-10 bg-[#141414] text-white flex items-center justify-center relative overflow-hidden group-hover:bg-[#616752] transition-colors duration-500 shadow-xl border border-[#C5C5C5]/20">
          <Cpu size={20} className="z-10 group-hover:scale-110 transition-transform duration-500" />
          
          {/* Decorative elements for 'Industrial' feel */}
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20" />
        </div>
        
        {/* Version Badge */}
        <div className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-[#616752] text-white font-mono text-[6px] rounded-full border border-white/40 shadow-sm">
          v3
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-sm font-bold tracking-tighter leading-none text-[#141414]">OK</span>
          <span className="font-mono text-[10px] font-light tracking-[0.3em] leading-none text-[#141414] opacity-80">STUDIO</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="h-[1px] w-4 bg-[#616752] opacity-40" />
          <span className="telemetry-label !text-[7px] opacity-40 whitespace-nowrap">KREUZTAL_SYSTEMS_UNIT.01</span>
        </div>
      </div>
    </div>
  );
}
