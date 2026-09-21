import { useState } from 'react';
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
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden">
      {/* Card Header */}
      <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-4.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-50 to-indigo-50 border border-blue-100 text-blue-600 flex items-center justify-center font-semibold shadow-xs">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">Job Fit Evaluation</h2>
            <p className="text-xs text-slate-500">Analyze how well your resume matches the target job description</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        {/* Job URL Input */}
        <div>
          <label htmlFor="jobUrl" className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <Link2 className="h-4 w-4 text-slate-400" />
            Job URL
          </label>
          <div className="relative rounded-xl shadow-xs">
            <input
              id="jobUrl"
              name="jobUrl"
              type="url"
              required
              disabled={isLoading}
              placeholder="https://linkedin.com/jobs/view/... or company career page"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-slate-50/40 px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>
        </div>

        {/* Resume Text Textarea */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="resumeText" className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-400" />
              Resume Text
            </label>
            <span className="text-xs font-medium text-slate-400">
              {resumeText.length > 0 ? `${resumeText.length} characters` : 'Paste raw text'}
            </span>
          </div>
          <div className="relative rounded-xl shadow-xs">
            <textarea
              id="resumeText"
              name="resumeText"
              required
              disabled={isLoading}
              placeholder="Paste your complete resume here (work experience, technical skills, key achievements, education)..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-slate-50/40 p-4 text-slate-900 placeholder-slate-400 text-sm font-mono leading-relaxed focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-400 min-h-[300px] resize-y"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !resumeText.trim() || !jobUrl.trim()}
            className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-white" />
                <span>Analyzing Match...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 text-blue-100" />
                <span>Analyze Match</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
