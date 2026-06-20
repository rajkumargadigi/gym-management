import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { Check, Dumbbell, ShieldCheck, HelpCircle, Calendar, CreditCard } from 'lucide-react';

const Membership = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Default plans fallback in case database is empty or not connected
  const defaultPlans = [
    {
      _id: 'default-basic',
      name: 'Basic',
      price: 999,
      features: ['Gym access', 'Locker access'],
      durationInMonths: 1
    },
    {
      _id: 'default-standard',
      name: 'Standard',
      price: 1299,
      features: ['Gym access', 'Group classes', 'Locker access'],
      durationInMonths: 1
    },
    {
      _id: 'default-premium',
      name: 'Premium',
      price: 1599,
      features: ['Gym access', 'Personal trainer', 'Diet consultation'],
      durationInMonths: 1
    }
  ];

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await API.get('/plans');
        if (data && data.length > 0) {
          setPlans(data);
        } else {
          setPlans(defaultPlans);
        }
      } catch (err) {
        console.warn('Could not connect to database for plans, using fallbacks.');
        setPlans(defaultPlans);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSelectPlan = (plan) => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Navigate to dashboard or payment processing page with plan data
    navigate('/dashboard', { state: { selectedPlan: plan } });
  };

  return (
    <div className="min-h-screen bg-gymBlack text-white flex flex-col">
      <Navbar />

      <main className="flex-grow py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-gymRed/10 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[400px] h-[400px] bg-gymRed/5 blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto space-y-16 z-10 relative">
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight">
              Membership <span className="text-gymRed">Plans</span>
            </h1>
            <p className="text-gray-400 font-light">
              Choose the perfect plan to fuel your body and reach your strength potential. No hidden fees, cancel anytime.
            </p>
          </div>

          {/* User Membership Status (if logged in) */}
          {user && (
            <div className="max-w-3xl mx-auto glass-panel p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gymRed/10 rounded-xl text-gymRed">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Your Membership Status</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-400">Current Plan:</span>
                    <span className="text-sm font-semibold text-gymRed uppercase">{user?.membership?.plan || 'None'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                {user?.membership?.status === 'active' ? (
                  <div className="flex flex-col text-right items-end">
                    <div className="flex items-center space-x-1.5 text-green-500 font-semibold text-sm">
                      <span className="h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
                      <span>Active</span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Expires: {new Date(user.membership.endDate).toLocaleDateString()}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500 font-semibold uppercase bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                    No Active Subscription
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Plans Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gymRed"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => {
                const isPremium = plan.name.toLowerCase() === 'premium';
                return (
                  <div
                    key={plan._id}
                    className={`rounded-3xl p-8 flex flex-col justify-between relative border ${
                      isPremium
                        ? 'bg-gymBlack-light/70 border-gymRed shadow-2xl glow-red scale-105 z-10'
                        : 'glass-card border-white/5'
                    }`}
                  >
                    {isPremium && (
                      <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-gymRed text-white text-xs font-extrabold uppercase px-4 py-1.5 rounded-full tracking-wider">
                        Best Value
                      </span>
                    )}

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-extrabold text-white uppercase">{plan.name}</h3>
                        <div className="flex items-baseline">
                          <span className="text-5xl font-black">₹{plan.price}</span>
                          <span className="text-gray-500 text-sm ml-2">/ month</span>
                        </div>
                      </div>

                      <div className="border-t border-white/5 my-4"></div>

                      <ul className="space-y-4">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center space-x-3 text-sm text-gray-300">
                            <Check className="h-4.5 w-4.5 text-gymRed shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8 pt-4">
                      <button
                        onClick={() => handleSelectPlan(plan)}
                        className={`w-full py-4 px-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] cursor-pointer flex items-center justify-center space-x-2 ${
                          isPremium
                            ? 'bg-gymRed hover:bg-gymRed-dark text-white shadow-lg'
                            : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                        }`}
                      >
                        <CreditCard className="h-4.5 w-4.5" />
                        <span>Select Plan</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* FAQs */}
          <div className="max-w-4xl mx-auto space-y-8 pt-12">
            <h2 className="text-2xl font-bold text-center uppercase tracking-wider text-white">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-2">
                <h4 className="font-bold text-white flex items-center">
                  <HelpCircle className="h-4 w-4 text-gymRed mr-2 shrink-0" />
                  Can I upgrade or downgrade later?
                </h4>
                <p className="text-gray-400 font-light">Yes. You can upgrade or switch plans at any time via your user dashboard dashboard.</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-2">
                <h4 className="font-bold text-white flex items-center">
                  <HelpCircle className="h-4 w-4 text-gymRed mr-2 shrink-0" />
                  Is there a contract or commitment?
                </h4>
                <p className="text-gray-400 font-light">All memberships are month-to-month and can be canceled at any time with no cancellation fees.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Membership;
