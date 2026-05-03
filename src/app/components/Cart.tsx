import { useState } from 'react';
import { ArrowLeft, Trash2, Heart, Bookmark, Shield, Lock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartProps {
  onBack: () => void;
  onCheckout: () => void;
}

interface CartItem {
  id: string;
  title: string;
  instructor: string;
  price: number;
  originalPrice: number;
  image: string;
  duration: string;
  level: string;
}

export function Cart({ onBack, onCheckout }: CartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      title: 'Human-Computer Interaction: Design Principles',
      instructor: 'Dr. Sarah Mitchell',
      price: 84.99,
      originalPrice: 129.99,
      image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=300&fit=crop',
      duration: '12 hours',
      level: 'Intermediate',
    },
    {
      id: '2',
      title: 'UX Design Fundamentals: HCI & Psychology',
      instructor: 'James Anderson',
      price: 79.99,
      originalPrice: 119.99,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
      duration: '8 hours',
      level: 'Beginner',
    },
  ]);

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const totalOriginal = cartItems.reduce((sum, item) => sum + item.originalPrice, 0);
  const totalCurrent = cartItems.reduce((sum, item) => sum + item.price, 0);
  const totalSavings = totalOriginal - totalCurrent;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-1">Step 1 of 2: Review Cart</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Browse our courses and add some to your cart!</p>
            <button
              onClick={onBack}
              className="px-8 py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-purple-900 mb-1">
                    Price may increase soon!
                  </h3>
                  <p className="text-sm text-purple-700">
                    These courses are on sale. Prices may go up at any time. Checkout now to lock in your savings!
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex gap-6">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-48 h-32 object-cover rounded-xl flex-shrink-0"
                        />

                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 mb-3">By {item.instructor}</p>

                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                            <span>{item.duration}</span>
                            <span>•</span>
                            <span>{item.level}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>

                            <button className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-semibold">
                              <Heart className="w-4 h-4" />
                              Save for Later
                            </button>

                            <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-semibold">
                              <Bookmark className="w-4 h-4" />
                              Wishlist
                            </button>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="text-3xl font-bold text-gray-900 mb-2">
                            ${item.price.toFixed(2)}
                          </p>
                          <p className="text-gray-500 line-through mb-1">
                            ${item.originalPrice.toFixed(2)}
                          </p>
                          <p className="text-green-600 font-semibold text-sm">
                            {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-white rounded-2xl border-2 border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Original Price:</span>
                    <span className="font-semibold">${totalOriginal.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-green-600">
                    <span className="font-semibold">You Save:</span>
                    <span className="font-bold text-lg">-${totalSavings.toFixed(2)}</span>
                  </div>

                  <div className="pt-4 border-t-2 border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl font-bold text-gray-900">Total:</span>
                      <span className="text-3xl font-bold text-purple-600">
                        ${totalCurrent.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 text-right">
                      {cartItems.length} {cartItems.length === 1 ? 'course' : 'courses'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onCheckout}
                  className="w-full px-6 py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl mb-4"
                >
                  Proceed to Checkout
                </button>

                <div className="space-y-3 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-sm">
                      <span className="font-bold">30-day money-back guarantee</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <Lock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <p className="text-sm">
                      <span className="font-bold">Secure payment</span> - Your data is protected
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-3">Have a coupon?</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    />
                    <button className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
