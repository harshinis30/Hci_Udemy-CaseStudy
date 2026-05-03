import { useState } from 'react';
import { Search, TrendingUp, Grid, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface NoResultsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onBrowseCategories: () => void;
  onViewTrending: () => void;
}

export function NoResults({
  searchQuery,
  onSearchChange,
  onBrowseCategories,
  onViewTrending,
}: NoResultsProps) {
  const [hoveredSuggestion, setHoveredSuggestion] = useState<string | null>(null);

  const popularSearches = [
    'Python',
    'Web Development',
    'Machine Learning',
    'React',
    'JavaScript',
    'Data Science',
    'UI/UX Design',
    'Digital Marketing',
  ];

  // Simple "did you mean" logic
  const getDidYouMean = (query: string): string | null => {
    const corrections: Record<string, string> = {
      'pyton': 'Python',
      'pythom': 'Python',
      'javascrpt': 'JavaScript',
      'javasript': 'JavaScript',
      'recat': 'React',
      'reat': 'React',
      'machne': 'Machine',
      'learing': 'Learning',
      'desing': 'Design',
      'developement': 'Development',
      'programing': 'Programming',
      'blog': 'Vlog',
    };

    const lowerQuery = query.toLowerCase();
    for (const [typo, correct] of Object.entries(corrections)) {
      if (lowerQuery.includes(typo)) {
        return correct;
      }
    }
    return null;
  };

  const didYouMean = getDidYouMean(searchQuery);

  return (
    <div className="min-h-[600px] flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="mx-auto w-64 h-64 relative"
          >
            {/* Search Icon Illustration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-40 h-40 bg-purple-100 rounded-full flex items-center justify-center">
                  <Search className="w-20 h-20 text-purple-400" strokeWidth={1.5} />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center"
                >
                  <span className="text-3xl">😕</span>
                </motion.div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{
                x: [-10, 10, -10],
                y: [0, -15, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute top-10 left-4 w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center opacity-60"
            >
              <Sparkles className="w-8 h-8 text-blue-400" />
            </motion.div>

            <motion.div
              animate={{
                x: [10, -10, 10],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
              className="absolute top-16 right-8 w-12 h-12 bg-pink-100 rounded-full opacity-60"
            >
            </motion.div>

            <motion.div
              animate={{
                x: [-15, 15, -15],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
              className="absolute bottom-8 left-12 w-14 h-14 bg-green-100 rounded-2xl opacity-60"
            >
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Main Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            We couldn't find anything for "{searchQuery}" 😕
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Try adjusting your search or explore popular topics below
          </p>
        </motion.div>

        {/* Did You Mean */}
        {didYouMean && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-4"
          >
            <p className="text-gray-700">
              Did you mean:{' '}
              <button
                onClick={() => onSearchChange(didYouMean)}
                className="font-bold text-blue-600 hover:text-blue-700 underline"
              >
                {didYouMean}
              </button>
              ?
            </p>
          </motion.div>
        )}

        {/* Recovery Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          {/* Primary CTA */}
          <button
            onClick={onBrowseCategories}
            className="px-8 py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
          >
            <Grid className="w-6 h-6" />
            Browse Categories
          </button>

          {/* Secondary Actions */}
          <button
            onClick={onViewTrending}
            className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold text-lg hover:border-purple-600 hover:text-purple-600 hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-6 h-6" />
            View Trending
          </button>

          <button
            onClick={() => onSearchChange('')}
            className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold text-lg hover:border-purple-600 hover:text-purple-600 hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-6 h-6" />
            Try Another Search
          </button>
        </motion.div>

        {/* Popular Searches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border-2 border-purple-100"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Popular Searches</h2>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {popularSearches.map((search, index) => {
              const isHovered = hoveredSuggestion === search;
              return (
                <motion.button
                  key={search}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSearchChange(search)}
                  onMouseEnter={() => setHoveredSuggestion(search)}
                  onMouseLeave={() => setHoveredSuggestion(null)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    isHovered
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300'
                  }`}
                >
                  {search}
                  {isHovered && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ml-2 inline-block"
                    >
                      <ArrowRight className="w-4 h-4 inline" />
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>

          <p className="text-sm text-gray-600 mt-6">
            Click any topic to search for related courses
          </p>
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 text-gray-500"
        >
          <p className="text-sm">
            Need help finding something specific?{' '}
            <a href="/help" className="text-purple-600 font-semibold hover:text-purple-700 underline">
              Contact Support
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
