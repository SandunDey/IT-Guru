import React from 'react';
import { BookOpenIcon, GraduationCapIcon, UsersIcon } from 'lucide-react';
const HeroSection = () => {
  return <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
              Learn From Anywhere,{' '}
              <span className="text-blue-600">Anytime</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Quality education delivered online by expert tutors. Personalized
              learning experiences designed to help you excel in your studies.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300 font-medium">
                Get Started
              </button>
              <button className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 transition duration-300 font-medium">
                Browse Courses
              </button>
            </div>
            <div className="mt-10 flex items-center space-x-8">
              <div className="flex items-center">
                <GraduationCapIcon className="h-6 w-6 text-blue-600 mr-2" />
                <span className="text-gray-700 font-medium">50+ Subjects</span>
              </div>
              <div className="flex items-center">
                <UsersIcon className="h-6 w-6 text-blue-600 mr-2" />
                <span className="text-gray-700 font-medium">Expert Tutors</span>
              </div>
              <div className="flex items-center">
                <BookOpenIcon className="h-6 w-6 text-blue-600 mr-2" />
                <span className="text-gray-700 font-medium">Live Classes</span>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img src="https://images.unsplash.com/photo-1610484826967-09c5720778c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" alt="Student learning online" className="rounded-lg shadow-xl" />
          </div>
        </div>
      </div>
    </div>;
};
export default HeroSection;