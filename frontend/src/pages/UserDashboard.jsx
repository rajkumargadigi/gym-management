import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import {
  User,
  ShieldCheck,
  CreditCard,
  Bell,
  Clock,
  Edit2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  History,
  Info
} from 'lucide-react';

const UserDashboard = () => {
  const { user, updateUserState, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Tab State: 'profile', 'membership', 'payments', 'notifications'
  const [activeTab, setActiveTab] = useState('profile');

  // Profile Edit Form
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Transactions State
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(false);

  // Payment Selection / Modal Simulation
  const [selectedPlan, setSelectedPlan] = useState(location.state?.selectedPlan || null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [simModalOpen, setSimModalOpen] = useState(false);
  const [simOrder, setSimOrder] = useState(null);

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Welcome Athlete!', text: 'Welcome to the Iron House family. Complete your active membership purchase to unlock access.', date: new Date().toLocaleDateString(), read: false },
    { id: 2, title: 'Summer Sale!', text: 'Renew or upgrade your plan to Premium today and receive 1 week of free nutrition counseling.', date: new Date().toLocaleDateString(), read: true }
  ]);

  useEffect(() => {
    if (activeTab === 'payments') {
      fetchTransactions();
    }
  }, [activeTab]);

  const fetchTransactions = async () => {
    setTxLoading(true);
    try {
      const { data } = await API.get('/users/transactions');
      setTransactions(data);
    } catch (err) {
      console.error('Could not fetch payment logs');
    } finally {
      setTxLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');
    setEditLoading(true);

    try {
      const payload = { name, phone };
      if (password) payload.password = password;

      const { data } = await API.put('/users/profile', payload);
      updateUserState(data);
      setEditSuccess('Profile details updated successfully');
      setPassword('');
    } catch (err) {
      setEditError(err.response?.data?.message || 'Update failed');
    } finally {
      setEditLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (plan) => {
    setCheckoutLoading(true);
    try {
      // 1. Create order
      const { data: order } = await API.post('/payments/order', { planId: plan._id });
      
      if (order.simulated) {
        // Run simulator bypass flow
        setSimOrder({ ...order, planName: plan.name, durationInMonths: plan.durationInMonths || 1 });
        setSimModalOpen(true);
        setCheckoutLoading(false);
        return;
      }

      // 2. Load script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Razorpay SDK failed to load. Are you connected to the internet?');
        setCheckoutLoading(false);
        return;
      }

      // 3. Configure Razorpay
      const options = {
        key: 'rzp_test_placeholder_key_id', // Will fall back to placeholder if not configured
        amount: order.amount,
        currency: order.currency,
        name: 'Iron House Gym',
        description: `Active Plan: ${plan.name}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyRes = await API.post('/payments/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              planName: plan.name,
              amount: order.amount,
              durationInMonths: plan.durationInMonths || 1,
            });
            // Update Auth state
            updateUserState({ membership: verifyRes.data.membership });
            setSelectedPlan(null);
            navigate('/payment-success', { state: { transaction: verifyRes.data.transaction } });
          } catch (err) {
            navigate('/payment-failure', { state: { error: err.response?.data?.message || err.message } });
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: '#dc2626',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleSimulatePayment = async (success) => {
    setSimModalOpen(false);
    if (!success) {
      navigate('/payment-failure', { state: { error: 'Simulated payment declined by user.' } });
      return;
    }

    try {
      const verifyRes = await API.post('/payments/verify', {
        razorpay_payment_id: `pay_sim_${Math.random().toString(36).substr(2, 9)}`,
        razorpay_order_id: simOrder.id,
        razorpay_signature: 'simulated_signature_hash',
        planName: simOrder.planName,
        amount: simOrder.amount,
        durationInMonths: simOrder.durationInMonths,
      });

      // Update Auth context state
      updateUserState({ membership: verifyRes.data.membership });
      setSelectedPlan(null);
      
      // Add success notification
      setNotifications([
        {
          id: Date.now(),
          title: 'Membership Activated!',
          text: `Congratulations! Your plan (${simOrder.planName}) is now verified active.`,
          date: new Date().toLocaleDateString(),
          read: false
        },
        ...notifications
      ]);

      navigate('/payment-success', { state: { transaction: verifyRes.data.transaction } });
    } catch (err) {
      navigate('/payment-failure', { state: { error: err.response?.data?.message || err.message } });
    }
  };

  return (
    <div className="min-h-screen bg-gymBlack text-white flex flex-col">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[10%] left-[-15%] w-[400px] h-[400px] bg-gymRed/5 blur-[100px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 items-start relative z-10">
          
          {/* Side Menu Tab Selector */}
          <div className="lg:col-span-1 glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
            <div className="text-center pb-6 border-b border-white/5 space-y-2">
              <div className="w-16 h-16 rounded-full bg-gymRed/10 border border-gymRed/20 flex items-center justify-center text-gymRed mx-auto">
                <User className="h-8 w-8" />
              </div>
              <h3 className="font-extrabold text-lg text-white">{user?.name}</h3>
              <span className="text-xs text-gray-500 uppercase tracking-widest">{user?.role} ACCOUNT</span>
            </div>

            <nav className="flex flex-col space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'profile' ? 'bg-gymRed text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <User className="h-4.5 w-4.5" />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('membership')}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'membership' ? 'bg-gymRed text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <ShieldCheck className="h-4.5 w-4.5" />
                <span>My Membership</span>
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'payments' ? 'bg-gymRed text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <History className="h-4.5 w-4.5" />
                <span>Payment History</span>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer relative ${
                  activeTab === 'notifications' ? 'bg-gymRed text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Bell className="h-4.5 w-4.5" />
                <span>Notifications</span>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-3 right-4 h-2 w-2 rounded-full bg-gymRed animate-ping"></span>
                )}
              </button>
            </nav>
          </div>

          {/* Main Tab Panel */}
          <div className="lg:col-span-3 glass-panel rounded-2xl p-8 border border-white/5 min-h-[500px]">
            
            {/* TAB: PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-black uppercase text-white">Edit Profile Details</h2>
                  <p className="text-gray-400 text-sm font-light mt-1">Keep your contact details up to date for billing and bookings.</p>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-5 max-w-lg">
                  {editSuccess && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-xl text-sm flex items-center space-x-2">
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                      <span>{editSuccess}</span>
                    </div>
                  )}
                  {editError && (
                    <div className="bg-gymRed/10 border border-gymRed/20 text-gymRed p-3 rounded-xl text-sm flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 shrink-0" />
                      <span>{editError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-300">Email Address (Non-changeable)</label>
                    <input
                      type="text"
                      disabled
                      value={user?.email}
                      className="mt-1 block w-full px-4 py-3 rounded-xl bg-gymBlack-dark/40 border border-white/5 text-gray-500 text-sm focus:outline-none cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full px-4 py-3 rounded-xl bg-gymBlack-dark/60 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gymRed focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 block w-full px-4 py-3 rounded-xl bg-gymBlack-dark/60 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gymRed focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300">New Password (Leave blank to keep current)</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 block w-full px-4 py-3 rounded-xl bg-gymBlack-dark/60 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gymRed focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={editLoading}
                    className="px-6 py-3 bg-gymRed hover:bg-gymRed-dark text-white rounded-xl font-bold transition-all text-sm cursor-pointer flex items-center justify-center"
                  >
                    {editLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* TAB: MEMBERSHIP */}
            {activeTab === 'membership' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-black uppercase text-white">Membership Details</h2>
                  <p className="text-gray-400 text-sm font-light mt-1">Activate, upgrade, or check the expiration status of your gym pass.</p>
                </div>

                {/* Selected Plan Checklist / Purchase details */}
                {selectedPlan && (
                  <div className="p-6 bg-gymRed/10 border border-gymRed/20 rounded-2xl space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-xs uppercase text-gymRed font-bold tracking-wider">Plan Selected</span>
                        <h3 className="text-xl font-extrabold text-white">{selectedPlan.name} Membership</h3>
                        <p className="text-gray-400 text-sm">₹{selectedPlan.price} / Month</p>
                      </div>
                      <button
                        onClick={() => setSelectedPlan(null)}
                        className="text-gray-500 hover:text-white text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                    <button
                      onClick={() => handlePayment(selectedPlan)}
                      disabled={checkoutLoading}
                      className="w-full sm:w-auto px-6 py-3 bg-gymRed hover:bg-gymRed-dark text-white font-bold rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      {checkoutLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <CreditCard className="h-4.5 w-4.5" />
                          <span>Complete Checkout Securely</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Subscribed Active Card */}
                <div className="glass-panel p-8 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="space-y-3">
                    <span className="text-xs uppercase text-gray-500 font-bold tracking-wider">CURRENT SUBSCRIPTION</span>
                    <h3 className="text-3xl font-extrabold text-white flex items-center uppercase">
                      {user?.membership?.plan || 'None'}
                      {user?.membership?.status === 'active' && (
                        <span className="ml-3 text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full font-bold">
                          Active
                        </span>
                      )}
                    </h3>
                    {user?.membership?.status === 'active' ? (
                      <p className="text-gray-400 text-sm flex items-center">
                        <Calendar className="h-4 w-4 text-gymRed mr-1.5" />
                        Renews automatically on: {new Date(user.membership.endDate).toLocaleDateString()}
                      </p>
                    ) : (
                      <p className="text-gray-500 text-sm">Purchase a membership to gain physical gym access and training classes.</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
                    <button
                      onClick={() => navigate('/membership')}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-sm font-bold transition-all text-center cursor-pointer"
                    >
                      {user?.membership?.status === 'active' ? 'Upgrade Plan' : 'Explore Plans'}
                    </button>
                    {user?.membership?.status === 'active' && (
                      <button
                        onClick={() => {
                          const mockPlan = { _id: 'default-premium', name: user.membership.plan, price: 79 };
                          handlePayment(mockPlan);
                        }}
                        className="px-6 py-3 bg-gymRed hover:bg-gymRed-dark text-white rounded-xl text-sm font-bold transition-all text-center cursor-pointer"
                      >
                        Renew Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PAYMENT HISTORY */}
            {activeTab === 'payments' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-black uppercase text-white">Payment Logs</h2>
                  <p className="text-gray-400 text-sm font-light mt-1">Review your billing history, receipt states, and transaction tracking codes.</p>
                </div>

                {txLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gymRed"></div>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="p-12 text-center border border-white/5 bg-gymBlack-dark/20 rounded-2xl space-y-3">
                    <History className="h-10 w-10 text-gray-600 mx-auto" />
                    <h3 className="font-bold text-white text-base">No Billing Logs Found</h3>
                    <p className="text-gray-500 text-sm">You haven't completed any plans payment transactions yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-white/5 rounded-2xl">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-white/5 text-gray-300 font-semibold border-b border-white/5">
                          <th className="p-4">Transaction ID</th>
                          <th className="p-4">Membership Plan</th>
                          <th className="p-4">Amount</th>
                          <th className="p-4">Payment Date</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {transactions.map((tx) => (
                          <tr key={tx._id} className="hover:bg-white/2 transition-colors">
                            <td className="p-4 font-mono text-xs text-gray-300">{tx.transactionId}</td>
                            <td className="p-4 uppercase font-semibold text-gymRed text-xs">{tx.planName}</td>
                            <td className="p-4 font-bold">₹{tx.amount}</td>
                            <td className="p-4 text-xs text-gray-400">
                              {new Date(tx.paymentDate).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                tx.paymentStatus === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-gymRed/10 text-gymRed'
                              }`}>
                                {tx.paymentStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-black uppercase text-white">Notifications Panel</h2>
                  <p className="text-gray-400 text-sm font-light mt-1">Stay up to date with billing receipts, warnings, and announcements.</p>
                </div>

                <div className="space-y-4">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-5 rounded-2xl border flex items-start gap-4 transition-all ${
                        n.read ? 'glass-card border-white/5 opacity-70' : 'bg-gymRed/5 border-gymRed/30'
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${n.read ? 'bg-white/5 text-gray-400' : 'bg-gymRed/15 text-gymRed'}`}>
                        <Info className="h-5 w-5" />
                      </div>
                      <div className="space-y-1 w-full">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-white text-sm">{n.title}</h4>
                          <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">{n.date}</span>
                        </div>
                        <p className="text-gray-400 text-sm font-light leading-relaxed">{n.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Dynamic Simulated Payment Modal */}
      {simModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gymBlack-dark/80 backdrop-blur-sm">
          <div className="bg-gymBlack-light border border-gymRed/30 p-8 rounded-3xl max-w-md w-full text-center space-y-6 shadow-2xl relative">
            <h3 className="text-2xl font-black uppercase text-white tracking-wide">
              Razorpay <span className="text-gymRed">Simulator</span>
            </h3>
            <p className="text-gray-400 text-sm font-light">
              This payment order is utilizing developer simulation credentials. Choose an outcome to verify frontend routing integrations.
            </p>

            <div className="bg-gymBlack-dark/50 p-4 rounded-xl text-left text-xs space-y-2 border border-white/5">
              <div><span className="text-gray-500">Order Ref:</span> <span className="text-white font-mono">{simOrder?.id}</span></div>
              <div><span className="text-gray-500">Plan Name:</span> <span className="text-gymRed font-semibold uppercase">{simOrder?.planName}</span></div>
              <div><span className="text-gray-500">Amount due:</span> <span className="text-white font-bold">₹{simOrder?.amount / 100}</span></div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleSimulatePayment(false)}
                className="w-1/2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-sm font-bold transition-all cursor-pointer"
              >
                Decline (Fail)
              </button>
              <button
                onClick={() => handleSimulatePayment(true)}
                className="w-1/2 py-3 bg-gymRed hover:bg-gymRed-dark text-white rounded-xl text-sm font-bold transition-all cursor-pointer"
              >
                Authorize (Success)
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default UserDashboard;
