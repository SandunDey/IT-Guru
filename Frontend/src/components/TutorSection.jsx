import React from 'react';
const TutorSection = () => {
  const tutors = [{
    name: 'Dr. Michael Brown',
    subject: 'Mathematics',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    experience: '15+ years teaching experience',
    education: 'Ph.D. in Mathematics, Stanford University'
  }, {
    name: 'Prof. Jennifer Lee',
    subject: 'Sciences',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    experience: '12 years teaching experience',
    education: 'Ph.D. in Chemistry, MIT'
  }, {
    name: 'Mr. Robert Garcia',
    subject: 'Computer Science',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    experience: '10+ years industry and teaching experience',
    education: 'M.S. in Computer Science, Berkeley'
  }, {
    name: 'Ms. Sarah Johnson',
    subject: 'Languages',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    experience: '8 years teaching experience',
    education: 'M.A. in Linguistics, Oxford University'
  }];
  return <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Meet Our Expert Tutors
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Learn from highly qualified educators with years of teaching
            experience.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tutors.map((tutor, index) => <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md transition duration-300 hover:shadow-xl">
              <div className="h-64 overflow-hidden">
                <img src={tutor.image} alt={tutor.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-1 text-gray-900">
                  {tutor.name}
                </h3>
                <p className="text-blue-600 font-medium mb-3">
                  {tutor.subject}
                </p>
                <p className="text-gray-600 text-sm mb-1">{tutor.experience}</p>
                <p className="text-gray-600 text-sm">{tutor.education}</p>
              </div>
            </div>)}
        </div>
        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300 font-medium">
            View All Tutors
          </button>
        </div>
      </div>
    </div>;
};
export default TutorSection;