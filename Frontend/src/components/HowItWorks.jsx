import React from 'react';
import { Search, Calendar, Monitor, Award } from 'lucide-react';
const HowItWorks = () => {
  const steps = [{
    icon: <Search className="h-12 w-12 text-blue-600" />,
    title: 'Find Your Subject',
    description: 'Browse our extensive catalog of subjects and select the ones you need help with.'
  }, {
    icon: <Calendar className="h-12 w-12 text-blue-600" />,
    title: 'Schedule Classes',
    description: 'Choose a convenient time slot that fits your schedule for live online sessions.'
  }, {
    icon: <Monitor className="h-12 w-12 text-blue-600" />,
    title: 'Attend Online Classes',
    description: 'Join interactive virtual classes from the comfort of your home.'
  }, {
    icon: <Award className="h-12 w-12 text-blue-600" />,
    title: 'Track Your Progress',
    description: 'Monitor your improvement with regular assessments and personalized feedback.'
  }];
  return <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Getting started with our online tuition is simple and
            straightforward.
          </p>
        </div>
        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-24 left-0 w-full h-1 bg-blue-200 z-0"></div>
          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => <div key={index} className="flex flex-col items-center text-center">
                <div className="bg-white p-4 rounded-full border-2 border-blue-600 mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>)}
          </div>
        </div>
        <div className="text-center mt-16">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300 font-medium">
            Get Started Today
          </button>
        </div>
      </div>
    </div>;
};
export default HowItWorks;