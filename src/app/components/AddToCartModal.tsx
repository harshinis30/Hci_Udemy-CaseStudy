import { useEffect, useState } from 'react';
import { X, CheckCircle, ShoppingCart, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: any;
  onGoToCart: () => void;
}

export function AddToCartModal({ isOpen, onClose, course, onGoToCart }: AddToCartModalProps) {
  const [showFrequentlyBought, setShowFrequentlyBought] = useState(false);
  const [autoCloseSeconds, setAutoCloseSeconds] = useState(4);

  useEffect(() => {
    if (isOpen) {
      setAutoCloseSeconds(4);
      const interval = setInterval(() => {
        setAutoCloseSeconds(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    if (autoCloseSeconds === 0 && isOpen) {
      onClose();
    }
  }, [autoCloseSeconds, isOpen, onClose]);

  if (!isOpen || !course) return null;

  const frequentlyBoughtCourses = [
    {
      id: 'freq-1',
      title: 'Advanced UI/UX Patterns',
      instructor: 'John Smith',
      price: 49.99,
      originalPrice: 79.99,
    },
    {
      id: 'freq-2',
      title: 'Design Systems Mastery',
      instructor: 'Emma Davis',
      price: 59.99,
      originalPrice: 89.99,
    },
  ];

  const totalPrice = course.price;
  const totalOriginalPrice = course.originalPrice || course.price;
  const savings = totalOriginalPrice - totalPrice;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-10 h-10 text-green-500" />
              </motion.div>

              <h2 className="text-2xl font-bold text-center mb-2">
                Added to cart successfully!
              </h2>
              <p className="text-center text-green-100">
                Auto-closing in {autoCloseSeconds}s...
              </p>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex gap-4">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-24 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600">{course.instructor}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">Total:</span>
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      ${totalPrice.toFixed(2)}
                    </span>
                    {course.originalPrice && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        ${course.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {savings > 0 && (
                  <div className="mt-2 flex items-center justify-end">
                    <span className="text-sm text-green-600 font-semibold">
                      You save ${savings.toFixed(2)}!
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowFrequentlyBought(!showFrequentlyBought)}
                className="w-full flex items-center justify-between p-4 bg-purple-50 border-2 border-purple-200 rounded-xl hover:bg-purple-100 transition-colors mb-6"
              >
                <span className="font-bold text-purple-900">
                  Frequently Bought Together ({frequentlyBoughtCourses.length})
                </span>
                {showFrequentlyBought ? (
                  <ChevronUp className="w-5 h-5 text-purple-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-purple-600" />
                )}
              </button>

              <AnimatePresence>
                {showFrequentlyBought && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-6"
                  >
                    <div className="space-y-3">
                      {frequentlyBoughtCourses.map(fbCourse => (
                        <div
                          key={fbCourse.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm mb-1">
                              {fbCourse.title}
                            </h4>
                            <p className="text-xs text-gray-600">{fbCourse.instructor}</p>
                          </div>
                          <div className="text-right ml-3">
                            <p className="font-bold text-gray-900">${fbCourse.price}</p>
                            <p className="text-xs text-gray-500 line-through">
                              ${fbCourse.originalPrice}
                            </p>
                          </div>
                          <button className="ml-3 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors">
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-3">
                <button
                  onClick={onGoToCart}
                  className="flex-1 px-6 py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Go to Cart
                </button>

                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-purple-500 hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
                >
                  Continue Browsing
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
