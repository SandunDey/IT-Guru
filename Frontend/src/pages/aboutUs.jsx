import { motion } from "framer-motion";
import Header from "../components/header";
import Footer from "../components/footer";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 text-primary">
      <Header />

      {/* Hero Section */}
      <section className="py-16 px-6 text-center">
        <motion.img
          src="/logo.jpg"
          alt="ITGuru Logo"
          className="w-35 h-35 mx-auto mb-6 mt-20 rounded-full border-4 border-boardercolor shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        />

        <h1 className="text-4xl md:text-5xl font-bold text-accent mb-4">
          About <span className="text-blue-700"> ITGuru</span>
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed text-gray-700">
          <span className="text-blue-700 font-semibold">ITGuru</span> is an
          innovative e-Tutoring platform that empowers{" "}
          <span className="font-semibold">students</span> and{" "}
          <span className="font-semibold">parents</span> through high-quality
          learning resources, interactive sessions, and continuous academic
          support.
        </p>
      </section>

      {/* Teacher Section */}
      <section className="py-16 px-6 bg-white shadow-inner">
        <div className="flex flex-col md:flex-row items-center gap-10 max-w-5xl mx-auto">
          <motion.img
            src="sir.jpg"
            alt="Teacher"
            className="w-60 h-60 object-cover rounded-full border-4 border-boardercolor shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          />
          <div>
            <h2 className="text-2xl font-semibold text-accent mb-3">
              Meet Our Teacher: Mr. Janaka Wicramage
            </h2>
            <div className="text-gray-700 max-w-3xl mx-auto space-y-4">
              <p>
                <span className="font-semibold">Mr. Janaka Wicramage</span> is a
                highly experienced IT educator with a degree from Colombo
                University, bringing both academic excellence and practical
                expertise to his teaching. With over 20 years of experience in
                tutoring students, he has successfully guided countless learners
                to achieve their goals and excel in IT studies.
              </p>

              <p>
                Known for his patient, clear, and engaging teaching style, Mr.
                Wicramage has a proven track record of helping students
                understand complex concepts with ease. His dedication extends
                beyond the classroom, as he is committed to nurturing curiosity,
                critical thinking, and problem-solving skills in every learner.
              </p>

              <p>
                Respected by students, parents, and peers alike, he has built a
                reputation for consistently delivering high-quality education
                and personalized guidance, ensuring that each student reaches
                their full potential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Students & Parents Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-accent/10 via-white to-accent/10">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg"
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-xl font-semibold text-accent mb-2">
              For Students
            </h3>
            <p className="text-gray-700">
              Students get interactive live classes, resources, progress
              tracking, and engaging sessions to strengthen their IT knowledge.
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg"
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-accent mb-2">
              For Parents
            </h3>
            <p className="text-gray-700">
              Parents can monitor attendance, track performance, manage payments
              and receive updates about their child’s learning journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Why Choose */}
      <section className="py-16 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-accent mb-4">Our Mission</h2>
        <p className="mb-10 text-gray-700">
          To make quality education accessible by combining modern technology
          with expert teaching guidance.
        </p>

        <h2 className="text-3xl font-bold text-accent mb-6">
          Why Choose ITGuru?
        </h2>
        <ul className="list-disc list-inside space-y-2 text-left mx-auto max-w-xl text-gray-700">
          <li>Expert teachers with IT experience</li>
          <li>Live interactive online sessions</li>
          <li>Progress tracking & feedback</li>
          <li>Flexible schedules</li>
          <li>Affordable online education</li>
        </ul>
      </section>

      <Footer/>
    </div>
  );
}
