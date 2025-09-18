import React from 'react';
import { Calculator, Code, Globe, BookOpen, Atom, Music, Database, Brush } from 'lucide-react';
const SubjectsSection = () => {
  const subjects = [{
    icon: <Calculator className="h-8 w-8 text-blue-600" />,
    name: 'Mathematics',
    description: 'Algebra, Calculus, Geometry, Statistics',
    color: 'bg-blue-50'
  }, {
    icon: <Atom className="h-8 w-8 text-purple-600" />,
    name: 'Sciences',
    description: 'Physics, Chemistry, Biology',
    color: 'bg-purple-50'
  }, {
    icon: <Globe className="h-8 w-8 text-green-600" />,
    name: 'Languages',
    description: 'English, Spanish, French, Mandarin',
    color: 'bg-green-50'
  }, {
    icon: <BookOpen className="h-8 w-8 text-yellow-600" />,
    name: 'Humanities',
    description: 'History, Literature, Philosophy',
    color: 'bg-yellow-50'
  }, {
    icon: <Code className="h-8 w-8 text-red-600" />,
    name: 'Computer Science',
    description: 'Programming, Web Development, AI',
    color: 'bg-red-50'
  }, {
    icon: <Music className="h-8 w-8 text-indigo-600" />,
    name: 'Music',
    description: 'Theory, Instruments, Composition',
    color: 'bg-indigo-50'
  }, {
    icon: <Database className="h-8 w-8 text-pink-600" />,
    name: 'Test Prep',
    description: 'SAT, ACT, GRE, GMAT',
    color: 'bg-pink-50'
  }, {
    icon: <Brush className="h-8 w-8 text-orange-600" />,
    name: 'Arts',
    description: 'Drawing, Painting, Design',
    color: 'bg-orange-50'
  }];
  return <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Explore Our Subjects
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We offer a wide range of subjects taught by expert tutors to help
            you excel in your academic journey.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((subject, index) => <div key={index} className={`${subject.color} p-6 rounded-lg hover:shadow-md transition duration-300 cursor-pointer`}>
              <div className="mb-4">{subject.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {subject.name}
              </h3>
              <p className="text-gray-600">{subject.description}</p>
            </div>)}
        </div>
        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300 font-medium">
            View All Subjects
          </button>
        </div>
      </div>
    </div>;
};
export default SubjectsSection;