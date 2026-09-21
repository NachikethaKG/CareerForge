import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Award, FileText, ExternalLink, Quote } from 'lucide-react';

export default function MatchResults({ data }) {
  if (!data) return null;

  const analysis = data.analysis || data;
  const parsedResume = data.parsed_resume;
  const score = typeof analysis.match_score === 'number' ? analysis.match_score : 0;
  const verdict = analysis.verdict_summary || '';
  const keyStrengths = Array.isArray(analysis.key_strengths) ? analysis.key_strengths : [];
  const missingSkills = Array.isArray(analysis.missing_skills) ? analysis.missing_skills : [];

  // Visual styling based on score thresholds: > 79 (green), 50-79 (yellow/orange), < 50 (red)
  const getScoreTheme = (s) => {
    if (s > 79) {
      return {
        gradientText: 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 bg-clip-text text-transparent',
        glow: 'bg-emerald-400/40',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        cardBorder: 'border-emerald-100',
        label: 'Strong Match',
      };
    }
    if (s >= 50) {
      return {
        gradientText: 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent',
        glow: 'bg-amber-400/40',
        badge: 'bg-amber-100 text-amber-800 border-amber-200',
        cardBorder: 'border-amber-100',
        label: 'Moderate Match',
      };
    }
    return {
      gradientText: 'bg-gradient-to-r from-rose-500 via-red-500 to-red-600 bg-clip-text text-transparent',
      glow: 'bg-rose-400/40',
      badge: 'bg-rose-100 text-rose-800 border-rose-200',
      cardBorder: 'border-rose-100',
      label: 'Low Match',
    };
  };

  const scoreTheme = getScoreTheme(score);

  // Animation variants for staggered cards
  const listContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 15 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.35, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden"
    >
      {/* Top Header */}
      <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-50 to-blue-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-semibold shadow-xs">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">Match Analysis Results</h2>
            <p className="text-xs text-slate-500">Comprehensive AI fit assessment</p>
          </div>
        </div>
        {data.job_url && (
          <a
            href={data.job_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-3 py-1.5 rounded-lg transition-colors truncate max-w-[220px]"
            title={data.job_url}
          >
            <span>Target Job</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* The Verdict: Emphasized Highlight Box at the Top */}
        <div className="relative rounded-2xl border-l-4 border-indigo-500 bg-gradient-to-r from-indigo-50/80 via-slate-50/60 to-white p-5 md:p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-indigo-700">
            <Quote className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Verdict Summary
            </span>
          </div>
          <blockquote className="text-base md:text-lg font-medium text-slate-800 leading-relaxed italic">
            &ldquo;{verdict || 'No verdict summary available for this evaluation.'}&rdquo;
          </blockquote>
        </div>

        {/* The Score: Massive & Visually Striking with Glowing Soft Shadow */}
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-gradient-to-b from-slate-50/90 to-white border border-slate-200/70 shadow-xs relative overflow-hidden">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
            Overall Compatibility
          </span>

          <div className="relative flex items-baseline justify-center my-2">
            {/* Glowing soft shadow behind the number */}
            <div className={`absolute inset-0 -m-6 rounded-full blur-3xl opacity-40 ${scoreTheme.glow} pointer-events-none`}></div>

            <span className={`relative text-7xl sm:text-8xl md:text-9xl font-black tracking-tight ${scoreTheme.gradientText} select-none`}>
              {score}
            </span>
            <span className="relative text-2xl sm:text-3xl font-bold text-slate-400 ml-1.5 select-none">
              /100
            </span>
          </div>

          <div className="mt-3">
            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border shadow-xs ${scoreTheme.badge}`}>
              {scoreTheme.label}
            </span>
          </div>
        </div>

        {/* The Lists: Two Distinct Grid Columns of Modern Cards with Staggered Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Strengths Column */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3.5 px-1">
              <div className="p-1 rounded-lg bg-emerald-100 text-emerald-700">
                <CheckCircle className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800">
                Key Strengths ({keyStrengths.length})
              </h3>
            </div>

            {keyStrengths.length > 0 ? (
              <motion.div
                variants={listContainerVariants}
                initial="hidden"
                animate="show"
                className="space-y-3 flex-1"
              >
                {keyStrengths.map((strength, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    className="flex items-start gap-3.5 p-4 rounded-xl border border-emerald-200/70 bg-emerald-50/40 hover:bg-emerald-50/70 shadow-xs hover:shadow-sm transition-all"
                  >
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                    <p className="text-sm font-medium text-slate-800 leading-snug">
                      {strength}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-sm">
                No key strengths noted.
              </div>
            )}
          </div>

          {/* Missing Skills Column */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3.5 px-1">
              <div className="p-1 rounded-lg bg-rose-100 text-rose-700">
                <XCircle className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800">
                Missing Skills ({missingSkills.length})
              </h3>
            </div>

            {missingSkills.length > 0 ? (
              <motion.div
                variants={listContainerVariants}
                initial="hidden"
                animate="show"
                className="space-y-3 flex-1"
              >
                {missingSkills.map((skill, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    className="flex items-start gap-3.5 p-4 rounded-xl border border-rose-200/70 bg-rose-50/40 hover:bg-rose-50/70 shadow-xs hover:shadow-sm transition-all"
                  >
                    <XCircle className="h-5 w-5 text-rose-600 mt-0.5 shrink-0" />
                    <p className="text-sm font-medium text-slate-800 leading-snug">
                      {skill}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="p-6 rounded-xl border border-emerald-200 bg-emerald-50/40 text-center text-emerald-700 text-sm font-medium">
                🎉 No missing skills detected! Candidate matches all major criteria.
              </div>
            )}
          </div>
        </div>

        {/* Parsed Candidate Profile Overview */}
        {parsedResume && (
          <div className="pt-5 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3 px-1">
              <FileText className="h-4 w-4 text-slate-400" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Candidate Profile Overview
              </h4>
            </div>
            <div className="flex flex-wrap gap-2 items-center text-xs">
              {parsedResume.education_level && (
                <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-medium border border-slate-200/60">
                  🎓 {parsedResume.education_level}
                </span>
              )}
              {typeof parsedResume.experience_years === 'number' && (
                <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-medium border border-slate-200/60">
                  💼 {parsedResume.experience_years} years experience
                </span>
              )}
              {Array.isArray(parsedResume.skills) &&
                parsedResume.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1.5 rounded-lg font-medium shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
