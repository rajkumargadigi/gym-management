import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Award, ShieldAlert, Heart, Star, Flame, Dumbbell } from 'lucide-react';

const Trainers = () => {
  const trainers = [
    {
      name: 'Ram Reddy',
      speciality: 'Strength & Conditioning',
      bio: 'Former powerlifting champion with over 8 years of coaching experience. Focuses on heavy compounds, barbell mechanics, and raw strength progression.',
      certification: 'CSCS (Certified Strength & Conditioning Specialist)',
      icon: Dumbbell,
    },
    {
      name: 'Lina Singh',
      speciality: 'Yoga & Mobility Lead',
      bio: 'Specializes in Vinyasa flow, power yoga, injury rehab, and mobility workouts. Dedicated to aligning physical structure with breathing flow.',
      certification: 'RYT-500 (Registered Yoga Teacher)',
      icon: Heart,
    },
    {
      name: 'Varun Raghav',
      speciality: 'Zumba & Cardio Coordinator',
      bio: 'High-energy dancer and trainer who makes cardio fun. Combines latin rhythms with full-body bodyweight workouts to maximize fat loss.',
      certification: 'ZIN (Zumba Instructor Network Certified)',
      icon: Flame,
    },
    {
      name: 'Aisha Rajput',
      speciality: 'Nutrition & Diet Consultant',
      bio: 'Designs customizable meal plans and macro goals synced with training schedules. Expert in keto, plant-based diets, and athletic nutrition.',
      certification: 'LDN (Licensed Dietitian Nutritionist)',
      icon: Award,
    },
  ];

  return (
    <div className="min-h-screen bg-gymBlack text-white flex flex-col">
      <Navbar />

      <main className="flex-grow py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[15%] left-[-5%] w-[450px] h-[450px] bg-gymRed/10 blur-[110px] pointer-events-none"></div>
        <div className="absolute bottom-[15%] right-[-5%] w-[450px] h-[450px] bg-gymRed/5 blur-[110px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto space-y-16 z-10 relative">
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight">
              Meet Our <span className="text-gymRed">Trainers</span>
            </h1>
            <p className="text-gray-400 font-light">
              Our certified coaching staff is dedicated to creating structured pathing for your physical goals, safety, and motivation.
            </p>
          </div>

          {/* Trainers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {trainers.map((trainer, index) => {
              const Icon = trainer.icon;
              return (
                <div
                  key={index}
                  className="glass-card p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row gap-6 items-start"
                >
                  {/* Avatar Frame */}
                  <div className="w-20 h-20 rounded-2xl bg-gymRed/10 border border-gymRed/20 flex items-center justify-center text-gymRed shrink-0">
                    <Icon className="h-10 w-10" />
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xl font-bold text-white">{trainer.name}</h3>
                        <div className="flex text-yellow-500 scale-90">
                          <Star className="h-4.5 w-4.5 fill-current" />
                        </div>
                      </div>
                      <span className="text-gymRed font-semibold text-sm uppercase tracking-wide">
                        {trainer.speciality}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm font-light leading-relaxed">
                      {trainer.bio}
                    </p>

                    <div className="pt-2 border-t border-white/5 flex items-center text-xs text-gray-500 font-medium">
                      <Award className="h-4 w-4 text-gymRed mr-1.5 shrink-0" />
                      <span>{trainer.certification}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Trainers;
