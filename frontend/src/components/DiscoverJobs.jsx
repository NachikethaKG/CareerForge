import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Search,
  FileText,
  ExternalLink,
  Loader2,
  AlertCircle,
  Building2,
  Sparkles,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { discoverJobs } from '../api';

export default function DiscoverJobs({ initialResumeText = '', onResumeTextChange }) {
  const [resumeText, setResumeText] = useState(initialResumeText);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [skip, setSkip] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleResumeChange = (val) => {
    setResumeText(val);
    if (onResumeTextChange) {
      onResumeTextChange(val);
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim() || !resumeText.trim() || isLoading) return;

    setIsLoading(true);
    setError('');
    setHasSearched(true);
    setSkip(0);
    setHasMore(true);

    try {
      const results = await discoverJobs(resumeText, searchTerm, 0, 5);
      setJobs(results || []);
      if (!results || results.length < 5) {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Discover jobs error:', err);
      const message =
        err.response?.data?.detail ||
        err.message ||
        'Failed to discover jobs. Please ensure the backend is running and try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    const nextSkip = skip + 5;
    setIsLoadingMore(true);
    setError('');

    try {
      const nextBatch = await discoverJobs(resumeText, searchTerm, nextSkip, 5);
      if (!nextBatch || nextBatch.length === 0) {
        setHasMore(false);
      } else {
        setJobs((prev) => [...prev, ...nextBatch]);
        setSkip(nextSkip);
        if (nextBatch.length < 5) {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error('Load more jobs error:', err);
      const message =
        err.response?.data?.detail ||
        err.message ||
        'Failed to load more jobs. Please try again.';
      setError(message);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const getScoreBadge = (score) => {
    const val = typeof score === 'number' ? score : 0;
    if (val >= 10) {
      return {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/20',
        text: 'text-emerald-700',
        label: 'High Relevance',
      };
    }
    if (val >= 4) {
      return {
        badge: 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-1 ring-indigo-500/20',
        text: 'text-indigo-700',
        label: 'Moderate Match',
      };
    }
    return {
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      text: 'text-slate-600',
      label: 'Relevant',
    };
  };

  return (
    <div className="w-full space-y-8">
      {/* Search Configuration Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white flex items-center justify-center font-semibold shadow-md shadow-indigo-500/20">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">Job Discovery Engine</h2>
              <p className="text-xs text-slate-500">
                Headless search on startup boards scored locally via TF-IDF cosine similarity
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            Local NLP
          </span>
        </div>

        <form onSubmit={handleSearch} className="p-6 md:p-8 space-y-6">
          {/* Search Term Input */}
          <div>
            <label htmlFor="searchTerm" className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <Search className="h-4 w-4 text-slate-400" />
              Target Role or Search Term
            </label>
            <div className="relative rounded-xl shadow-xs">
              <input
                id="searchTerm"
                type="text"
                required
                disabled={isLoading}
                placeholder="e.g. Python Developer, Full Stack Engineer, React, Data Scientist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50/40 px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>
          </div>

          {/* Resume Text Area */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="discoveryResumeText" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-400" />
                Candidate Resume Text
              </label>
              <span className="text-xs font-medium text-slate-400">
                {resumeText.length > 0 ? `${resumeText.length} characters` : 'Paste raw resume'}
              </span>
            </div>
            <div className="relative rounded-xl shadow-xs">
              <textarea
                id="discoveryResumeText"
                required
                disabled={isLoading}
                rows={5}
                placeholder="Paste candidate resume text or skill set here for local TF-IDF semantic comparison..."
                value={resumeText}
                onChange={(e) => handleResumeChange(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50/40 p-4 text-slate-900 placeholder-slate-400 text-sm font-mono leading-relaxed focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-400 resize-y"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !searchTerm.trim() || !resumeText.trim()}
              className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                  <span>Discovering & Scoring Jobs...</span>
                </>
              ) : (
                <>
                  <Compass className="h-5 w-5 text-indigo-200" />
                  <span>Discover Matching Jobs</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-900 rounded-2xl p-5 shadow-sm flex items-start gap-3.5"
        >
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-sm text-red-950">Discovery Request Failed</h4>
            <p className="text-sm mt-1 text-red-700 leading-relaxed">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Results Section */}
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[300px]"
        >
          <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-1">
            Running Headless Job Search
          </h3>
          <p className="text-sm text-slate-500 max-w-md">
            Querying startup job boards and calculating TF-IDF cosine similarity against your credentials...
          </p>
        </motion.div>
      ) : hasSearched && jobs.length === 0 && !error ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center shadow-xs"
        >
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 mb-1">No Jobs Found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            No matching postings found for &quot;{searchTerm}&quot;. Try adjusting your search query.
          </p>
        </motion.div>
      ) : jobs.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span>Discovered Opportunities</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                {jobs.length} loaded
              </span>
            </h3>
            <span className="text-xs text-slate-500">Sorted by TF-IDF Match Score</span>
          </div>

          {/* Cards Grid */}
          <div className="space-y-4">
            <AnimatePresence>
              {jobs.map((job, idx) => {
                const badge = getScoreBadge(job.match_score);
                return (
                  <motion.div
                    key={`${job.url}-${idx}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: (idx % 5) * 0.05 }}
                    className="bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* Left: Job Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {job.company && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                              <Building2 className="h-3.5 w-3.5 text-slate-500" />
                              {job.company}
                            </span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border ${badge.badge}`}>
                            <Sparkles className="h-3.5 w-3.5" />
                            {job.match_score !== undefined ? `${job.match_score}% Match` : 'Scored'}
                          </span>
                        </div>

                        <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 hover:underline"
                          >
                            <span>{job.title}</span>
                            <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 text-indigo-500 transition-opacity" />
                          </a>
                        </h4>

                        {/* Description Snippet */}
                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                          {job.snippet || job.description || 'No snippet available.'}
                        </p>
                      </div>

                      {/* Right: Action Button */}
                      <div className="sm:self-center shrink-0">
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-colors w-full sm:w-auto"
                        >
                          <span>View Role</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                    <span>Loading next 5 jobs...</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                    <span>Load More Opportunities</span>
                  </>
                )}
              </button>
            </div>
          )}

          {!hasMore && jobs.length >= 5 && (
            <div className="text-center py-4">
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200/60">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                All available opportunities loaded
              </span>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
