import React, { useState } from 'react';
import { FileText, Link2, Sparkles, Loader2 } from 'lucide-react';

export default function JobForm({ onSubmit, isLoading = false }) {
  const [resumeText, setResumeText] = useState('');
  const [jobUrl, setJobUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!resumeText.trim() || !jobUrl.trim() || isLoading) return;

    if (onSubmit) {
      if (onSubmit.length === 2) {
        onSubmit(resumeText, jobUrl);
      } else {
        onSubmit({ resumeText, jobUrl });
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold shadow-sm border border-indigo-100/50">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">Job Fit Evaluation</h2>
            <p className="text-xs text-slate-500">Analyze how well your resume matches the job description</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        {/* Job URL Input */}
        <div>
          <label htmlFor="jobUrl" className="text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
            <Link2 className="h-4 w-4 text-slate-400" />
            Job URL
          </label>
          <div className="relative rounded-xl shadow-sm">
            <input
              id="jobUrl"
              name="jobUrl"
              type="url"
              required
              disabled={isLoading}
              placeholder="https://linkedin.com/jobs/view/... or company career page"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors disabled:bg-slate-50 disabled:text-slate-500"
            />
          </div>
        </div>

        {/* Resume Text Textarea */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="resumeText" className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-400" />
              Resume Text
            </label>
            <span className="text-xs text-slate-400">
              {resumeText.length > 0 ? `${resumeText.length} characters` : 'Paste raw text'}
            </span>
          </div>
          <div className="relative rounded-xl shadow-sm">
            <textarea
              id="resumeText"
              name="resumeText"
              required
              disabled={isLoading}
              placeholder="Paste your full resume here (work experience, skills, achievements, education)..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 p-4 text-slate-900 placeholder-slate-400 text-sm font-mono leading-relaxed focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors disabled:bg-slate-50 disabled:text-slate-500 min-h-[300px] resize-y"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !resumeText.trim() || !jobUrl.trim()}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Analyzing Match...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-indigo-200" />
                <span>Analyze Match</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
