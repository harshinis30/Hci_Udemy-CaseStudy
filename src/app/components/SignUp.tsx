import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Info, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SignUpProps {
  onBack: () => void;
  onSignUpSuccess: (userName: string) => void;
}

type Step = 1 | 2;
type SignUpState = 'form' | 'loading' | 'success';

export function SignUp({ onBack, onSignUpSuccess }: SignUpProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [signUpState, setSignUpState] = useState<SignUpState>('form');
  const [showTooltip, setShowTooltip] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Step 1 fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  // Step 2 fields
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  // Validation functions
  const validateName = (value: string): boolean => {
    if (!value.trim()) {
      setNameError('Full name is required');
      return false;
    }
    if (value.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      return false;
    }
    setNameError('');
    return true;
  };

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

  const validatePassword = (value: string): boolean => {
    if (!value) {
      setPasswordError('Password is required');
      return false;
    }
    if (value.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (value: string): boolean => {
    if (!value) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    }
    if (value !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  // Event handlers
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFullName(value);
    if (nameTouched) validateName(value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (emailTouched) validateEmail(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (passwordTouched) validatePassword(value);
    if (confirmPasswordTouched && confirmPassword) {
      setConfirmPasswordError(value !== confirmPassword ? 'Passwords do not match' : '');
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (confirmPasswordTouched) validateConfirmPassword(value);
  };

  const handleStep1Continue = () => {
    setNameTouched(true);
    setEmailTouched(true);

    const isNameValid = validateName(fullName);
    const isEmailValid = validateEmail(email);

    if (isNameValid && isEmailValid) {
      setCurrentStep(2);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);

    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    setSignUpState('loading');

    // Simulate API call
    setTimeout(() => {
      const firstName = fullName.split(' ')[0];
      onSignUpSuccess(firstName);
    }, 2000);
  };

  const isStep1Valid = fullName && email && !nameError && !emailError;
  const isStep2Valid = password && confirmPassword && !passwordError && !confirmPasswordError;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-lg">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </button>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-purple-600">Step {currentStep} of 2</span>
            <span className="text-sm text-gray-500">
              {currentStep === 1 ? 'Basic Information' : 'Security & Preferences'}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-purple-600"
              initial={{ width: '0%' }}
              animate={{ width: currentStep === 1 ? '50%' : '100%' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Create Account</h2>
          <p className="text-gray-600 mb-8">Join millions of learners worldwide</p>

          <form onSubmit={handleFinalSubmit}>
            <AnimatePresence mode="wait">
              {currentStep === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Full Name Field */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={handleNameChange}
                        onBlur={() => {
                          setNameTouched(true);
                          validateName(fullName);
                        }}
                        placeholder="Enter your full name"
                        className={`w-full px-4 py-3.5 border-2 rounded-lg transition-all focus:outline-none ${
                          nameError && nameTouched
                            ? 'border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-100'
                            : fullName && !nameError && nameTouched
                            ? 'border-green-500 focus:border-green-600 focus:ring-4 focus:ring-green-100'
                            : 'border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100'
                        }`}
                      />
                      {fullName && !nameError && nameTouched && (
                        <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <AnimatePresence>
                      {nameError && nameTouched ? (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-600 text-sm mt-2 font-medium"
                        >
                          {nameError}
                        </motion.p>
                      ) : (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-gray-500 text-sm mt-2"
                        >
                          Use your real name for certificates
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        onBlur={() => {
                          setEmailTouched(true);
                          validateEmail(email);
                        }}
                        placeholder="Enter your email"
                        className={`w-full px-4 py-3.5 border-2 rounded-lg transition-all focus:outline-none ${
                          emailError && emailTouched
                            ? 'border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-100'
                            : email && !emailError && emailTouched
                            ? 'border-green-500 focus:border-green-600 focus:ring-4 focus:ring-green-100'
                            : 'border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100'
                        }`}
                      />
                      {email && !emailError && emailTouched && (
                        <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <AnimatePresence>
                      {emailError && emailTouched ? (
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
                          We'll send course updates to this email
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Continue Button */}
                  <button
                    type="button"
                    onClick={handleStep1Continue}
                    disabled={!isStep1Valid}
                    className={`w-full py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 mt-8 ${
                      isStep1Valid
                        ? 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-[1.02] hover:shadow-xl'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Continue to Step 2
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={handlePasswordChange}
                        onBlur={() => {
                          setPasswordTouched(true);
                          validatePassword(password);
                        }}
                        placeholder="Create a strong password"
                        className={`w-full px-4 py-3.5 pr-12 border-2 rounded-lg transition-all focus:outline-none ${
                          passwordError && passwordTouched
                            ? 'border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-100'
                            : password && !passwordError && passwordTouched
                            ? 'border-green-500 focus:border-green-600 focus:ring-4 focus:ring-green-100'
                            : 'border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <AnimatePresence>
                      {passwordError && passwordTouched ? (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-600 text-sm mt-2 font-medium"
                        >
                          {passwordError}
                        </motion.p>
                      ) : (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-gray-500 text-sm mt-2"
                        >
                          Must be at least 8 characters
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        onBlur={() => {
                          setConfirmPasswordTouched(true);
                          validateConfirmPassword(confirmPassword);
                        }}
                        placeholder="Re-enter your password"
                        className={`w-full px-4 py-3.5 border-2 rounded-lg transition-all focus:outline-none ${
                          confirmPasswordError && confirmPasswordTouched
                            ? 'border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-100'
                            : confirmPassword && !confirmPasswordError && confirmPasswordTouched
                            ? 'border-green-500 focus:border-green-600 focus:ring-4 focus:ring-green-100'
                            : 'border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100'
                        }`}
                      />
                      {confirmPassword && !confirmPasswordError && confirmPasswordTouched && (
                        <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <AnimatePresence>
                      {confirmPasswordError && confirmPasswordTouched && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-600 text-sm mt-2 font-medium"
                        >
                          {confirmPasswordError}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Marketing Opt-in */}
                  <div className="flex items-start gap-3 pt-2">
                    <div className="relative flex items-center">
                      <input
                        id="marketing"
                        type="checkbox"
                        checked={marketingOptIn}
                        onChange={(e) => setMarketingOptIn(e.target.checked)}
                        className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer transition-all"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="marketing" className="text-sm text-gray-700 cursor-pointer flex items-center gap-2">
                        Send me course recommendations and special offers
                        <div className="relative">
                          <button
                            type="button"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                            className="text-gray-400 hover:text-purple-600 transition-colors"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                          <AnimatePresence>
                            {showTooltip && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl z-10"
                              >
                                Get personalized course recommendations, early access to new courses, and exclusive discounts.
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 mt-8">
                    <button
                      type="submit"
                      disabled={!isStep2Valid || signUpState === 'loading'}
                      className={`w-full py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                        isStep2Valid && signUpState !== 'loading'
                          ? 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-[1.02] hover:shadow-xl'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {signUpState === 'loading' ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="w-full py-3 text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Step 1
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
