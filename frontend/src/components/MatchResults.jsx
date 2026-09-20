import React from 'react';
import { CheckCircle, XCircle, Award, FileText } from 'lucide-react';

export default function MatchResults({ data }) {
  if (!data) return null;

  const analysis = data.analysis || data;
  const parsedResume = data.parsed_resume;
  const score = typeof analysis.match_score === 'number' ? analysis.match_score : 0;
  const verdict = analysis.verdict_summary || '';
  const keyStrengths = Array.isArray(analysis.key_strengths) ? analysis.key_strengths : [];
  const missingSkills = Array.isArray(analysis.missing_skills) ? analysis.missing_skills : [];

  // Color determination based on score: green if > 79, yellow if 50-79, red if < 50
  const getScoreColorClasses = (s) => {
    if (s > 79) {
      return {
        text: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        badge: 'bg-green-100 text-green-800',
        label: 'Strong Fit',
      };
    }
    if (s >= 50) {
      return {
        text: 'text-yellow-500',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        badge: 'bg-yellow-100 text-yellow-800',
        label: 'Moderate Fit',
      };
    }
    return {
      text: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      badge: 'bg-red-100 text-red-800',
      label: 'Low Fit',
    };
  };

  const scoreTheme = getScoreColorClasses(score);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mt-8">
      {/* Header Bar */}
      <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold border border-indigo-100/50">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">Match Analysis Results</h2>
            <p className="text-xs text-slate-500">AI-driven evaluation against job requirements</p>
          </div>
        </div>
        {data.job_url && (
          <a
            href={data.job_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-3 py-1.5 rounded-lg transition-colors truncate max-w-[220px]"
            title={data.job_url}
          >
            View Job Posting &rarr;
          </a>
        )}
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* Score & Verdict Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Match Score Card */}
          <div className={`flex flex-col items-center justify-center p-6 rounded-2xl border ${scoreTheme.border} ${scoreTheme.bg} transition-all`}>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Match Score
            </span>
            <div className="flex items-baseline gap-1 my-1">
              <span className={`text-6xl font-black tracking-tight ${scoreTheme.text}`}>
                {score}
              </span>
              <span className="text-xl font-bold text-slate-400">/100</span>
            </div>
            <span className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold ${scoreTheme.badge}`}>
              {scoreTheme.label}
            </span>
          </div>

          {/* Verdict Summary Card */}
          <div className="md:col-span-2 flex flex-col justify-center p-6 rounded-2xl border border-slate-100 bg-slate-50/50">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Verdict
            </h3>
            <p className="text-slate-700 text-base leading-relaxed">
              {verdict || 'No verdict summary available for this evaluation.'}
            </p>
          </div>
        </div>

        {/* Side-by-side Strengths and Missing Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Strengths */}
          <div className="rounded-2xl border border-green-100 bg-green-50/30 p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-green-100 text-green-700">
                <CheckCircle className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-800">Key Strengths</h3>
            </div>
            {keyStrengths.length > 0 ? (
              <ul className="space-y-3 flex-1">
                {keyStrengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-700 bg-white/80 border border-green-100/60 p-3 rounded-xl shadow-xs">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="leading-snug">{strength}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400 italic">No key strengths noted.</p>
            )}
          </div>

          {/* Missing Skills */}
          <div className="rounded-2xl border border-red-100 bg-red-50/30 p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-red-100 text-red-700">
                <XCircle className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-800">Missing Skills</h3>
            </div>
            {missingSkills.length > 0 ? (
              <ul className="space-y-3 flex-1">
                {missingSkills.map((skill, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-700 bg-white/80 border border-red-100/60 p-3 rounded-xl shadow-xs">
                    <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <span className="leading-snug">{skill}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-green-600 font-medium">No missing skills! Candidate matches all key requirements.</p>
            )}
          </div>
        </div>

        {/* Parsed Resume Details (if provided) */}
        {parsedResume && (
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-slate-400" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Parsed Candidate Profile
              </h4>
            </div>
            <div className="flex flex-wrap gap-2 items-center text-xs">
              {parsedResume.education_level && (
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-medium">
                  🎓 {parsedResume.education_level}
                </span>
              )}
              {typeof parsedResume.experience_years === 'number' && (
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-medium">
                  💼 {parsedResume.experience_years} years experience
                </span>
              )}
              {Array.isArray(parsedResume.skills) && parsedResume.skills.map((skill, i) => (
                <span key={i} className="bg-indigo-50 text-indigo-700 border border-indigo-100/60 px-2.5 py-1 rounded-lg font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
