import { useState } from 'react';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginProps {
  onBack: () => void;
  onSignUpClick: () => void;
  onLoginSuccess: (userName: string) => void;
}

type LoginState = 'form' | 'loading' | 'success' | 'error';

export function Login({ onBack, onSignUpClick, onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loginState, setLoginState] = useState<LoginState>('form');
  const [touched, setTouched] = useState(false);

  const validateEmail = (value: string): boolean => {
    if (!value) {
      setEmailError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (touched) {
      validateEmail(value);
    }
  };

  const handleEmailBlur = () => {
    setTouched(true);
    validateEmail(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!validateEmail(email)) {
      return;
    }

    setLoginState('loading');

    // Simulate API call
    setTimeout(() => {
      const userName = email.split('@')[0];
      onLoginSuccess(userName);
    }, 2000);
  };

  const handleSocialLogin = (provider: string) => {
    setLoginState('loading');
    setTimeout(() => {
      onLoginSuccess('User');
    }, 1500);
  };

  const isFormValid = email && !emailError;

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-60">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-40 right-20 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-white text-center max-w-md"
        >
          <h1 className="text-5xl font-bold mb-6">Welcome back!</h1>
          <p className="text-xl text-purple-100 leading-relaxed">
            Continue your learning journey with thousands of courses at your fingertips.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold">20K+</div>
              <div className="text-purple-200 text-sm mt-1">Courses</div>
            </div>
            <div>
              <div className="text-4xl font-bold">5M+</div>
              <div className="text-purple-200 text-sm mt-1">Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold">50K+</div>
              <div className="text-purple-200 text-sm mt-1">Instructors</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Log in</h2>
            <p className="text-gray-600 mb-8">Access your learning dashboard</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    placeholder="Enter your email"
                    className={`w-full pl-11 pr-4 py-3.5 border-2 rounded-lg transition-all focus:outline-none ${
                      emailError && touched
                        ? 'border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-100'
                        : 'border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100'
                    }`}
                    disabled={loginState === 'loading'}
                  />
                </div>

                <AnimatePresence>
                  {emailError && touched ? (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-600 text-sm mt-2 font-medium"
                    >
                      {emailError}
                    </motion.p>
                  ) : (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-gray-500 text-sm mt-2"
                    >
                      We'll send you a login link
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || loginState === 'loading'}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  isFormValid && loginState !== 'loading'
                    ? 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-[1.02] hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loginState === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  'Continue'
                )}
              </button>

              <button
                type="button"
                onClick={onBack}
                className="w-full py-3 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <button
                onClick={() => handleSocialLogin('google')}
                disabled={loginState === 'loading'}
                className="w-full py-3.5 border-2 border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:border-gray-400 hover:bg-gray-50 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-semibold text-gray-700">Continue with Google</span>
              </button>

              <button
                onClick={() => handleSocialLogin('facebook')}
                disabled={loginState === 'loading'}
                className="w-full py-3.5 border-2 border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:border-gray-400 hover:bg-gray-50 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="font-semibold text-gray-700">Continue with Facebook</span>
              </button>

              <button
                onClick={() => handleSocialLogin('apple')}
                disabled={loginState === 'loading'}
                className="w-full py-3.5 border-2 border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:border-gray-400 hover:bg-gray-50 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="#000000" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="font-semibold text-gray-700">Continue with Apple</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-gray-600 mt-8">
              Don't have an account?{' '}
              <button
                onClick={onSignUpClick}
                className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
              >
                Sign up
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
