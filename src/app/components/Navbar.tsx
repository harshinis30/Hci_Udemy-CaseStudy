import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Menu, Code, Briefcase, Server, Palette, TrendingUp, User, Camera, Music as MusicIcon, X, UserCircle, Edit, BookOpen, Heart, ShoppingCart, Settings, CreditCard, Bell, HelpCircle, MessageCircle, LifeBuoy, LogOut, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onSearchChange: (value: string) => void;
  searchValue: string;
  onLoginClick: () => void;
  onSearch?: () => void;
  isLoggedIn?: boolean;
  userName?: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  subcategories: string[];
}

export function Navbar({ onSearchChange, searchValue, onLoginClick, onSearch, isLoggedIn = false, userName = 'User' }: NavbarProps) {
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('development');
  const [categorySearch, setCategorySearch] = useState('');
  const [showAllSubcategories, setShowAllSubcategories] = useState(false);
  const [hoveredMenuItem, setHoveredMenuItem] = useState<string | null>(null);
  const [selectedProfileItem, setSelectedProfileItem] = useState<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const exploreButtonRef = useRef<HTMLButtonElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  const categories: Category[] = [
    {
      id: 'development',
      name: 'Development',
      icon: <Code className="w-5 h-5" />,
      subcategories: [
        'Web Development',
        'Mobile Development',
        'Programming Languages',
        'Game Development',
        'Database Design',
        'Software Testing',
        'Software Engineering',
        'Development Tools',
        'No-Code Development',
      ],
    },
    {
      id: 'business',
      name: 'Business',
      icon: <Briefcase className="w-5 h-5" />,
      subcategories: [
        'Entrepreneurship',
        'Finance',
        'Business Analytics',
        'Project Management',
        'Business Strategy',
        'Operations',
        'E-Commerce',
        'Sales',
      ],
    },
    {
      id: 'it-software',
      name: 'IT & Software',
      icon: <Server className="w-5 h-5" />,
      subcategories: [
        'IT Certifications',
        'Network & Security',
        'Hardware',
        'Operating Systems',
        'Cloud Computing',
        'DevOps',
        'Cybersecurity',
      ],
    },
    {
      id: 'design',
      name: 'Design',
      icon: <Palette className="w-5 h-5" />,
      subcategories: [
        'Web Design',
        'Graphic Design',
        'UI/UX Design',
        'Design Tools',
        '3D & Animation',
        'Fashion Design',
        'Interior Design',
      ],
    },
    {
      id: 'marketing',
      name: 'Marketing',
      icon: <TrendingUp className="w-5 h-5" />,
      subcategories: [
        'Digital Marketing',
        'SEO',
        'Social Media Marketing',
        'Content Marketing',
        'Branding',
        'Marketing Analytics',
        'Public Relations',
      ],
    },
    {
      id: 'personal-development',
      name: 'Personal Development',
      icon: <User className="w-5 h-5" />,
      subcategories: [
        'Leadership',
        'Productivity',
        'Career Development',
        'Motivation',
        'Memory & Study Skills',
        'Communication Skills',
      ],
    },
    {
      id: 'photography',
      name: 'Photography',
      icon: <Camera className="w-5 h-5" />,
      subcategories: [
        'Digital Photography',
        'Photography Tools',
        'Portrait Photography',
        'Photography Fundamentals',
        'Commercial Photography',
        'Video Design',
      ],
    },
    {
      id: 'music',
      name: 'Music',
      icon: <MusicIcon className="w-5 h-5" />,
      subcategories: [
        'Music Fundamentals',
        'Music Production',
        'Music Software',
        'Vocal',
        'Music Techniques',
      ],
    },
  ];

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        exploreButtonRef.current &&
        !exploreButtonRef.current.contains(event.target as Node)
      ) {
        setIsExploreOpen(false);
      }

      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    if (isExploreOpen || isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExploreOpen, isProfileOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Explore dropdown navigation
      if (isExploreOpen) {
        const currentIndex = categories.findIndex(cat => cat.id === selectedCategory);

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % categories.length;
            setSelectedCategory(categories[nextIndex].id);
            break;
          case 'ArrowUp':
            e.preventDefault();
            const prevIndex = currentIndex === 0 ? categories.length - 1 : currentIndex - 1;
            setSelectedCategory(categories[prevIndex].id);
            break;
          case 'Escape':
            setIsExploreOpen(false);
            break;
        }
      }

      // Profile dropdown navigation
      if (isProfileOpen) {
        const allMenuItems = profileMenuItems.flatMap(section => section.items);

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setSelectedProfileItem(prev => (prev + 1) % allMenuItems.length);
            break;
          case 'ArrowUp':
            e.preventDefault();
            setSelectedProfileItem(prev => prev === 0 ? allMenuItems.length - 1 : prev - 1);
            break;
          case 'Enter':
            e.preventDefault();
            const selectedItem = allMenuItems[selectedProfileItem];
            if (selectedItem) {
              console.log('Navigate to:', selectedItem.label);
            }
            break;
          case 'Escape':
            setIsProfileOpen(false);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExploreOpen, isProfileOpen, selectedCategory, selectedProfileItem, categories]);

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);
  const displayedSubcategories = showAllSubcategories
    ? selectedCategoryData?.subcategories || []
    : (selectedCategoryData?.subcategories || []).slice(0, 5);

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
    cat.subcategories.some(sub => sub.toLowerCase().includes(categorySearch.toLowerCase()))
  );

  // Profile menu items
  const profileMenuItems = [
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
          tooltip: 'Need help? Get instant answers or contact support'
        },
        { icon: <MessageCircle className="w-5 h-5" />, label: 'FAQs', href: '/faq' },
        { icon: <LifeBuoy className="w-5 h-5" />, label: 'Contact Support', href: '/contact' },
      ],
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <a href="/" className="text-2xl font-bold text-purple-600">
              LearnHub
            </a>

            {/* Explore Dropdown */}
            <div className="relative hidden md:block">
              <button
                ref={exploreButtonRef}
                onClick={() => setIsExploreOpen(!isExploreOpen)}
                onMouseEnter={() => setIsExploreOpen(true)}
                className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors rounded-lg hover:bg-purple-50"
              >
                Explore
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExploreOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isExploreOpen && (
                  <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-gray-100 overflow-hidden z-50"
                    style={{ width: '700px' }}
                  >
                    {/* Search Bar */}
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={categorySearch}
                          onChange={(e) => setCategorySearch(e.target.value)}
                          placeholder="Search within categories..."
                          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all text-sm"
                        />
                        {categorySearch && (
                          <button
                            onClick={() => setCategorySearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex" style={{ height: '400px' }}>
                      {/* Left Panel - Categories */}
                      <div className="w-1/3 border-r border-gray-200 overflow-y-auto bg-gray-50">
                        <div className="p-2">
                          {filteredCategories.map((category) => (
                            <button
                              key={category.id}
                              onMouseEnter={() => {
                                setSelectedCategory(category.id);
                                setShowAllSubcategories(false);
                              }}
                              onClick={() => setSelectedCategory(category.id)}
                              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                                selectedCategory === category.id
                                  ? 'bg-purple-600 text-white shadow-md'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <span className={selectedCategory === category.id ? 'text-white' : 'text-purple-600'}>
                                {category.icon}
                              </span>
                              <span className="font-semibold text-sm">{category.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Right Panel - Subcategories */}
                      <div className="flex-1 overflow-y-auto bg-white">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={selectedCategory}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="p-6"
                          >
                            <div className="flex items-center gap-3 mb-6">
                              <span className="text-purple-600">
                                {selectedCategoryData?.icon}
                              </span>
                              <h3 className="text-xl font-bold text-gray-900">
                                {selectedCategoryData?.name}
                              </h3>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                              {displayedSubcategories.map((subcategory, index) => (
                                <motion.a
                                  key={subcategory}
                                  href={`/category/${selectedCategory}/${subcategory.toLowerCase().replace(/\s+/g, '-')}`}
                                  initial={{ opacity: 0, x: 10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-all font-medium text-sm flex items-center justify-between group"
                                >
                                  <span>{subcategory}</span>
                                  <ChevronDown className="w-4 h-4 -rotate-90 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.a>
                              ))}
                            </div>

                            {selectedCategoryData && selectedCategoryData.subcategories.length > 5 && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <button
                                  onClick={() => setShowAllSubcategories(!showAllSubcategories)}
                                  className="w-full px-4 py-3 bg-purple-50 text-purple-600 rounded-lg font-semibold hover:bg-purple-100 transition-colors flex items-center justify-center gap-2 text-sm"
                                >
                                  {showAllSubcategories ? 'Show Less' : `View All ${selectedCategoryData.subcategories.length} Topics`}
                                  <ChevronDown className={`w-4 h-4 transition-transform ${showAllSubcategories ? 'rotate-180' : ''}`} />
                                </button>
                              </div>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      <a
                        href="/explore"
                        className="block text-center text-purple-600 font-semibold hover:text-purple-700 transition-colors text-sm"
                      >
                        Explore All Categories →
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Search Bar (Center) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchValue.trim() && onSearch) {
                      onSearch();
                    }
                  }}
                  placeholder="Search courses like Python, AI, Web Dev…"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
                />
              </div>
              {searchValue && (
                <button
                  onClick={() => {
                    if (onSearch) {
                      onSearch();
                    }
                  }}
                  className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Search
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {!isLoggedIn && (
              <>
                <button className="hidden md:block px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors">
                  Udemy Business
                </button>
                <button className="hidden md:block px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors">
                  Teach on LearnHub
                </button>
                <button
                  onClick={onLoginClick}
                  className="px-5 py-2.5 text-gray-700 border border-gray-700 rounded-lg hover:bg-gray-50 transition-all hover:shadow-md min-w-[80px]"
                >
                  Log in
                </button>
                <button className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all hover:shadow-lg hover:scale-105 min-w-[90px]">
                  Sign up
                </button>
              </>
            )}

            {/* Profile Dropdown (shown when logged in) */}
            {isLoggedIn && (
              <div className="relative hidden md:block">
              <button
                ref={profileButtonRef}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold hover:bg-purple-700 transition-all hover:scale-110 focus:ring-4 focus:ring-purple-200"
              >
                {userName.charAt(0).toUpperCase()}
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    ref={profileDropdownRef}
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
                          {/* Section Title */}
                          <div className="px-4 pt-3 pb-2">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                              {section.title}
                            </p>
                          </div>

                          {/* Section Items */}
                          {section.items.map((item, itemIndex) => {
                            const globalIndex = profileMenuItems
                              .slice(0, sectionIndex)
                              .reduce((acc, s) => acc + s.items.length, 0) + itemIndex;

                            return (
                              <div key={item.label} className="relative">
                                <a
                                  href={item.href}
                                  onMouseEnter={() => setHoveredMenuItem(item.label)}
                                  onMouseLeave={() => setHoveredMenuItem(null)}
                                  className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all group ${
                                    selectedProfileItem === globalIndex
                                      ? 'bg-purple-50 text-purple-600'
                                      : item.highlight
                                      ? 'hover:bg-purple-50 text-purple-600 font-semibold'
                                      : 'hover:bg-gray-50 text-gray-700'
                                  } active:scale-95`}
                                >
                                  <span className={`${item.highlight ? 'text-purple-600' : 'text-gray-600'} group-hover:text-purple-600 transition-colors`}>
                                    {item.icon}
                                  </span>
                                  <span className="flex-1 font-medium">{item.label}</span>

                                  {/* Badge */}
                                  {item.badge && (
                                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                                      {item.badge}
                                    </span>
                                  )}

                                  {/* Tooltip Icon */}
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
                            );
                          })}

                          {/* Separator */}
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
            )}

            <button className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
