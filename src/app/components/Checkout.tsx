import { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Building2, Wallet, Lock, CheckCircle, AlertCircle, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CheckoutProps {
  onBack: () => void;
  onComplete: () => void;
}

type Step = 'billing' | 'payment' | 'confirm';
type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'wallet';

export function Checkout({ onBack, onComplete }: CheckoutProps) {
  const [currentStep, setCurrentStep] = useState<Step>('billing');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaFailed, setCaptchaFailed] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showOtpFallback, setShowOtpFallback] = useState(false);

  const [billingInfo, setBillingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'United States',
  });

  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalAmount = 164.98;
  const cartItems = [
    { title: 'Human-Computer Interaction: Design Principles', price: 84.99 },
    { title: 'UX Design Fundamentals: HCI & Psychology', price: 79.99 },
  ];

  const validateBilling = () => {
    const newErrors: Record<string, string> = {};

    if (!billingInfo.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!billingInfo.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Valid email is required';
    }
    if (!billingInfo.phone.match(/^\d{10}$/)) {
      newErrors.phone = 'Valid 10-digit phone number required';
    }
    if (!billingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!billingInfo.city.trim()) newErrors.city = 'City is required';
    if (!billingInfo.zipCode.match(/^\d{5,6}$/)) {
      newErrors.zipCode = 'Valid zip code required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    if (paymentMethod === 'card') {
      const newErrors: Record<string, string> = {};

      if (!cardInfo.cardNumber.match(/^\d{16}$/)) {
        newErrors.cardNumber = 'Valid 16-digit card number required';
      }
      if (!cardInfo.cardName.trim()) newErrors.cardName = 'Cardholder name required';
      if (!cardInfo.expiryDate.match(/^\d{2}\/\d{2}$/)) {
        newErrors.expiryDate = 'Valid expiry (MM/YY) required';
      }
      if (!cardInfo.cvv.match(/^\d{3}$/)) {
        newErrors.cvv = 'Valid 3-digit CVV required';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
    return true;
  };

  const handleProceedFromBilling = () => {
    if (validateBilling()) {
      setCurrentStep('payment');
    }
  };

  const handleProceedFromPayment = () => {
    if (validatePayment()) {
      if (totalAmount > 100 || Math.random() > 0.7) {
        setShowCaptcha(true);
      } else {
        setCurrentStep('confirm');
      }
    }
  };

  const handleCaptchaVerify = () => {
    const success = Math.random() > 0.3;

    if (success) {
      setCaptchaVerified(true);
      setCaptchaFailed(false);
      setTimeout(() => {
        setShowCaptcha(false);
        setCurrentStep('confirm');
      }, 1000);
    } else {
      setCaptchaFailed(true);
      setFailedAttempts(prev => prev + 1);

      setTimeout(() => {
        setCaptchaFailed(false);
      }, 2000);

      if (failedAttempts >= 2) {
        setShowOtpFallback(true);
      }
    }
  };

  const handleOtpVerify = () => {
    setCaptchaVerified(true);
    setShowOtpFallback(false);
    setShowCaptcha(false);
    setCurrentStep('confirm');
  };

  const paymentMethods = [
    { id: 'card' as PaymentMethod, icon: <CreditCard className="w-6 h-6" />, label: 'Credit/Debit Card' },
    { id: 'upi' as PaymentMethod, icon: <Smartphone className="w-6 h-6" />, label: 'UPI' },
    { id: 'netbanking' as PaymentMethod, icon: <Building2 className="w-6 h-6" />, label: 'Net Banking' },
    { id: 'wallet' as PaymentMethod, icon: <Wallet className="w-6 h-6" />, label: 'Wallets' },
  ];

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
              <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
              <p className="text-gray-600 mt-1">Complete your purchase</p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center">
            <div className="flex items-center gap-4">
              {['billing', 'payment', 'confirm'].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                        currentStep === step
                          ? 'bg-purple-600 text-white'
                          : index < ['billing', 'payment', 'confirm'].indexOf(currentStep)
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {index < ['billing', 'payment', 'confirm'].indexOf(currentStep) ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className="font-semibold text-gray-700 capitalize hidden sm:inline">
                      {step}
                    </span>
                  </div>
                  {index < 2 && (
                    <div className={`w-16 h-1 mx-4 rounded ${
                      index < ['billing', 'payment', 'confirm'].indexOf(currentStep)
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentStep === 'billing' && (
                <motion.div
                  key="billing"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-2xl border-2 border-gray-200 p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing Information</h2>

                  <div className="space-y-5">
                    <div>
                      <label className="block font-semibold text-gray-900 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={billingInfo.fullName}
                        onChange={(e) => setBillingInfo({ ...billingInfo, fullName: e.target.value })}
                        className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all text-lg ${
                          errors.fullName
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                            : 'border-gray-300 focus:border-purple-500 focus:ring-purple-100'
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.fullName && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block font-semibold text-gray-900 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={billingInfo.email}
                          onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                          className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all text-lg ${
                            errors.email
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                              : 'border-gray-300 focus:border-purple-500 focus:ring-purple-100'
                          }`}
                          placeholder="john@example.com"
                        />
                        {errors.email && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-900 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={billingInfo.phone}
                          onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
                          className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all text-lg ${
                            errors.phone
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                              : 'border-gray-300 focus:border-purple-500 focus:ring-purple-100'
                          }`}
                          placeholder="1234567890"
                        />
                        {errors.phone && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-900 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        value={billingInfo.address}
                        onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                        className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all text-lg ${
                          errors.address
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                            : 'border-gray-300 focus:border-purple-500 focus:ring-purple-100'
                        }`}
                        placeholder="123 Main Street"
                      />
                      {errors.address && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.address}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block font-semibold text-gray-900 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={billingInfo.city}
                          onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                          className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all text-lg ${
                            errors.city
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                              : 'border-gray-300 focus:border-purple-500 focus:ring-purple-100'
                          }`}
                          placeholder="New York"
                        />
                        {errors.city && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.city}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-900 mb-2">
                          Zip Code *
                        </label>
                        <input
                          type="text"
                          value={billingInfo.zipCode}
                          onChange={(e) => setBillingInfo({ ...billingInfo, zipCode: e.target.value })}
                          className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all text-lg ${
                            errors.zipCode
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                              : 'border-gray-300 focus:border-purple-500 focus:ring-purple-100'
                          }`}
                          placeholder="10001"
                        />
                        {errors.zipCode && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.zipCode}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-900 mb-2">
                          Country *
                        </label>
                        <select
                          value={billingInfo.country}
                          onChange={(e) => setBillingInfo({ ...billingInfo, country: e.target.value })}
                          className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all text-lg"
                        >
                          <option>United States</option>
                          <option>Canada</option>
                          <option>United Kingdom</option>
                          <option>India</option>
                          <option>Australia</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleProceedFromBilling}
                    className="mt-8 w-full px-6 py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </motion.div>
              )}

              {currentStep === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-2xl border-2 border-gray-200 p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === method.id
                            ? 'border-purple-600 bg-purple-50 shadow-lg'
                            : 'border-gray-300 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className={paymentMethod === method.id ? 'text-purple-600' : 'text-gray-600'}>
                            {method.icon}
                          </div>
                          <span className={`font-semibold text-sm ${
                            paymentMethod === method.id ? 'text-purple-900' : 'text-gray-700'
                          }`}>
                            {method.label}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-5">
                      <div>
                        <label className="block font-semibold text-gray-900 mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          value={cardInfo.cardNumber}
                          onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                          className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all text-lg ${
                            errors.cardNumber
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                              : 'border-gray-300 focus:border-purple-500 focus:ring-purple-100'
                          }`}
                          placeholder="1234 5678 9012 3456"
                        />
                        {errors.cardNumber && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.cardNumber}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-900 mb-2">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          value={cardInfo.cardName}
                          onChange={(e) => setCardInfo({ ...cardInfo, cardName: e.target.value })}
                          className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all text-lg ${
                            errors.cardName
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                              : 'border-gray-300 focus:border-purple-500 focus:ring-purple-100'
                          }`}
                          placeholder="JOHN DOE"
                        />
                        {errors.cardName && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.cardName}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className="block font-semibold text-gray-900 mb-2">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            value={cardInfo.expiryDate}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '');
                              if (value.length >= 2) {
                                value = value.slice(0, 2) + '/' + value.slice(2, 4);
                              }
                              setCardInfo({ ...cardInfo, expiryDate: value });
                            }}
                            className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all text-lg ${
                              errors.expiryDate
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                                : 'border-gray-300 focus:border-purple-500 focus:ring-purple-100'
                            }`}
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                          {errors.expiryDate && (
                            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.expiryDate}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block font-semibold text-gray-900 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            value={cardInfo.cvv}
                            onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                            className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all text-lg ${
                              errors.cvv
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                                : 'border-gray-300 focus:border-purple-500 focus:ring-purple-100'
                            }`}
                            placeholder="123"
                            maxLength={3}
                          />
                          {errors.cvv && (
                            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.cvv}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div>
                      <label className="block font-semibold text-gray-900 mb-2">
                        UPI ID
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all text-lg"
                        placeholder="yourname@upi"
                      />
                    </div>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <div>
                      <label className="block font-semibold text-gray-900 mb-2">
                        Select Bank
                      </label>
                      <select className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all text-lg">
                        <option>Select your bank</option>
                        <option>State Bank of India</option>
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>Axis Bank</option>
                      </select>
                    </div>
                  )}

                  {paymentMethod === 'wallet' && (
                    <div>
                      <label className="block font-semibold text-gray-900 mb-2">
                        Select Wallet
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {['PayPal', 'Paytm', 'PhonePe', 'Google Pay'].map((wallet) => (
                          <button
                            key={wallet}
                            className="p-4 border-2 border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all font-semibold"
                          >
                            {wallet}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {showCaptcha && (
                    <div className="mt-8 p-6 bg-gray-50 border-2 border-gray-200 rounded-xl">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-purple-600" />
                        Verify you're human
                      </h3>

                      {!showOtpFallback ? (
                        <>
                          <div className="flex items-center gap-4 mb-4">
                            <label className="flex items-center gap-3 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={captchaVerified}
                                onChange={handleCaptchaVerify}
                                className="w-6 h-6 rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
                              />
                              <span className="font-semibold text-gray-700 group-hover:text-purple-600">
                                I'm not a robot
                              </span>
                            </label>

                            <button
                              onClick={() => alert('Audio CAPTCHA would play here')}
                              className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                              title="Audio CAPTCHA"
                            >
                              <Volume2 className="w-5 h-5" />
                            </button>
                          </div>

                          <AnimatePresence>
                            {captchaVerified && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-green-600 font-semibold"
                              >
                                <CheckCircle className="w-5 h-5" />
                                Verification successful!
                              </motion.div>
                            )}

                            {captchaFailed && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-red-600 font-semibold"
                              >
                                <AlertCircle className="w-5 h-5" />
                                Please try again
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {failedAttempts >= 2 && (
                            <p className="text-sm text-gray-600 mt-3">
                              Having trouble? Try OTP or email verification instead.
                            </p>
                          )}
                        </>
                      ) : (
                        <div>
                          <p className="text-gray-700 mb-4">
                            We'll send a verification code to your phone
                          </p>
                          <div className="flex gap-3">
                            <input
                              type="text"
                              placeholder="Enter OTP"
                              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                              maxLength={6}
                            />
                            <button
                              onClick={handleOtpVerify}
                              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors"
                            >
                              Verify
                            </button>
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-gray-500 mt-4 flex items-center gap-2">
                        <Lock className="w-3 h-3" />
                        Secure payment protected by verification
                      </p>
                    </div>
                  )}

                  <div className="mt-8 flex gap-4">
                    <button
                      onClick={() => setCurrentStep('billing')}
                      className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-300 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleProceedFromPayment}
                      className="flex-1 px-6 py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <Lock className="w-5 h-5" />
                      Proceed Securely
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 'confirm' && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-2xl border-2 border-gray-200 p-8"
                >
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Order Confirmed!
                    </h2>
                    <p className="text-gray-600">
                      Thank you for your purchase. Your courses are now available.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex justify-between py-2">
                        <span className="text-gray-700">{item.title}</span>
                        <span className="font-semibold text-gray-900">${item.price}</span>
                      </div>
                    ))}
                    <div className="border-t-2 border-gray-200 mt-4 pt-4 flex justify-between">
                      <span className="text-xl font-bold text-gray-900">Total Paid:</span>
                      <span className="text-2xl font-bold text-purple-600">${totalAmount}</span>
                    </div>
                  </div>

                  <button
                    onClick={onComplete}
                    className="w-full px-6 py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition-colors"
                  >
                    Start Learning
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-2xl border-2 border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-3 mb-6">
                {cartItems.map((item, index) => (
                  <div key={index} className="pb-3 border-b border-gray-200 last:border-b-0">
                    <p className="font-semibold text-gray-900 text-sm mb-1">{item.title}</p>
                    <p className="text-gray-600 text-sm">${item.price}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t-2 border-gray-200">
                <div className="flex justify-between mb-4">
                  <span className="text-xl font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-purple-600">${totalAmount}</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span>🔒 Secure & encrypted payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
