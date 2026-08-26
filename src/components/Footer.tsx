import React, { useState } from 'react';
import { Mail, Heart, Copy, Check, Sparkles, Shield, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const email = 'veducative@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="w-full mt-12 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60 backdrop-blur-xs pb-24 md:pb-8 pt-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand & Tagline */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-xs shadow-indigo-500/20 shrink-0">
              <div className="w-3.5 h-3.5 border-2 border-white rotate-45 rounded-xs" />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="font-black text-base tracking-tight text-slate-900 dark:text-white">
                  S.E.S.
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold">
                  Smart Expense Splitter
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                AI receipt scanning & smart group settlements
              </p>
            </div>
          </div>

          {/* Contact Email & Built By Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs">
            
            {/* Contact Email Button */}
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs">
              <Mail className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-slate-500 dark:text-slate-400 font-medium">Contact:</span>
              <a
                href={`mailto:${email}`}
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {email}
              </a>
              <button
                onClick={handleCopyEmail}
                title="Copy email address"
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ml-0.5"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>

            {/* Built By: Runtime Rebels Badge */}
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white border border-slate-700/50 shadow-xs">
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-300 text-xs">Built by:</span>
              <span className="font-black text-xs text-indigo-300 tracking-wide">
                Runtime Rebels
              </span>
            </div>

          </div>

        </div>

        {/* Bottom subtle divider and copyright notice */}
        <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>for frictionless expense tracking and bill splitting.</span>
          </div>
          <div className="flex items-center gap-3">
            <span>S.E.S. • Runtime Rebels</span>
            <span>•</span>
            <a href={`mailto:${email}`} className="hover:text-indigo-500 transition-colors">
              {email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
