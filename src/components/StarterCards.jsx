import React from 'react';
import { MessageCircleHeart, BookOpen, Languages, Code2, Sparkles, ArrowUpRight } from 'lucide-react';
import { STARTER_PROMPTS } from '../constants/starterPrompts';

const iconMap = {
  MessageCircleHeart,
  BookOpen,
  Languages,
  Code2
};

export default function StarterCards({ onSelectPrompt }) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 flex flex-col items-center justify-center animate-fade-in">
      {/* Hero Welcome Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Dedicated to Pure Suleimani (Eastern) Balochi</span>
      </div>

      {/* Main Balochi Heading */}
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-2 font-balochi tracking-wide leading-tight">
        وَش آتکے! مَں تَھی سلیمانی بلوچی اے آئی آں
      </h2>
      <p className="text-sm sm:text-base text-slate-400 text-center max-w-xl mb-4 font-sans">
        Ask anything in Balochi, Urdu, or English. SuleimaniGPT responds exclusively in genuine Eastern Balochi.
      </p>

      {/* Regions badge strip */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-slate-500 mb-8 max-w-lg">
        <span className="text-slate-400">Regional Dialects:</span>
        {['Kohlu', 'Dera Bugti', 'Barkhan', 'Sibi', 'Nasirabad', 'DG Khan', 'Rajanpur', 'Jacobabad'].map((region) => (
          <span key={region} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 font-medium">
            {region}
          </span>
        ))}
      </div>

      {/* 4 Clickable Starter Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
        {STARTER_PROMPTS.map((card) => {
          const IconComponent = iconMap[card.icon] || Sparkles;

          return (
            <button
              key={card.id}
              onClick={() => onSelectPrompt(card.promptText)}
              className="group text-left p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-950/20 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>

                {/* Balochi Title (RTL) */}
                <div className="text-base font-bold text-white font-balochi text-right mb-1 leading-snug">
                  {card.titleBalochi}
                </div>

                {/* Roman Title */}
                <div className="text-xs font-semibold text-emerald-400/90 mb-1">
                  {card.titleRoman}
                </div>

                {/* Subtitle / Description */}
                <div className="text-xs text-slate-400 leading-relaxed font-balochi text-right">
                  {card.subtitleBalochi}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-mono text-emerald-500/80">Eastern Balochi</span>
                <span className="group-hover:text-slate-300 transition-colors">Start Chat →</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
