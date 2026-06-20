import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Heart, Dumbbell, Flower, Sparkles, Key, Car, Sparkle } from 'lucide-react';

const Amenities = () => {
  const amenities = [
    {
      name: 'Cardio Area',
      description: 'Equipped with top-of-the-line treadmills, elliptical trainers, spin bikes, and rowing machines. Track your progress with smart console connectivity.',
      icon: Heart,
    },
    {
      name: 'Strength Training',
      description: 'Massive free-weight zone, plate-loaded machines, Olympic lifting platforms, and squat racks to help you build raw power and muscle definition.',
      icon: Dumbbell,
    },
    {
      name: 'Yoga Room',
      description: 'A serene, temperature-controlled studio equipped with premium mats, blocks, and straps. Perfect for flexibility, mindfulness, and recovery sessions.',
      icon: Flower,
    },
    {
      name: 'Zumba Classes',
      description: 'Dynamic group exercise studio hosting high-energy dance routines, aerobic workouts, and musical cardio classes led by licensed instructors.',
      icon: Sparkles,
    },
    {
      name: 'Locker Room',
      description: 'Premium spa-like change rooms featuring secure electronic lockers, clean showers, blow dryers, and complimentary towel service.',
      icon: Key,
    },
    {
      name: 'Parking Area',
      description: 'Spacious, secure, and well-lit parking zone with dedicated surveillance and bicycle racks, free for all active gym members.',
      icon: Car,
    },
  ];

  return (
    <div className="min-h-screen bg-gymBlack text-white flex flex-col">
      <Navbar />

      <main className="flex-grow py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Decorative Gradients */}
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gymRed/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gymRed/5 blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto space-y-16 z-10 relative">
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-1.5 text-gymRed font-semibold text-sm uppercase tracking-wider">
              <Sparkle className="h-4 w-4 fill-current" />
              <span>World-Class Facilities</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight">
              Our <span className="text-gymRed">Amenities</span>
            </h1>
            <p className="text-gray-400 font-light">
              We design every space to optimize your training flow, comfort, and focus. Explore the ultimate fitness environment.
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {amenities.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="glass-card p-8 rounded-3xl border border-white/5 flex flex-col space-y-5"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gymRed/10 border border-gymRed/20 flex items-center justify-center text-gymRed">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold tracking-wide text-white">{item.name}</h3>
                    <p className="text-gray-400 font-light text-sm leading-relaxed">{item.description}</p>
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

export default Amenities;
