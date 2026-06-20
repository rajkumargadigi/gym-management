import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Dumbbell, Shield, Award, Users, Star, ArrowRight, Zap, Target, Activity } from 'lucide-react';

const Home = () => {
  const trainers = [
    { name: 'Marcus Steel', role: 'Strength & Conditioning', experience: '8+ Years Exp' },
    { name: 'Sarah Vance', role: 'Yoga & Pilates Lead', experience: '6+ Years Exp' },
    { name: 'Leo Sterling', role: 'Zumba & Cardio Trainer', experience: '5+ Years Exp' }
  ];

  const testimonials = [
    { name: 'David Miller', text: 'Iron House completely transformed my lifestyle. The trainers are top-notch and the facilities are world-class!', role: 'Member since 2024' },
    { name: 'Emily Watson', text: 'I love the group classes. The zumba and strength routines keep me motivated every single week.', role: 'Member since 2025' }
  ];

  return (
    <div className="min-h-screen bg-gymBlack text-white flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 px-4">
        {/* Glow Effects */}
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gymRed/15 blur-[130px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gymRed/10 blur-[130px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center z-10 space-y-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gymRed/10 border border-gymRed/30 rounded-full text-gymRed text-sm font-semibold tracking-wide uppercase">
            <Zap className="h-4 w-4" />
            <span>Unlock Your Potential</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight leading-none text-white">
            BE STRONGER THAN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gymRed to-red-500">YOUR EXCUSES</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 font-light leading-relaxed">
            Welcome to the ultimate arena of self-transformation. Equip yourself with premium coaching, state-of-the-art facilities, and a relentless community.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-gymRed hover:bg-gymRed-dark text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.03] shadow-xl flex items-center justify-center space-x-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/membership"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold transition-all duration-300 flex items-center justify-center"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-24 bg-gymBlack-dark relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Graphics/Grid */}
            <div className="grid grid-cols-2 gap-6 relative">
              <div className="absolute inset-0 bg-gymRed/5 blur-3xl pointer-events-none"></div>
              <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-4">
                <Shield className="h-10 w-10 text-gymRed" />
                <h3 className="text-xl font-bold text-white">Safe Environment</h3>
                <p className="text-gray-400 text-sm font-light">Strict hygiene controls and secure lock system for all members.</p>
              </div>
              <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-4 mt-6">
                <Award className="h-10 w-10 text-gymRed" />
                <h3 className="text-xl font-bold text-white">Certified Trainers</h3>
                <p className="text-gray-400 text-sm font-light">Work out with elite personal trainers and nutrition guides.</p>
              </div>
              <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-4">
                <Users className="h-10 w-10 text-gymRed" />
                <h3 className="text-xl font-bold text-white">Strong Community</h3>
                <p className="text-gray-400 text-sm font-light">Join a motivated family focused on continuous growth.</p>
              </div>
              <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-4 mt-6">
                <Activity className="h-10 w-10 text-gymRed" />
                <h3 className="text-xl font-bold text-white">Modern Equipment</h3>
                <p className="text-gray-400 text-sm font-light">Premium cardio decks and free-weight plates from top brands.</p>
              </div>
            </div>

            {/* Right Text */}
            <div className="space-y-6">
              <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white">
                WE ARE A COOPERATIVE SQUAD OF <span className="text-gymRed">ELITE WORKOUT GUIDES</span>
              </h2>
              <p className="text-gray-400 font-light leading-relaxed">
                At Iron House, we believe fitness is not a destination, but a way of life. Founded in 2018, we have helped thousands of athletes and beginners achieve their structural, athletic, and strength goals.
              </p>
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-3">
                  <div className="bg-gymRed/10 p-2 rounded-lg text-gymRed">
                    <Target className="h-5 w-5" />
                  </div>
                  <span className="font-semibold">Tailored fitness plans and goals</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-gymRed/10 p-2 rounded-lg text-gymRed">
                    <Star className="h-5 w-5" />
                  </div>
                  <span className="font-semibold">Over 100+ five-star member reviews</span>
                </div>
              </div>
              <div className="pt-4">
                <Link
                  to="/amenities"
                  className="inline-flex items-center space-x-2 text-gymRed font-bold hover:text-gymRed-light transition-colors"
                >
                  <span>Explore Our Amenities</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trainers Section */}
      <section className="py-24 bg-gymBlack relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-black uppercase tracking-tight">Meet Our <span className="text-gymRed">Elite Trainers</span></h2>
            <p className="text-gray-400 max-w-xl mx-auto font-light">Train with certified, experienced professionals committed to guiding your journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainers.map((t, idx) => (
              <div key={idx} className="glass-card p-8 rounded-2xl border border-white/5 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-gymRed/10 border border-gymRed/30 flex items-center justify-center text-gymRed font-bold text-3xl mb-2">
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-xl font-bold">{t.name}</h3>
                <p className="text-gymRed text-sm font-semibold uppercase tracking-wider">{t.role}</p>
                <span className="text-xs text-gray-500">{t.experience}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gymBlack-dark relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-black uppercase tracking-tight">What Our <span className="text-gymRed">Members Say</span></h2>
            <p className="text-gray-400 max-w-xl mx-auto font-light">Real transformation journeys from active members at Iron House.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="glass-card p-8 rounded-2xl border border-white/5 text-left space-y-4 relative">
                <div className="flex text-gymRed">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 font-light italic leading-relaxed">"{t.text}"</p>
                <div>
                  <h4 className="text-white font-bold">{t.name}</h4>
                  <span className="text-xs text-gray-500">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section Preview */}
      <section className="py-20 bg-gymBlack relative">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-8 glass-panel p-12 rounded-3xl border border-white/5 glow-red">
          <h2 className="text-4xl font-black uppercase">Ready to join the <span className="text-gymRed">Iron House</span> family?</h2>
          <p className="text-gray-400 max-w-xl mx-auto font-light">Get in touch with us today or sign up for a membership plan online to activate access immediately.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold transition-all"
            >
              Contact Us
            </Link>
            <Link
              to="/membership"
              className="px-8 py-3.5 bg-gymRed hover:bg-gymRed-dark text-white rounded-xl font-bold transition-all shadow-lg"
            >
              Purchase Plan
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
