import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CourseCard } from './components/CourseCard';
import { SearchAutocomplete } from './components/SearchAutocomplete';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { Dashboard } from './components/Dashboard';
import { CoursePlayer } from './components/CoursePlayer';
import { HelpSupport } from './components/HelpSupport';
import { SearchResults } from './components/SearchResults';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { AddToCartModal } from './components/AddToCartModal';

type View = 'home' | 'login' | 'signup' | 'dashboard' | 'player' | 'help' | 'search' | 'cart' | 'checkout';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [userName, setUserName] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedCourseTitle, setSelectedCourseTitle] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showCartModal, setShowCartModal] = useState(false);
  const [addedCourse, setAddedCourse] = useState<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = (course: any) => {
    setAddedCourse(course);
    setShowCartModal(true);
  };

  const featuredCourses = [
    {
      title: 'The Complete Python Bootcamp From Zero to Hero',
      instructor: 'Jose Portilla',
      rating: 4.6,
      price: '$84.99',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop',
    },
    {
      title: 'Machine Learning A-Z: AI, Python & R',
      instructor: 'Kirill Eremenko',
      rating: 4.5,
      price: '$89.99',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
    },
    {
      title: 'The Web Developer Bootcamp 2024',
      instructor: 'Colt Steele',
      rating: 4.7,
      price: '$79.99',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
    },
    {
      title: 'React - The Complete Guide 2024',
      instructor: 'Maximilian Schwarzmüller',
      rating: 4.6,
      price: '$84.99',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
    },
  ];

  if (currentView === 'login') {
    return (
      <Login
        onBack={() => setCurrentView('home')}
        onSignUpClick={() => setCurrentView('signup')}
        onLoginSuccess={(name) => {
          setUserName(name);
          setCurrentView('dashboard');
        }}
      />
    );
  }

  if (currentView === 'signup') {
    return (
      <SignUp
        onBack={() => setCurrentView('login')}
        onSignUpSuccess={(name) => {
          setUserName(name);
          setCurrentView('dashboard');
        }}
      />
    );
  }

  if (currentView === 'dashboard') {
    return (
      <Dashboard
        userName={userName}
        onCourseClick={(courseId) => {
          setSelectedCourseId(courseId);
          setSelectedCourseTitle('The Complete Python Bootcamp From Zero to Hero');
          setCurrentView('player');
        }}
        onHelpClick={() => setCurrentView('help')}
      />
    );
  }

  if (currentView === 'player') {
    return (
      <CoursePlayer
        courseId={selectedCourseId}
        courseTitle={selectedCourseTitle}
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'help') {
    return (
      <HelpSupport
        onBack={() => setCurrentView('dashboard')}
        context="general"
      />
    );
  }

  if (currentView === 'search') {
    return (
      <>
        <SearchResults
          onBack={() => setCurrentView('home')}
          initialQuery={searchValue}
          onAddToCart={handleAddToCart}
        />
        <AddToCartModal
          isOpen={showCartModal}
          onClose={() => setShowCartModal(false)}
          course={addedCourse}
          onGoToCart={() => {
            setShowCartModal(false);
            setCurrentView('cart');
          }}
        />
      </>
    );
  }

  if (currentView === 'cart') {
    return (
      <Cart
        onBack={() => setCurrentView('search')}
        onCheckout={() => setCurrentView('checkout')}
      />
    );
  }

  if (currentView === 'checkout') {
    return (
      <Checkout
        onBack={() => setCurrentView('cart')}
        onComplete={() => setCurrentView('dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onSearchChange={setSearchValue}
        searchValue={searchValue}
        onLoginClick={() => setCurrentView('login')}
        onSearch={() => {
          console.log('Search triggered with:', searchValue);
          setCurrentView('search');
        }}
        isLoggedIn={false}
      />

      {searchValue && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-xl mx-auto relative">
            <SearchAutocomplete
              searchValue={searchValue}
              onSelect={(value) => {
                setSearchValue(value);
                setCurrentView('search');
              }}
            />
          </div>
        </div>
      )}

      <Hero />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <CourseCard
                  key={index}
                  title=""
                  instructor=""
                  rating={0}
                  price=""
                  image=""
                  isLoading={true}
                />
              ))
            : featuredCourses.map((course, index) => (
                <CourseCard key={index} {...course} />
              ))}
        </div>
      </section>

      <AddToCartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        course={addedCourse}
        onGoToCart={() => {
          setShowCartModal(false);
          setCurrentView('cart');
        }}
      />
    </div>
  );
}
