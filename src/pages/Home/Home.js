import React from "react";
import Banner from "../../components/Banner/Banner";
import { Button } from "../../components/ui";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
    <div className="bg-white w-full">
      {/* Hero Section with Banner */}
      <section className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Column - Hero Text */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
            Build Your Electrical Skills<br /> Through Smart Learning
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Take a personalized skill test and start your journey with interactive modules tailored just for you.
          </p>
          <Link to="/quiz">
            <button className="bg-primary text-white px-6 py-3 rounded-lg text-lg font-semibold shadow hover:bg-blue-700 transition">
              Let&apos;s Start Pre Quiz
            </button>
          </Link>
        </div>

        {/* Right Column - Banner Carousel */}
        <div className="rounded-xl overflow-hidden shadow-lg">
          <Banner />
        </div>
      </section>
    </div>

    {/* About Section */}
    <section className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">About the Platform</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          We help learners build electrical skills through tailored content, interactive modules, and intelligent assessments. 
          Whether you're starting out or upskilling, our platform adapts to your needs.
        </p>
      </div>
    </section>

    {/* How It Works */}
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-primary mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-primary mb-2">1. Take the Skill Test</h3>
            <p>Start with a smart quiz to assess your current knowledge and assign your learning level.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-primary mb-2">2. Follow Guided Modules</h3>
            <p>Access beginner to advanced content based on your skill level and progress through at your own pace.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-primary mb-2">3. Track Your Growth</h3>
            <p>Monitor performance analytics and receive personalized recommendations to boost your learning.</p>
          </div>
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="py-20 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-primary mb-12">What Students Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-600 mb-4">"This platform made it so easy to understand electrical concepts. The quizzes were spot on and the progress tracking kept me motivated!"</p>
            <p className="text-sm font-semibold text-primary">— Arjun S., 2nd Year Engineering</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-600 mb-4">"The interactive wiring diagrams were amazing. I finally got confident handling real circuits thanks to the modules."</p>
            <p className="text-sm font-semibold text-primary">— Priya M., Diploma Student</p>
          </div>
        </div>
      </div>
    </section>

    {/* Final CTA */}
    <section className="py-16 bg-primary text-white text-center">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-4">Ready to Empower Your Electrical Journey?</h2>
        <p className="text-lg mb-6">Join now and take the first step towards mastering real-world skills that matter.</p>
        <a href="/register" className="bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition">Join Now</a>
      </div>
    </section>

    
  </div>
  );
};

export default Home;
