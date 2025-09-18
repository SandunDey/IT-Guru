import React from 'react';
import { MonitorIcon, ClockIcon, UsersIcon, BookOpenIcon, AwardIcon, MessageSquareIcon } from 'lucide-react';
const FeaturesSection = () => {
  const features = [{
    icon: <MonitorIcon className="h-10 w-10 text-blue-600" />,
    title: 'Interactive Online Classes',
    description: 'Engage in real-time with tutors through our interactive virtual classroom environment.'
  }, {
    icon: <ClockIcon className="h-10 w-10 text-blue-600" />,
    title: 'Flexible Scheduling',
    description: 'Choose class times that fit your schedule with 24/7 availability.'
  }, {
    icon: <UsersIcon className="h-10 w-10 text-blue-600" />,
    title: 'Personalized Attention',
    description: 'Get individualized support with small class sizes and one-on-one sessions.'
  }, {
    icon: <BookOpenIcon className="h-10 w-10 text-blue-600" />,
    title: 'Comprehensive Resources',
    description: 'Access a wide range of study materials, practice tests, and recorded sessions.'
  }, {
    icon: <AwardIcon className="h-10 w-10 text-blue-600" />,
    title: 'Certified Tutors',
    description: 'Learn from qualified educators with proven teaching experience.'
  }, {
    icon: <MessageSquareIcon className="h-10 w-10 text-blue-600" />,
    title: 'Instant Support',
    description: 'Get your questions answered quickly through our messaging platform.'
  }];
  return <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Why Choose Our E-Tuition Classes?
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We provide a comprehensive online learning experience with features
            designed to help you succeed.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => <div key={index} className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition duration-300">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>)}
        </div>
      </div>
    </div>;
};
export default FeaturesSection;