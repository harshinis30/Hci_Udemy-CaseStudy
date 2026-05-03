import { motion } from 'motion/react';
import { Target, Sparkles, Code, Brain } from 'lucide-react';
import imgHero from 'figma:asset/image.png';

export function Hero() {
  const floatingIcons = [
    { Icon: Code, color: 'bg-purple-100', position: { top: '20%', left: '15%' }, delay: 0 },
    { Icon: Brain, color: 'bg-blue-100', position: { top: '60%', left: '10%' }, delay: 0.5 },
    { Icon: Sparkles, color: 'bg-pink-100', position: { top: '30%', right: '20%' }, delay: 1 },
    { Icon: Target, color: 'bg-yellow-100', position: { bottom: '25%', right: '15%' }, delay: 1.5 },
  ];

  const handleGetPlan = () => {
    window.location.href = '/pricing';
  };

  const handleLearnAI = () => {
    window.location.href = '/courses/ai';
  };

  return (
    <section className="relative bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 overflow-hidden">
      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, color, position, delay }, index) => (
        <motion.div
          key={index}
          className={`absolute ${color} p-4 rounded-2xl shadow-lg hidden lg:block`}
          style={position}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Icon className="w-8 h-8 text-purple-600" />
        </motion.div>
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white z-10">
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Build in-demand skills
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl mb-8 text-purple-100 leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Get access to 20,000+ courses that real experts built. Learn at your own pace with easy-to-follow videos.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <button
                onClick={handleGetPlan}
                className="group px-8 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all flex items-center gap-2 min-w-[200px] justify-center"
              >
                <Target className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Get Personal Plan
              </button>

              <button
                onClick={handleLearnAI}
                className="group px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-purple-600 transition-all hover:shadow-2xl flex items-center gap-2 min-w-[150px] justify-center"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Learn AI
              </button>
            </motion.div>
          </div>

          {/* Image */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={imgHero}
                alt="Student learning"
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto">
          <path
            fill="#ffffff"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}
