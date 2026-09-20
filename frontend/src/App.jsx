import React, { useState } from 'react';
import JobForm from './components/JobForm';
import MatchResults from './components/MatchResults';
import { evaluateJobMatch } from './api';
import { Sparkles, AlertCircle, Loader2, Search } from 'lucide-react';

function App() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = async (dataOrResumeText, maybeJobUrl) => {
    const resumeText = typeof dataOrResumeText === 'object' && dataOrResumeText !== null
      ? dataOrResumeText.resumeText
      : dataOrResumeText;
    const jobUrl = typeof dataOrResumeText === 'object' && dataOrResumeText !== null
      ? dataOrResumeText.jobUrl
      : maybeJobUrl;

    setIsLoading(true);
    setError('');
    setResults(null);

    try {
      const data = await evaluateJobMatch(resumeText, jobUrl);
      setResults(data);
    } catch (err) {
      console.error('Job evaluation error:', err);
      const message =
        err.response?.data?.detail ||
        err.message ||
        'An error occurred while evaluating the match. Please verify the backend is running and try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900">CareerForge</span>
              <span className="text-xs ml-2 px-2 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                AI Matcher
              </span>
            </div>
          </div>
          <p className="hidden sm:block text-xs font-medium text-slate-500">
            Intelligent Resume &amp; Job Description Fit Analyzer
          </p>
        </div>
      </header>

      {/* Main Split-Pane Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Column: JobForm */}
          <div className="w-full">
            <JobForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>

          {/* Right Column: Loading, Error, Results, or Placeholder */}
          <div className="w-full [&>*]:mt-0">
            {isLoading ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-12 flex flex-col items-center justify-center text-center min-h-[420px]">
                <div className="h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 shadow-inner">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">
                  Analyzing Match...
                </h3>
                <p className="text-sm text-slate-500 max-w-sm">
                  Please wait while our AI scrapes the job description, analyzes your resume, and calculates compatibility metrics.
                </p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-900 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-3.5">
                  <AlertCircle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-red-950">
                      Evaluation Error
                    </h3>
                    <p className="text-sm mt-1 text-red-700 leading-relaxed">
                      {error}
                    </p>
                    <button
                      type="button"
                      onClick={() => setError('')}
                      className="mt-3 text-xs font-semibold text-red-800 hover:text-red-950 underline underline-offset-2 cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ) : results ? (
              <MatchResults data={results} />
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[420px] shadow-xs">
                <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                  <Search className="h-7 w-7" />
                </div>
                <h3 className="text-base font-semibold text-slate-800 mb-1">
                  Enter details to see your match
                </h3>
                <p className="text-sm text-slate-500 max-w-sm">
                  Paste your resume text and target job posting URL on the left, then click &quot;Analyze Match&quot; to view detailed fit scores and insights.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
