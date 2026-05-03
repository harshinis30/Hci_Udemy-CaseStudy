import { useState } from 'react';
import { ArrowLeft, Search, ChevronDown, Star, Clock, BarChart3, X, SlidersHorizontal } from 'lucide-react';
import { NoResults } from './NoResults';
import { motion, AnimatePresence } from 'motion/react';

interface SearchResultsProps {
  onBack: () => void;
  initialQuery?: string;
  onAddToCart?: (course: any) => void;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  rating: number;
  ratingCount: number;
  price: number;
  originalPrice?: number;
  image: string;
  duration: string;
  level: string;
  category: string;
  description: string;
}

interface Filters {
  categories: string[];
  priceRange: [number, number];
  minRating: number;
  durations: string[];
  levels: string[];
}

export function SearchResults({ onBack, initialQuery = '', onAddToCart }: SearchResultsProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeSearch, setActiveSearch] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<'relevant' | 'rating' | 'newest'>('relevant');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>({
    categories: [],
    priceRange: [0, 200],
    minRating: 0,
    durations: [],
    levels: [],
  });

  // Mock course data (expanded)
  const allCourses: Course[] = [
    {
      id: '1',
      title: 'Human-Computer Interaction: Design Principles',
      instructor: 'Dr. Sarah Mitchell',
      rating: 4.8,
      ratingCount: 12450,
      price: 84.99,
      originalPrice: 129.99,
      image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=300&fit=crop',
      duration: '12 hours',
      level: 'Intermediate',
      category: 'Design',
      description: 'Master HCI principles with hands-on projects and real-world applications.',
    },
    {
      id: '2',
      title: 'UX Design Fundamentals: HCI & Psychology',
      instructor: 'James Anderson',
      rating: 4.7,
      ratingCount: 8930,
      price: 79.99,
      originalPrice: 119.99,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
      duration: '8 hours',
      level: 'Beginner',
      category: 'Design',
      description: 'Learn UX fundamentals grounded in human psychology and interaction design.',
    },
    {
      id: '3',
      title: 'Advanced HCI: Usability Testing & Research',
      instructor: 'Prof. Emily Chen',
      rating: 4.9,
      ratingCount: 5620,
      price: 94.99,
      originalPrice: 149.99,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
      duration: '15 hours',
      level: 'Advanced',
      category: 'Research',
      description: 'Conduct professional usability studies and apply research methodologies.',
    },
    {
      id: '4',
      title: 'Mobile HCI: Designing for Touch Interfaces',
      instructor: 'Michael Torres',
      rating: 4.6,
      ratingCount: 7340,
      price: 74.99,
      originalPrice: 109.99,
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
      duration: '10 hours',
      level: 'Intermediate',
      category: 'Mobile',
      description: 'Design exceptional mobile experiences with touch-first HCI principles.',
    },
    {
      id: '5',
      title: 'HCI for Accessibility: Inclusive Design',
      instructor: 'Dr. Rachel Kim',
      rating: 4.9,
      ratingCount: 4210,
      price: 89.99,
      originalPrice: 134.99,
      image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop',
      duration: '11 hours',
      level: 'Intermediate',
      category: 'Accessibility',
      description: 'Create accessible interfaces that work for everyone, following WCAG standards.',
    },
    {
      id: '6',
      title: 'HCI Prototyping: From Sketch to Interactive',
      instructor: 'Alex Rivera',
      rating: 4.7,
      ratingCount: 9120,
      price: 69.99,
      originalPrice: 99.99,
      image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400&h=300&fit=crop',
      duration: '9 hours',
      level: 'Beginner',
      category: 'Design',
      description: 'Build interactive prototypes using modern HCI tools and techniques.',
    },
  ];

  const categories = ['Design', 'Research', 'Mobile', 'Accessibility', 'Development'];
  const durations = ['0-5 hours', '5-10 hours', '10-15 hours', '15+ hours'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  // Apply filters
  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = activeSearch
      ? course.title.toLowerCase().includes(activeSearch.toLowerCase()) ||
        course.instructor.toLowerCase().includes(activeSearch.toLowerCase()) ||
        course.category.toLowerCase().includes(activeSearch.toLowerCase())
      : true;

    const matchesCategory = filters.categories.length === 0 || filters.categories.includes(course.category);
    const matchesPrice = course.price >= filters.priceRange[0] && course.price <= filters.priceRange[1];
    const matchesRating = course.rating >= filters.minRating;
    const matchesLevel = filters.levels.length === 0 || filters.levels.includes(course.level);

    const courseDurationHours = parseInt(course.duration);
    let matchesDuration = filters.durations.length === 0;
    if (filters.durations.includes('0-5 hours') && courseDurationHours <= 5) matchesDuration = true;
    if (filters.durations.includes('5-10 hours') && courseDurationHours > 5 && courseDurationHours <= 10) matchesDuration = true;
    if (filters.durations.includes('10-15 hours') && courseDurationHours > 10 && courseDurationHours <= 15) matchesDuration = true;
    if (filters.durations.includes('15+ hours') && courseDurationHours > 15) matchesDuration = true;

    return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesDuration && matchesLevel;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return b.id.localeCompare(a.id);
    return 0;
  });

  const hasResults = sortedCourses.length > 0;

  const handleSearch = () => {
    setActiveSearch(searchQuery);
  };

  const toggleFilter = (type: keyof Filters, value: any) => {
    setFilters(prev => {
      if (type === 'categories' || type === 'durations' || type === 'levels') {
        const currentArray = prev[type] as string[];
        return {
          ...prev,
          [type]: currentArray.includes(value)
            ? currentArray.filter(v => v !== value)
            : [...currentArray, value],
        };
      }
      return prev;
    });
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 200],
      minRating: 0,
      durations: [],
      levels: [],
    });
  };

  const getActiveFilterCount = () => {
    return (
      filters.categories.length +
      filters.durations.length +
      filters.levels.length +
      (filters.minRating > 0 ? 1 : 0) +
      (filters.priceRange[0] > 0 || filters.priceRange[1] < 200 ? 1 : 0)
    );
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search for courses..."
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-8 py-3.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <aside className="w-72 flex-shrink-0">
            <div className="sticky top-28 bg-white rounded-2xl border-2 border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="px-2 py-0.5 bg-purple-600 text-white text-sm rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category)}
                        onChange={() => toggleFilter('categories', category)}
                        className="w-5 h-5 rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
                      />
                      <span className="text-gray-700 group-hover:text-purple-600 transition-colors">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={filters.priceRange[0]}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [parseInt(e.target.value) || 0, prev.priceRange[1]] }))}
                      className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                      min="0"
                    />
                    <span className="text-gray-600">to</span>
                    <input
                      type="number"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], parseInt(e.target.value) || 200] }))}
                      className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                      max="200"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3">Minimum Rating</h3>
                <div className="space-y-2">
                  {[4.5, 4.0, 3.5, 3.0].map(rating => (
                    <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.minRating === rating}
                        onChange={() => setFilters(prev => ({ ...prev, minRating: rating }))}
                        className="w-5 h-5 border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
                      />
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-gray-700 group-hover:text-purple-600 transition-colors">
                          {rating}+ ({rating === 4.5 ? 'Excellent' : rating === 4.0 ? 'Very Good' : rating === 3.5 ? 'Good' : 'Average'})
                        </span>
                      </div>
                    </label>
                  ))}
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.minRating === 0}
                      onChange={() => setFilters(prev => ({ ...prev, minRating: 0 }))}
                      className="w-5 h-5 border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-gray-700 group-hover:text-purple-600 transition-colors">All ratings</span>
                  </label>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3">Duration</h3>
                <div className="space-y-2">
                  {durations.map(duration => (
                    <label key={duration} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.durations.includes(duration)}
                        onChange={() => toggleFilter('durations', duration)}
                        className="w-5 h-5 rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
                      />
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 group-hover:text-purple-600 transition-colors">
                          {duration}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">Level</h3>
                <div className="space-y-2">
                  {levels.map(level => (
                    <label key={level} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.levels.includes(level)}
                        onChange={() => toggleFilter('levels', level)}
                        className="w-5 h-5 rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
                      />
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 group-hover:text-purple-600 transition-colors">
                          {level}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {hasResults ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-lg text-gray-900">
                      Showing <span className="font-bold">{sortedCourses.length}</span> results
                      {activeSearch && (
                        <>
                          {' '}for "<span className="font-bold text-purple-600">{activeSearch}</span>"
                        </>
                      )}
                    </p>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-300 rounded-lg hover:border-purple-500 transition-colors font-semibold text-gray-700"
                    >
                      Sort by:{' '}
                      {sortBy === 'relevant' && 'Most Relevant'}
                      {sortBy === 'rating' && 'Highest Rated'}
                      {sortBy === 'newest' && 'Newest'}
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    <AnimatePresence>
                      {sortDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border-2 border-gray-200 overflow-hidden z-10"
                        >
                          {(['relevant', 'rating', 'newest'] as const).map(option => (
                            <button
                              key={option}
                              onClick={() => {
                                setSortBy(option);
                                setSortDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-3 transition-colors ${
                                sortBy === option
                                  ? 'bg-purple-50 text-purple-600 font-bold'
                                  : 'hover:bg-gray-50 text-gray-700'
                              }`}
                            >
                              {option === 'relevant' && 'Most Relevant'}
                              {option === 'rating' && 'Highest Rated'}
                              {option === 'newest' && 'Newest'}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {filters.categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => toggleFilter('categories', cat)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full font-semibold text-sm hover:bg-purple-200 transition-colors"
                      >
                        Category: {cat}
                        <X className="w-4 h-4" />
                      </button>
                    ))}
                    {filters.minRating > 0 && (
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, minRating: 0 }))}
                        className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full font-semibold text-sm hover:bg-purple-200 transition-colors"
                      >
                        Rating: {filters.minRating}+
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    {filters.levels.map(level => (
                      <button
                        key={level}
                        onClick={() => toggleFilter('levels', level)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full font-semibold text-sm hover:bg-purple-200 transition-colors"
                      >
                        Level: {level}
                        <X className="w-4 h-4" />
                      </button>
                    ))}
                    {filters.durations.map(duration => (
                      <button
                        key={duration}
                        onClick={() => toggleFilter('durations', duration)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full font-semibold text-sm hover:bg-purple-200 transition-colors"
                      >
                        Duration: {duration}
                        <X className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sortedCourses.map((course) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -8 }}
                      onHoverStart={() => setHoveredCourse(course.id)}
                      onHoverEnd={() => setHoveredCourse(null)}
                      className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:shadow-2xl hover:border-purple-300 transition-all cursor-pointer"
                    >
                      <div className="relative">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-48 object-cover"
                        />
                        {course.originalPrice && (
                          <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white rounded-full font-bold text-sm">
                            {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                          </div>
                        )}

                        <AnimatePresence>
                          {hoveredCourse === course.id && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-black/60 flex items-center justify-center"
                            >
                              <button className="px-6 py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-colors">
                                Preview Course
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="p-5">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">{course.instructor}</p>

                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-gray-900">{course.rating}</span>
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          </div>
                          <span className="text-sm text-gray-500">({course.ratingCount.toLocaleString()})</span>
                        </div>

                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <BarChart3 className="w-4 h-4" />
                            {course.level}
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                          <div>
                            <span className="text-2xl font-bold text-gray-900">${course.price}</span>
                            {course.originalPrice && (
                              <span className="ml-2 text-sm text-gray-500 line-through">
                                ${course.originalPrice}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => onAddToCart?.(course)}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-12 flex justify-center">
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:border-purple-500 transition-colors">
                      Previous
                    </button>
                    {[1, 2, 3, 4, 5].map(page => (
                      <button
                        key={page}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                          page === 1
                            ? 'bg-purple-600 text-white'
                            : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-purple-500'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:border-purple-500 transition-colors">
                      Next
                    </button>
                  </div>
                </div>
              </>
            ) : activeSearch ? (
              <NoResults
                searchQuery={activeSearch}
                onSearchChange={(query) => {
                  setSearchQuery(query);
                  setActiveSearch(query);
                }}
                onBrowseCategories={() => console.log('Browse categories')}
                onViewTrending={() => console.log('View trending')}
              />
            ) : (
              <div className="text-center py-20">
                <Search className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500">Enter a search term to get started</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
