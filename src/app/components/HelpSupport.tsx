import { useState, useEffect } from 'react';
import {
  ArrowLeft, Search, HelpCircle, CreditCard, Lock, Book, Settings,
  Smartphone, ChevronDown, ChevronRight, ThumbsUp, ThumbsDown,
  MessageCircle, X, Send, CheckCircle, AlertCircle, Mail, Phone, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HelpSupportProps {
  onBack: () => void;
  context?: 'payment' | 'login' | 'course' | 'general';
}

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  helpful?: boolean;
}

interface HelpCategory {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

type WizardStep = 'select-issue' | 'select-sub-issue' | 'solution';

export function HelpSupport({ onBack, context = 'general' }: HelpSupportProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; sender: 'user' | 'assistant' }>>([
    { text: 'Hi! How can I help you today?', sender: 'assistant' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<WizardStep>('select-issue');
  const [selectedIssue, setSelectedIssue] = useState('');
  const [selectedSubIssue, setSelectedSubIssue] = useState('');
  const [faqFeedback, setFaqFeedback] = useState<Record<string, boolean>>({});
  const [activeSearchQuery, setActiveSearchQuery] = useState('');

  const categories: HelpCategory[] = [
    {
      id: 'payment',
      icon: <CreditCard className="w-8 h-8" />,
      title: 'Payment & Billing',
      description: 'Refunds, payment methods, invoices',
      color: 'bg-green-100 text-green-600',
    },
    {
      id: 'account',
      icon: <Lock className="w-8 h-8" />,
      title: 'Account & Login',
      description: 'Password reset, account recovery',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'courses',
      icon: <Book className="w-8 h-8" />,
      title: 'Courses & Content',
      description: 'Access issues, downloads, certificates',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      id: 'technical',
      icon: <Settings className="w-8 h-8" />,
      title: 'Technical Issues',
      description: 'Video playback, bugs, errors',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      id: 'mobile',
      icon: <Smartphone className="w-8 h-8" />,
      title: 'Mobile App',
      description: 'Download, sync, offline viewing',
      color: 'bg-pink-100 text-pink-600',
    },
  ];

  const faqs: FAQ[] = [
    {
      id: '1',
      category: 'payment',
      question: 'How do I request a refund?',
      answer: 'You can request a refund within 30 days of purchase. Go to My Learning, select the course, click "Request Refund" and follow the steps. Refunds are processed within 5-10 business days.',
    },
    {
      id: '2',
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers in select regions.',
    },
    {
      id: '3',
      category: 'account',
      question: 'I forgot my password. How do I reset it?',
      answer: 'Click "Forgot Password" on the login page, enter your email, and we\'ll send you a reset link. The link expires in 24 hours.',
    },
    {
      id: '4',
      category: 'account',
      question: 'Can I change my email address?',
      answer: 'Yes! Go to Settings > Account > Email Address. You\'ll need to verify your new email before the change takes effect.',
    },
    {
      id: '5',
      category: 'courses',
      question: 'Why can\'t I access my course?',
      answer: 'Check if your payment was successful and if you\'re logged into the correct account. If the issue persists, contact support with your order number.',
    },
    {
      id: '6',
      category: 'courses',
      question: 'How do I download course materials?',
      answer: 'Open the course, go to the Resources tab, and click the download icon next to each file. Some courses may restrict downloads based on instructor settings.',
    },
    {
      id: '7',
      category: 'technical',
      question: 'Video won\'t play. What should I do?',
      answer: 'Try refreshing the page, clearing your browser cache, or switching browsers. Ensure your internet connection is stable. If using mobile, try the app instead.',
    },
    {
      id: '8',
      category: 'mobile',
      question: 'How do I download courses for offline viewing?',
      answer: 'In the mobile app, tap the download icon next to the lesson. You can manage downloads in Settings > Downloads.',
    },
  ];

  const wizardIssues = [
    { id: 'payment', label: 'Payment & Refunds', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'access', label: 'Cannot Access Course', icon: <Lock className="w-5 h-5" /> },
    { id: 'video', label: 'Video Not Playing', icon: <AlertCircle className="w-5 h-5" /> },
    { id: 'account', label: 'Account Issues', icon: <Settings className="w-5 h-5" /> },
  ];

  const wizardSubIssues: Record<string, Array<{ id: string; label: string }>> = {
    payment: [
      { id: 'refund', label: 'Request a refund' },
      { id: 'charge', label: 'Unexpected charge' },
      { id: 'method', label: 'Change payment method' },
    ],
    access: [
      { id: 'login', label: 'Cannot log in' },
      { id: 'enrolled', label: 'Course not showing' },
      { id: 'locked', label: 'Content is locked' },
    ],
    video: [
      { id: 'buffer', label: 'Video keeps buffering' },
      { id: 'load', label: 'Video won\'t load' },
      { id: 'quality', label: 'Poor video quality' },
    ],
    account: [
      { id: 'password', label: 'Reset password' },
      { id: 'email', label: 'Change email' },
      { id: 'delete', label: 'Delete account' },
    ],
  };

  const solutions: Record<string, string> = {
    refund: 'Go to My Learning → Select Course → Request Refund. Refunds are processed within 5-10 days.',
    charge: 'Check your purchase history in Account Settings. If you see an unauthorized charge, contact support immediately.',
    method: 'Go to Settings → Payment Methods → Add or remove payment methods.',
    login: 'Click "Forgot Password" on the login page. If you still can\'t access, contact support.',
    enrolled: 'Check if payment was successful. Go to Purchase History to verify. Contact support if needed.',
    locked: 'Ensure you\'re logged in and have completed prerequisite lessons if required.',
    buffer: 'Lower video quality, check internet speed, or try a different browser.',
    load: 'Clear browser cache, disable extensions, or try incognito mode.',
    quality: 'Click the settings icon in the video player and select a higher quality.',
    password: 'Use the "Forgot Password" link on the login page. Check your email for the reset link.',
    email: 'Go to Settings → Account → Change Email. Verify your new email to complete the change.',
    delete: 'Contact support to request account deletion. This action is permanent.',
  };

  // Priority category based on context
  const priorityCategory = context === 'payment' ? 'payment' :
                          context === 'login' ? 'account' :
                          context === 'course' ? 'courses' : null;

  // Search suggestions
  const searchSuggestions = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const filteredFAQs = activeSearchQuery
    ? faqs.filter(faq =>
        faq.question.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(activeSearchQuery.toLowerCase())
      )
    : priorityCategory
    ? [...faqs.filter(f => f.category === priorityCategory), ...faqs.filter(f => f.category !== priorityCategory)]
    : faqs;

  // Smart suggestions for no results
  const getSmartSuggestions = (query: string) => {
    const suggestions: Array<{ id: string; title: string; description: string }> = [];
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('stuck') || lowerQuery.includes('not working') || lowerQuery.includes('problem')) {
      suggestions.push(
        { id: '3', title: 'Troubleshooting login issues', description: 'Reset password and account recovery' },
        { id: '7', title: 'Video playback problems', description: 'Fix video loading and buffering issues' },
        { id: '5', title: 'Course access issues', description: 'Why you can\'t access your course' }
      );
    } else if (lowerQuery.includes('pay') || lowerQuery.includes('charge') || lowerQuery.includes('bill')) {
      suggestions.push(
        { id: '1', title: 'Request a refund', description: 'How to get your money back' },
        { id: '2', title: 'Payment methods', description: 'Accepted payment options' }
      );
    } else if (lowerQuery.includes('download') || lowerQuery.includes('save') || lowerQuery.includes('offline')) {
      suggestions.push(
        { id: '6', title: 'Download course materials', description: 'How to download resources' },
        { id: '8', title: 'Offline viewing', description: 'Download courses for offline access' }
      );
    } else {
      // Default suggestions
      suggestions.push(
        { id: '3', title: 'Password reset help', description: 'Recover your account' },
        { id: '5', title: 'Course access problems', description: 'Troubleshoot enrollment issues' },
        { id: '1', title: 'Refund requests', description: 'Get help with refunds' }
      );
    }

    return suggestions;
  };

  // Did you mean functionality
  const getDidYouMean = (query: string): string | null => {
    const corrections: Record<string, string> = {
      'stuk': 'stuck',
      'stuked': 'stuck',
      'loging': 'login',
      'loggin': 'login',
      'pasword': 'password',
      'paswrd': 'password',
      'refnd': 'refund',
      'donload': 'download',
      'acess': 'access',
      'acces': 'access',
    };

    const lowerQuery = query.toLowerCase();
    for (const [typo, correct] of Object.entries(corrections)) {
      if (lowerQuery.includes(typo)) {
        return lowerQuery.replace(typo, correct);
      }
    }
    return null;
  };

  const hasSearchResults = filteredFAQs.length > 0;
  const didYouMean = activeSearchQuery && !hasSearchResults ? getDidYouMean(activeSearchQuery) : null;
  const smartSuggestions = activeSearchQuery && !hasSearchResults ? getSmartSuggestions(activeSearchQuery) : [];

  const handleSearch = () => {
    setActiveSearchQuery(searchQuery);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    setChatMessages([...chatMessages, { text: chatInput, sender: 'user' }]);
    setChatInput('');

    // Simulate assistant response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        text: 'Thank you for your question! Let me help you with that. Could you provide more details?',
        sender: 'assistant'
      }]);
    }, 1000);
  };

  const handleFAQFeedback = (faqId: string, helpful: boolean) => {
    setFaqFeedback({ ...faqFeedback, [faqId]: helpful });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
              <p className="text-gray-600 mt-1">We're here to help you succeed</p>
            </div>
          </div>

          {/* Smart Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search your issue (e.g., refund, login problem…)"
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all text-lg"
            />
            <button
              onClick={handleSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Search
            </button>

            {/* Live Suggestions */}
            <AnimatePresence>
              {searchQuery && searchSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border-2 border-gray-100 overflow-hidden z-50"
                >
                  {searchSuggestions.map((faq) => (
                    <button
                      key={faq.id}
                      onClick={() => {
                        setExpandedFAQ(faq.id);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <p className="font-semibold text-gray-900">{faq.question}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">{faq.answer}</p>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Context Banner */}
        {priorityCategory && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-6"
          >
            <div className="flex items-start gap-4">
              <HelpCircle className="w-8 h-8 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-2">We noticed you came from {context}</h3>
                <p className="text-purple-100">Here are some common {context}-related issues we can help with:</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">How can we help you?</h2>
            <button
              onClick={() => setWizardOpen(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Fix My Issue
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSearchQuery(category.title.toLowerCase())}
                className={`text-left p-6 bg-white rounded-2xl border-2 transition-all hover:shadow-xl hover:scale-105 active:scale-95 ${
                  category.id === priorityCategory
                    ? 'border-purple-600 ring-4 ring-purple-100'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className={`w-16 h-16 ${category.color} rounded-xl flex items-center justify-center mb-4`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600">{category.description}</p>
                {category.id === priorityCategory && (
                  <span className="inline-block mt-3 px-3 py-1 bg-purple-600 text-white text-sm font-semibold rounded-full">
                    Recommended
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* No Results State */}
        {activeSearchQuery && !hasSearchResults ? (
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              {/* Illustration */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="mb-8"
              >
                <div className="w-32 h-32 mx-auto bg-purple-100 rounded-full flex items-center justify-center relative">
                  <HelpCircle className="w-16 h-16 text-purple-400" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center"
                  >
                    <span className="text-2xl">😕</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Message */}
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                We couldn't find a direct answer for "{activeSearchQuery}" 😕
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                But here are some things that might help you
              </p>

              {/* Did You Mean */}
              {didYouMean && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-4 max-w-md mx-auto"
                >
                  <p className="text-gray-700">
                    Did you mean:{' '}
                    <button
                      onClick={() => {
                        setSearchQuery(didYouMean);
                        setActiveSearchQuery(didYouMean);
                      }}
                      className="font-bold text-blue-600 hover:text-blue-700 underline"
                    >
                      "{didYouMean}"
                    </button>
                    ?
                  </p>
                </motion.div>
              )}

              {/* Smart Suggestions */}
              <div className="max-w-3xl mx-auto mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Related help topics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {smartSuggestions.map((suggestion) => (
                    <motion.button
                      key={suggestion.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setExpandedFAQ(suggestion.id)}
                      className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-lg transition-all text-left"
                    >
                      <h4 className="font-bold text-gray-900 mb-2">{suggestion.title}</h4>
                      <p className="text-sm text-gray-600">{suggestion.description}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Recovery Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button
                  onClick={() => setChatOpen(true)}
                  className="px-8 py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat with Support
                </button>

                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveSearchQuery('');
                  }}
                  className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-purple-500 hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Refine Search
                </button>

                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveSearchQuery('');
                  }}
                  className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-purple-500 hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
                >
                  <Book className="w-5 h-5" />
                  Browse Help Topics
                </button>
              </div>

              {/* Still Need Help Section */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border-2 border-purple-200 max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Still need help?</h3>
                </div>
                <p className="text-gray-700 mb-6 text-center">
                  Our support team is here for you. Choose your preferred way to connect:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setChatOpen(true)}
                    className="p-4 bg-white rounded-xl hover:shadow-lg transition-all border-2 border-transparent hover:border-purple-500"
                  >
                    <MessageCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-bold text-gray-900 mb-1">Live Chat</h4>
                    <p className="text-sm text-gray-600">Get instant answers</p>
                    <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                      Online now
                    </span>
                  </button>

                  <a
                    href="mailto:support@learnhub.com"
                    className="p-4 bg-white rounded-xl hover:shadow-lg transition-all border-2 border-transparent hover:border-purple-500"
                  >
                    <Mail className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-bold text-gray-900 mb-1">Email</h4>
                    <p className="text-sm text-gray-600">support@learnhub.com</p>
                    <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                      24hr response
                    </span>
                  </a>

                  <a
                    href="tel:+1-800-123-4567"
                    className="p-4 bg-white rounded-xl hover:shadow-lg transition-all border-2 border-transparent hover:border-purple-500"
                  >
                    <Phone className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-bold text-gray-900 mb-1">Phone</h4>
                    <p className="text-sm text-gray-600">1-800-123-4567</p>
                    <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-semibold">
                      Mon-Fri 9-5 EST
                    </span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <>
            {/* FAQ Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {activeSearchQuery
                  ? `Search results for "${activeSearchQuery}" (${filteredFAQs.length})`
                  : 'Frequently Asked Questions'}
              </h2>
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-bold text-lg text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-6 h-6 text-gray-600 flex-shrink-0 transition-transform ${
                      expandedFAQ === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {expandedFAQ === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-gray-200 pt-4">
                        <p className="text-gray-700 leading-relaxed mb-4">{faq.answer}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600 font-semibold">Was this helpful?</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleFAQFeedback(faq.id, true)}
                              className={`p-2 rounded-lg transition-all ${
                                faqFeedback[faq.id] === true
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                              }`}
                            >
                              <ThumbsUp className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleFAQFeedback(faq.id, false)}
                              className={`p-2 rounded-lg transition-all ${
                                faqFeedback[faq.id] === false
                                  ? 'bg-red-100 text-red-600'
                                  : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                              }`}
                            >
                              <ThumbsDown className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border-2 border-purple-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Still need help?</h2>
              <p className="text-gray-700 mb-6">
                Our support team is available 24/7 to assist you. Get a response within 2 hours.
              </p>
              <button
                onClick={() => setChatOpen(true)}
                className="px-8 py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                Contact Support Team
              </button>
            </div>
          </>
        )}
      </div>

      {/* Floating Chat Button */}
      <AnimatePresence>
        {!chatOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setChatOpen(true)}
            className="fixed bottom-8 right-8 w-16 h-16 bg-purple-600 text-white rounded-full shadow-2xl hover:bg-purple-700 transition-all flex items-center justify-center hover:scale-110 z-50"
          >
            <MessageCircle className="w-8 h-8" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-8 right-8 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden z-50 flex flex-col"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">Support Assistant</h3>
                  <p className="text-sm text-purple-100">Online</p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guided Help Wizard */}
      <AnimatePresence>
        {wizardOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-auto shadow-2xl"
            >
              {/* Wizard Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 sticky top-0">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Fix My Issue</h2>
                  <button
                    onClick={() => {
                      setWizardOpen(false);
                      setWizardStep('select-issue');
                      setSelectedIssue('');
                      setSelectedSubIssue('');
                    }}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`flex-1 h-2 rounded-full ${wizardStep !== 'select-issue' ? 'bg-white' : 'bg-white/30'}`}></div>
                  <div className={`flex-1 h-2 rounded-full ${wizardStep === 'solution' ? 'bg-white' : 'bg-white/30'}`}></div>
                </div>
              </div>

              <div className="p-6">
                {wizardStep === 'select-issue' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">What issue are you experiencing?</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {wizardIssues.map((issue) => (
                        <button
                          key={issue.id}
                          onClick={() => {
                            setSelectedIssue(issue.id);
                            setWizardStep('select-sub-issue');
                          }}
                          className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-600 rounded-xl transition-all text-left group"
                        >
                          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            {issue.icon}
                          </div>
                          <span className="flex-1 font-semibold text-gray-900">{issue.label}</span>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {wizardStep === 'select-sub-issue' && selectedIssue && (
                  <div>
                    <button
                      onClick={() => setWizardStep('select-issue')}
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Choose the specific issue:</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {wizardSubIssues[selectedIssue]?.map((subIssue) => (
                        <button
                          key={subIssue.id}
                          onClick={() => {
                            setSelectedSubIssue(subIssue.id);
                            setWizardStep('solution');
                          }}
                          className="p-4 bg-gray-50 hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-600 rounded-xl transition-all text-left font-medium text-gray-900"
                        >
                          {subIssue.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {wizardStep === 'solution' && selectedSubIssue && (
                  <div>
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Here's how to fix it:</h3>
                    <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 mb-6">
                      <p className="text-lg text-gray-900 leading-relaxed">{solutions[selectedSubIssue]}</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setWizardOpen(false);
                          setWizardStep('select-issue');
                          setSelectedIssue('');
                          setSelectedSubIssue('');
                        }}
                        className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors"
                      >
                        Done
                      </button>
                      <button
                        onClick={() => setChatOpen(true)}
                        className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                      >
                        Still Need Help
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
