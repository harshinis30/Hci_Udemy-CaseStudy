import { useState, useRef, useEffect } from 'react';
import { Bell, Search, ChevronDown, Play, Clock, BookOpen, TrendingUp, Filter, X, ChevronLeft, ChevronRight, Star, Users, Eye, UserCircle, Edit, Heart, ShoppingCart, Settings, CreditCard, MessageCircle, HelpCircle, LifeBuoy, LogOut, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardProps {
  userName: string;
  onCourseClick: (courseId: string) => void;
  onHelpClick?: () => void;
}

export function Dashboard({ userName, onCourseClick, onHelpClick }: DashboardProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [topPicksExpanded, setTopPicksExpanded] = useState(false);
  const [trendingExpanded, setTrendingExpanded] = useState(false);
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
  const [hoveredMenuItem, setHoveredMenuItem] = useState<string | null>(null);

  const topPicksScrollRef = useRef<HTMLDivElement>(null);
  const trendingScrollRef = useRef<HTMLDivElement>(null);

  const hasActiveCourses = true; // Toggle this to test empty state

  const continueLearningCourse = {
    id: '1',
    title: 'The Complete Python Bootcamp From Zero to Hero',
    instructor: 'Jose Portilla',
    progress: 65,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop',
    lastWatched: '2 hours ago',
    duration: '22h 30m',
  };

  const topPicksCourses = [
    {
      id: '2',
      title: 'Machine Learning A-Z: AI, Python & R',
      instructor: 'Kirill Eremenko',
      rating: 4.5,
      students: '750K',
      price: '$89.99',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
      level: 'Intermediate',
      description: 'Master ML algorithms with hands-on Python & R projects',
    },
    {
      id: '3',
      title: 'React - The Complete Guide 2024',
      instructor: 'Maximilian Schwarzmüller',
      rating: 4.6,
      students: '500K',
      price: '$84.99',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
      level: 'Beginner',
      description: 'Build modern React apps with hooks, Redux & Next.js',
    },
    {
      id: '4',
      title: 'Web Development Masterclass',
      instructor: 'Colt Steele',
      rating: 4.7,
      students: '1M',
      price: '$79.99',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
      level: 'Beginner',
      description: 'Full-stack web development from scratch to deployment',
    },
    {
      id: '5',
      title: 'Advanced JavaScript Concepts',
      instructor: 'Andrei Neagoie',
      rating: 4.8,
      students: '350K',
      price: '$94.99',
      thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=300&fit=crop',
      level: 'Advanced',
      description: 'Deep dive into closures, prototypes, async JS & more',
    },
    {
      id: '9',
      title: 'Node.js API Development',
      instructor: 'Andrew Mead',
      rating: 4.6,
      students: '400K',
      price: '$84.99',
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop',
      level: 'Intermediate',
      description: 'Build scalable REST APIs with Node.js & Express',
    },
    {
      id: '10',
      title: 'TypeScript Complete Course',
      instructor: 'Stephen Grider',
      rating: 4.7,
      students: '320K',
      price: '$89.99',
      thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop',
      level: 'Intermediate',
      description: 'Master TypeScript for robust JavaScript development',
    },
  ];

  const trendingCourses = [
    {
      id: '6',
      title: 'ChatGPT & AI: The Complete Guide',
      instructor: 'John Smith',
      rating: 4.9,
      students: '200K',
      price: '$99.99',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
      badge: '🔥 Trending',
      description: 'Master AI tools and ChatGPT for productivity',
    },
    {
      id: '7',
      title: 'Data Science Bootcamp',
      instructor: 'Angela Yu',
      rating: 4.6,
      students: '600K',
      price: '$89.99',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      badge: '⭐ Bestseller',
      description: 'Complete data science with Python, ML & visualization',
    },
    {
      id: '8',
      title: 'UI/UX Design Fundamentals',
      instructor: 'Daniel Schifano',
      rating: 4.7,
      students: '400K',
      price: '$79.99',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
      badge: '🆕 New',
      description: 'Learn design thinking and create stunning interfaces',
    },
    {
      id: '11',
      title: 'AWS Certified Solutions Architect',
      instructor: 'Stephane Maarek',
      rating: 4.8,
      students: '550K',
      price: '$94.99',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
      badge: '🔥 Trending',
      description: 'Pass AWS certification with hands-on practice',
    },
    {
      id: '12',
      title: 'Blockchain & Cryptocurrency',
      instructor: 'Tim Buchalka',
      rating: 4.5,
      students: '280K',
      price: '$89.99',
      thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop',
      badge: '🆕 New',
      description: 'Understand blockchain technology and crypto trading',
    },
  ];

  const notifications = [
    { id: 1, text: 'New course recommendation: Advanced React Patterns', time: '2h ago', unread: true },
    { id: 2, text: 'You earned a certificate for Python Bootcamp', time: '1d ago', unread: true },
    { id: 3, text: 'Special offer: 50% off on AI courses', time: '2d ago', unread: false },
  ];

  const recentSearches = ['Python', 'Web Development', 'Machine Learning'];

  const categories = ['All Categories', 'Development', 'Business', 'Design', 'Marketing'];
  const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 400;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // ESC key to close dropdowns
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProfileOpen(false);
        setNotificationsOpen(false);
        setFilterOpen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const profileMenuItems: Array<{
    title: string;
    items: Array<{
      icon: React.ReactNode;
      label: string;
      href: string;
      highlight?: boolean;
      badge?: string;
      tooltip?: string;
      onClick?: () => void;
    }>;
  }> = [
    {
      title: 'Profile',
      items: [
        { icon: <UserCircle className="w-5 h-5" />, label: 'View Profile', href: '/profile' },
        { icon: <Edit className="w-5 h-5" />, label: 'Edit Profile', href: '/profile/edit' },
      ],
    },
    {
      title: 'Learning',
      items: [
        { icon: <BookOpen className="w-5 h-5" />, label: 'My Learning', href: '/my-learning', highlight: true },
        { icon: <Heart className="w-5 h-5" />, label: 'Wishlist', href: '/wishlist', badge: '3' },
        { icon: <ShoppingCart className="w-5 h-5" />, label: 'Cart', href: '/cart' },
      ],
    },
    {
      title: 'Account',
      items: [
        { icon: <Settings className="w-5 h-5" />, label: 'Settings', href: '/settings' },
        { icon: <CreditCard className="w-5 h-5" />, label: 'Payment Methods', href: '/payment' },
        { icon: <Bell className="w-5 h-5" />, label: 'Subscriptions', href: '/subscriptions' },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: <HelpCircle className="w-5 h-5" />,
          label: 'Help & Support',
          href: '/help',
          tooltip: 'Need help? Get instant answers or contact support',
          onClick: () => onHelpClick?.()
        },
        { icon: <MessageCircle className="w-5 h-5" />, label: 'FAQs', href: '/faq' },
        { icon: <LifeBuoy className="w-5 h-5" />, label: 'Contact Support', href: '/contact' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <a href="/" className="text-2xl font-bold text-purple-600">
                LearnHub
              </a>
              <div className="hidden md:flex items-center gap-6">
                <a
                  href="/dashboard"
                  className="px-4 py-2 text-purple-600 bg-purple-50 rounded-lg font-semibold border-b-2 border-purple-600 transition-colors"
                >
                  My Learning
                </a>
                <a href="/explore" className="text-gray-700 hover:text-purple-600 transition-colors">
                  Explore
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="hidden lg:block px-4 py-2 text-gray-400 hover:text-gray-600 transition-colors">
                Teach on LearnHub
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all relative"
                >
                  <Bell className="w-6 h-6" />
                  {notifications.some(n => n.unread) && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
                </button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                        <button
                          onClick={() => setNotificationsOpen(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                              notification.unread ? 'bg-purple-50' : ''
                            }`}
                          >
                            <p className="text-sm text-gray-900 mb-1">{notification.text}</p>
                            <p className="text-xs text-gray-500">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 text-center border-t border-gray-200">
                        <button className="text-sm text-purple-600 font-semibold hover:text-purple-700">
                          View all notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold hover:bg-purple-700 transition-all hover:scale-110 focus:ring-4 focus:ring-purple-200"
                >
                  {userName.charAt(0).toUpperCase()}
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border-2 border-gray-100 overflow-hidden z-50"
                    >
                      {/* Profile Header */}
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl font-bold">
                            {userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold">{userName}</h3>
                            <p className="text-sm text-purple-100">{userName.toLowerCase()}@example.com</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2 max-h-96 overflow-y-auto">
                        {profileMenuItems.map((section, sectionIndex) => (
                          <div key={section.title}>
                            <div className="px-4 pt-3 pb-2">
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                {section.title}
                              </p>
                            </div>

                            {section.items.map((item) => (
                              <div key={item.label} className="relative">
                                <a
                                  href={item.href}
                                  onClick={(e) => {
                                    if (item.onClick) {
                                      e.preventDefault();
                                      item.onClick();
                                    }
                                  }}
                                  onMouseEnter={() => setHoveredMenuItem(item.label)}
                                  onMouseLeave={() => setHoveredMenuItem(null)}
                                  className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all group ${
                                    item.highlight
                                      ? 'hover:bg-purple-50 text-purple-600 font-semibold'
                                      : 'hover:bg-gray-50 text-gray-700'
                                  } active:scale-95`}
                                >
                                  <span className={`${item.highlight ? 'text-purple-600' : 'text-gray-600'} group-hover:text-purple-600 transition-colors`}>
                                    {item.icon}
                                  </span>
                                  <span className="flex-1 font-medium">{item.label}</span>

                                  {item.badge && (
                                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                                      {item.badge}
                                    </span>
                                  )}

                                  {item.tooltip && (
                                    <div className="relative group/tooltip">
                                      <Info className="w-4 h-4 text-gray-400 hover:text-purple-600 transition-colors" />

                                      {hoveredMenuItem === item.label && (
                                        <motion.div
                                          initial={{ opacity: 0, x: -10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          className="absolute right-full mr-2 top-1/2 -translate-y-1/2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl z-10"
                                        >
                                          {item.tooltip}
                                          <div className="absolute left-full top-1/2 -translate-y-1/2 -ml-1 border-4 border-transparent border-l-gray-900"></div>
                                        </motion.div>
                                      )}
                                    </div>
                                  )}
                                </a>
                              </div>
                            ))}

                            {sectionIndex < profileMenuItems.length - 1 && (
                              <div className="my-2 mx-4 border-t border-gray-200"></div>
                            )}
                          </div>
                        ))}

                        {/* Logout */}
                        <div className="mt-2 mb-2">
                          <div className="mx-4 mb-2 border-t border-gray-200"></div>
                          <button
                            onClick={() => console.log('Logout')}
                            className="flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-red-600 hover:bg-red-50 transition-all w-[calc(100%-16px)] active:scale-95"
                          >
                            <LogOut className="w-5 h-5" />
                            <span className="font-semibold">Logout</span>
                          </button>
                        </div>
                      </div>

                      {/* Footer Help */}
                      <div className="border-t border-gray-200 bg-gray-50 p-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <HelpCircle className="w-4 h-4" />
                          <span>Need help? Press <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">ESC</kbd> to close</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl p-8 mb-8 text-white shadow-lg"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome back, {userName}! 👋
              </h1>
              <p className="text-purple-100 text-lg">
                You completed <span className="font-bold text-white">40%</span> of your learning goal this week
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[150px]">
                <p className="text-purple-100 text-sm mb-1">Weekly Progress</p>
                <p className="text-3xl font-bold">40%</p>
                <div className="mt-2 h-2 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Search */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search for courses..."
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
              />
              {recentSearches.length > 0 && searchValue === '' && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
                  <p className="text-xs text-gray-500 mb-2">Recent Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchValue(search)}
                        className="px-3 py-1 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-600 rounded-full text-sm transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 px-5 py-3.5 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all bg-white"
              >
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-700">Filters</span>
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {filterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-10"
                  >
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Level</label>
                      <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                      >
                        {levels.map((level) => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {hasActiveCourses ? (
          <>
            {/* Continue Learning Section */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Play className="w-7 h-7 text-purple-600" />
                <h2 className="text-3xl font-bold text-gray-900">Continue Learning</h2>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden cursor-pointer border-2 border-gray-100"
                onClick={() => onCourseClick(continueLearningCourse.id)}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/5 relative">
                    <img
                      src={continueLearningCourse.thumbnail}
                      alt={continueLearningCourse.title}
                      className="w-full h-56 md:h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      {continueLearningCourse.progress}% Complete
                    </div>
                  </div>
                  <div className="md:w-3/5 p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                      {continueLearningCourse.title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-6">by {continueLearningCourse.instructor}</p>

                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-base font-semibold text-gray-700">Progress</span>
                        <span className="text-base font-bold text-purple-600">
                          {continueLearningCourse.progress}%
                        </span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-600 rounded-full transition-all"
                          style={{ width: `${continueLearningCourse.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mb-6 text-base text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Last watched {continueLearningCourse.lastWatched}
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        {continueLearningCourse.duration} total
                      </div>
                    </div>

                    <button className="px-8 py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition-all flex items-center gap-3 shadow-md hover:shadow-lg">
                      <Play className="w-6 h-6" />
                      Resume Learning
                    </button>
                  </div>
                </div>
              </motion.div>
            </section>

            <div className="h-px bg-gray-200 mb-12"></div>

            {/* Top Picks For You */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Top Picks For You</h2>
                  <p className="text-base text-purple-600 font-semibold">Based on your interest: Web Development</p>
                </div>
              </div>

              <div className="relative group">
                <button
                  onClick={() => scroll(topPicksScrollRef, 'left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white p-3 rounded-full shadow-xl border-2 border-gray-200 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div
                  ref={topPicksScrollRef}
                  className="overflow-x-auto pb-6 scrollbar-hide"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <div className="flex gap-6" style={{ minWidth: 'max-content' }}>
                    {(topPicksExpanded ? topPicksCourses : topPicksCourses.slice(0, 5)).map((course, index) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => onCourseClick(course.id)}
                        onMouseEnter={() => setHoveredCourse(course.id)}
                        onMouseLeave={() => setHoveredCourse(null)}
                        className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden cursor-pointer border-2 border-gray-100 hover:scale-105 hover:-translate-y-3 duration-300"
                        style={{ width: '360px' }}
                      >
                        <div className="relative">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-52 object-cover"
                          />
                          <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                            {course.level}
                          </div>
                        </div>

                        <div className="p-6">
                          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-xl leading-tight">
                            {course.title}
                          </h3>
                          <p className="text-base text-gray-600 mb-4">{course.instructor}</p>

                          <div className="flex items-center gap-2 mb-4">
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold text-lg text-gray-900">{course.rating}</span>
                            <span className="text-base text-gray-500">({course.students})</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="font-bold text-2xl text-gray-900">{course.price}</span>
                            <button className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-bold">
                              Enroll
                            </button>
                          </div>
                        </div>

                        {/* Quick View Preview */}
                        <AnimatePresence>
                          {hoveredCourse === course.id && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent flex flex-col justify-end p-6"
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <Eye className="w-5 h-5 text-white" />
                                <span className="text-white font-bold text-lg">Quick View</span>
                              </div>
                              <p className="text-white text-base mb-4 leading-relaxed">
                                {course.description}
                              </p>
                              <div className="flex items-center gap-4 text-white/90 text-sm">
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  <span>{course.students} students</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <BookOpen className="w-4 h-4" />
                                  <span>{course.level}</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => scroll(topPicksScrollRef, 'right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white p-3 rounded-full shadow-xl border-2 border-gray-200 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {!topPicksExpanded && topPicksCourses.length > 5 && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setTopPicksExpanded(true)}
                    className="px-8 py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
                  >
                    View More
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </section>

            <div className="h-px bg-gray-200 mb-12"></div>

            {/* Trending Now */}
            <section className="mb-12">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 mb-8 border-2 border-orange-200">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-7 h-7 text-orange-600" />
                  <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
                </div>
                <p className="text-base text-gray-600">Most popular courses this week</p>
              </div>

              <div className="relative group">
                <button
                  onClick={() => scroll(trendingScrollRef, 'left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white p-3 rounded-full shadow-xl border-2 border-gray-200 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div
                  ref={trendingScrollRef}
                  className="overflow-x-auto pb-6 scrollbar-hide"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <div className="flex gap-6" style={{ minWidth: 'max-content' }}>
                    {(trendingExpanded ? trendingCourses : trendingCourses.slice(0, 5)).map((course, index) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => onCourseClick(course.id)}
                        onMouseEnter={() => setHoveredCourse(course.id)}
                        onMouseLeave={() => setHoveredCourse(null)}
                        className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden cursor-pointer border-2 border-gray-100 hover:scale-105 hover:-translate-y-3 duration-300"
                        style={{ width: '360px' }}
                      >
                        <div className="relative">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-52 object-cover"
                          />
                          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-4 py-2 rounded-full text-base font-bold shadow-lg">
                            {course.badge}
                          </div>
                        </div>

                        <div className="p-6">
                          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-xl leading-tight">
                            {course.title}
                          </h3>
                          <p className="text-base text-gray-600 mb-4">{course.instructor}</p>

                          <div className="flex items-center gap-2 mb-4">
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold text-lg text-gray-900">{course.rating}</span>
                            <span className="text-base text-gray-500">({course.students})</span>
                          </div>

                          <span className="font-bold text-2xl text-gray-900">{course.price}</span>
                        </div>

                        {/* Quick View Preview */}
                        <AnimatePresence>
                          {hoveredCourse === course.id && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent flex flex-col justify-end p-6"
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <Eye className="w-5 h-5 text-white" />
                                <span className="text-white font-bold text-lg">Quick View</span>
                              </div>
                              <p className="text-white text-base mb-4 leading-relaxed">
                                {course.description}
                              </p>
                              <div className="flex items-center gap-4 text-white/90 text-sm">
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  <span>{course.students} students</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => scroll(trendingScrollRef, 'right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white p-3 rounded-full shadow-xl border-2 border-gray-200 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {!trendingExpanded && trendingCourses.length > 5 && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setTrendingExpanded(true)}
                    className="px-8 py-4 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
                  >
                    View More
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </section>
          </>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-64 h-64 mb-8">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="80" fill="#F3F4F6" />
                <rect x="60" y="70" width="80" height="60" rx="4" fill="#E5E7EB" />
                <circle cx="100" cy="100" r="20" fill="#9CA3AF" />
                <path d="M90 100 L100 110 L110 90" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Your Learning Journey</h2>
            <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
              Discover thousands of courses and begin building in-demand skills today
            </p>
            <button className="px-8 py-4 bg-purple-600 text-white rounded-lg font-bold text-lg hover:bg-purple-700 hover:shadow-xl transition-all">
              Start Learning
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
