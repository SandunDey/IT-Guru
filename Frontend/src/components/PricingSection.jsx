import React from 'react';
import { CheckIcon } from 'lucide-react';
const PricingSection = () => {
  const plans = [{
    name: 'Basic',
    price: '$49',
    period: 'per month',
    description: 'Perfect for occasional help with homework and assignments',
    features: ['4 live sessions per month', 'Access to recorded lessons', 'Homework help', 'Email support'],
    highlighted: false,
    buttonText: 'Get Started'
  }, {
    name: 'Standard',
    price: '$99',
    period: 'per month',
    description: 'Ideal for regular academic support and improvement',
    features: ['8 live sessions per month', 'Access to recorded lessons', 'Homework & assignment help', 'Practice tests and quizzes', 'Priority email support', 'Progress tracking'],
    highlighted: true,
    buttonText: 'Get Started'
  }, {
    name: 'Premium',
    price: '$199',
    period: 'per month',
    description: 'Comprehensive support for serious academic achievement',
    features: ['Unlimited live sessions', 'Access to all recorded lessons', 'Homework & assignment help', 'Custom study plans', 'Practice tests and quizzes', '24/7 priority support', 'Detailed progress reports'],
    highlighted: false,
    buttonText: 'Get Started'
  }];
  return <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your learning needs and budget.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => <div key={index} className={`bg-white rounded-lg overflow-hidden shadow-md ${plan.highlighted ? 'ring-2 ring-blue-600 transform scale-105' : ''}`}>
              {plan.highlighted && <div className="bg-blue-600 text-white text-center py-2 font-medium">
                  Most Popular
                </div>}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="ml-1 text-gray-500">{plan.period}</span>
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => <li key={i} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>)}
                </ul>
                <button className={`w-full py-3 px-4 rounded-md font-medium transition duration-300 ${plan.highlighted ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                  {plan.buttonText}
                </button>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
};
export default PricingSection;