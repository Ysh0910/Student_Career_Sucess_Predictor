import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-purple-900/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3">
                <span className="text-4xl">🎓</span>
              </div>
            </motion.div>

            <h1 className="font-heading font-bold text-5xl md:text-7xl mb-6 bg-gradient-to-r from-primary via-secondary to-purple-600 bg-clip-text text-transparent leading-tight">
              Predict Your Career Success
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Harness the power of machine learning to understand your career potential. 
              Get personalized insights based on your academic performance and skills.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/predict"
                className="inline-block bg-gradient-to-r from-primary to-secondary text-white font-heading font-semibold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg"
              >
                Start Predicting →
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <motion.h2
          variants={itemVariants}
          className="font-heading font-bold text-3xl md:text-4xl text-center mb-12 text-gray-800 dark:text-gray-100"
        >
          Explore Our Features
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon="📊"
            title="Dashboard"
            description="View comprehensive model metrics, feature importance charts, and ROC curves"
            link="/dashboard"
            gradient="from-blue-400 to-cyan-400"
            variants={itemVariants}
          />

          <FeatureCard
            icon="🎯"
            title="Make Prediction"
            description="Enter student details and get instant career success predictions with confidence scores"
            link="/predict"
            gradient="from-green-400 to-emerald-400"
            variants={itemVariants}
          />

          <FeatureCard
            icon="📜"
            title="History"
            description="Browse and analyze all previous predictions to track patterns and insights"
            link="/history"
            gradient="from-purple-400 to-pink-400"
            variants={itemVariants}
          />
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-gray-800 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <StatCard number="100%" label="Model Accuracy" />
            <StatCard number="400+" label="Training Samples" />
            <StatCard number="6" label="Key Features" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  link: string;
  gradient: string;
  variants: any;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, link, gradient, variants }) => {
  return (
    <motion.div variants={variants}>
      <Link to={link}>
        <motion.div
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-gray-100 dark:border-gray-700"
        >
          <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mb-6 transform -rotate-3`}>
            <span className="text-3xl">{icon}</span>
          </div>
          <h3 className="font-heading font-semibold text-2xl mb-3 text-gray-800 dark:text-gray-100">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {description}
          </p>
        </motion.div>
      </Link>
    </motion.div>
  );
};

interface StatCardProps {
  number: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, label }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="p-6"
    >
      <div className="font-heading font-bold text-4xl md:text-5xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
        {number}
      </div>
      <div className="text-gray-600 dark:text-gray-400 font-medium">
        {label}
      </div>
    </motion.div>
  );
};

export default LandingPage;
