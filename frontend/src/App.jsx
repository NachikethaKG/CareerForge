import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import JobForm from './components/JobForm';
import MatchResults from './components/MatchResults';
import { evaluateJobMatch } from './api';
import { Sparkles, AlertCircle, Loader2, Search } from 'lucide-react';

function App() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = async (dataOrResumeText, maybeJobUrl) => {
    const resumeText =
      typeof dataOrResumeText === 'object' && dataOrResumeText !== null
        ? dataOrResumeText.resumeText
        : dataOrResumeText;
    const jobUrl =
      typeof dataOrResumeText === 'object' && dataOrResumeText !== null
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/70 to-slate-100 text-slate-900 flex flex-col font-sans antialiased">
      {/* Sleek Top Navigation Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-slate-900">CareerForge AI</span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Intelligent Resume Matching</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              AI Agent Active
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Split-Pane Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12 items-start">
          {/* Left Column: JobForm */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full"
          >
            <JobForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </motion.div>

          {/* Right Column: Loading, Error, Results, or Placeholder */}
          <div className="w-full [&>*]:mt-0">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-12 flex flex-col items-center justify-center text-center min-h-[440px]"
                >
                  <div className="h-16 w-16 rounded-2xl bg-indigo-50 border border-indigo-100/60 text-indigo-600 flex items-center justify-center mb-5 shadow-inner">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1.5">
                    Analyzing Match...
                  </h3>
                  <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                    Our AI is scraping the target job description, parsing your resume credentials, and evaluating semantic fit.
                  </p>
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-red-50 border border-red-200 text-red-900 rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-start gap-3.5">
                    <AlertCircle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-red-950">
                        Evaluation Failed
                      </h3>
                      <p className="text-sm mt-1.5 text-red-700 leading-relaxed">
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
                </motion.div>
              ) : results ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                >
                  <MatchResults data={results} />
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[440px] shadow-xs"
                >
                  <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                    <Search className="h-7 w-7" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1.5">
                    Enter details to see your match
                  </h3>
                  <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                    Paste your resume text and target job posting URL on the left, then click &quot;Analyze Match&quot; to view compatibility scores and tailored insights.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
