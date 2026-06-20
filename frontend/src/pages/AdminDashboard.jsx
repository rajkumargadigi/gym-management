import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../services/api';
import {
  Users,
  ShieldAlert,
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  ListCollapse,
  Activity,
  History,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  // Tabs: 'users', 'plans', 'transactions'
  const [activeTab, setActiveTab] = useState('users');

  // Error/Success alerts
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Users State
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Null for create
  // Form fields for User
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState('user');
  const [userPlan, setUserPlan] = useState('None');
  const [userPlanStatus, setUserPlanStatus] = useState('inactive');

  // 2. Plans State
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null); // Null for create
  // Form fields for Plan
  const [planName, setPlanName] = useState('');
  const [planPrice, setPlanPrice] = useState('');
  const [planDuration, setPlanDuration] = useState('1');
  const [planFeatures, setPlanFeatures] = useState('');

  // 3. Transactions State
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = () => {
    setSuccessMsg('');
    setErrorMsg('');
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'plans') fetchPlans();
    if (activeTab === 'transactions') fetchTransactions();
  };

  // ==========================================
  // 1. USERS API CALLS
  // ==========================================
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const { data } = await API.get('/users');
      setUsers(data);
    } catch (err) {
      setErrorMsg('Could not load user list');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleOpenUserModal = (user = null) => {
    setSelectedUser(user);
    if (user) {
      setUserName(user.name);
      setUserEmail(user.email);
      setUserPhone(user.phone);
      setUserRole(user.role);
      setUserPlan(user.membership?.plan || 'None');
      setUserPlanStatus(user.membership?.status || 'inactive');
      setUserPassword('');
    } else {
      setUserName('');
      setUserEmail('');
      setUserPhone('');
      setUserRole('user');
      setUserPlan('None');
      setUserPlanStatus('inactive');
      setUserPassword('');
    }
    setShowUserModal(true);
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payload = {
        name: userName,
        email: userEmail,
        phone: userPhone,
        role: userRole,
        membership: { plan: userPlan, status: userPlanStatus },
      };
      if (userPassword) payload.password = userPassword;

      if (selectedUser) {
        // Update user
        await API.put(`/users/${selectedUser._id}`, payload);
        setSuccessMsg(`User "${userName}" updated successfully`);
      } else {
        // Create user
        if (!userPassword) {
          setErrorMsg('Password is required for new users');
          return;
        }
        payload.password = userPassword;
        await API.post('/users', payload);
        setSuccessMsg(`User "${userName}" created successfully`);
      }
      setShowUserModal(false);
      fetchUsers();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save user details');
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"?`)) return;
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await API.delete(`/users/${userId}`);
      setSuccessMsg(`User "${name}" removed successfully`);
      fetchUsers();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to delete user');
    }
  };

  // ==========================================
  // 2. PLANS API CALLS
  // ==========================================
  const fetchPlans = async () => {
    setPlansLoading(true);
    try {
      const { data } = await API.get('/plans');
      setPlans(data);
    } catch (err) {
      setErrorMsg('Could not load membership plans');
    } finally {
      setPlansLoading(false);
    }
  };

  const handleOpenPlanModal = (plan = null) => {
    setSelectedPlan(plan);
    if (plan) {
      setPlanName(plan.name);
      setPlanPrice(plan.price);
      setPlanDuration(plan.durationInMonths.toString());
      setPlanFeatures(plan.features.join('\n'));
    } else {
      setPlanName('');
      setPlanPrice('');
      setPlanDuration('1');
      setPlanFeatures('');
    }
    setShowPlanModal(true);
  };

  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payload = {
        name: planName,
        price: parseFloat(planPrice),
        durationInMonths: parseInt(planDuration),
        features: planFeatures.split('\n').map(f => f.trim()).filter(Boolean),
      };

      if (selectedPlan) {
        await API.put(`/plans/${selectedPlan._id}`, payload);
        setSuccessMsg(`Plan "${planName}" updated successfully`);
      } else {
        await API.post('/plans', payload);
        setSuccessMsg(`Plan "${planName}" added successfully`);
      }
      setShowPlanModal(false);
      fetchPlans();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save plan details');
    }
  };

  const handleDeletePlan = async (planId, name) => {
    if (!window.confirm(`Are you sure you want to delete plan "${name}"?`)) return;
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await API.delete(`/plans/${planId}`);
      setSuccessMsg(`Plan "${name}" removed successfully`);
      fetchPlans();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to delete plan');
    }
  };

  // ==========================================
  // 3. TRANSACTIONS API CALLS
  // ==========================================
  const fetchTransactions = async () => {
    setTxLoading(true);
    try {
      const { data } = await API.get('/payments');
      setTransactions(data);
    } catch (err) {
      setErrorMsg('Could not load transactions history');
    } finally {
      setTxLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gymBlack text-white flex flex-col">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative Gradients */}
        <div className="absolute top-[10%] left-[-15%] w-[400px] h-[400px] bg-gymRed/5 blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto space-y-8 z-10 relative">
          
          {/* Header Panel */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gymBlack-light/40 border border-white/5 p-6 rounded-2xl">
            <div>
              <h1 className="text-3xl font-black uppercase text-white">Admin Management Portal</h1>
              <p className="text-gray-400 text-sm font-light mt-1">Control members, configure pricing, and review cashflow.</p>
            </div>
            
            {/* Top Stats */}
            <div className="flex gap-4">
              <div className="bg-white/2 px-4 py-2 rounded-xl text-center border border-white/5">
                <div className="text-xs text-gray-500 font-bold uppercase">Tab Selected</div>
                <div className="text-sm font-bold text-gymRed uppercase mt-0.5">{activeTab}</div>
              </div>
            </div>
          </div>

          {/* Feedback banners */}
          {successMsg && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-sm flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="bg-gymRed/10 border border-gymRed/20 text-gymRed p-4 rounded-xl text-sm flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Tab Selection Row */}
          <div className="flex border-b border-white/5 pb-0.5 gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center space-x-2 px-6 py-3 border-b-2 font-bold text-sm tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'users' ? 'border-gymRed text-gymRed' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Users className="h-4.5 w-4.5" />
              <span>Member Management</span>
            </button>
            <button
              onClick={() => setActiveTab('plans')}
              className={`flex items-center space-x-2 px-6 py-3 border-b-2 font-bold text-sm tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'plans' ? 'border-gymRed text-gymRed' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <CreditCard className="h-4.5 w-4.5" />
              <span>Membership Plans</span>
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex items-center space-x-2 px-6 py-3 border-b-2 font-bold text-sm tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'transactions' ? 'border-gymRed text-gymRed' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <History className="h-4.5 w-4.5" />
              <span>Transaction Logs</span>
            </button>
          </div>

          {/* TAB CONTENT: USERS */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white uppercase">Active Club Members</h3>
                <button
                  onClick={() => handleOpenUserModal(null)}
                  className="px-4 py-2.5 bg-gymRed hover:bg-gymRed-dark text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-lg"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Member</span>
                </button>
              </div>

              {usersLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gymRed"></div>
                </div>
              ) : (
                <div className="overflow-x-auto border border-white/5 rounded-2xl">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-white/5 text-gray-300 font-semibold border-b border-white/5">
                        <th className="p-4">Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Membership Plan</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map((u) => (
                        <tr key={u._id} className="hover:bg-white/2 transition-colors">
                          <td className="p-4 font-bold text-white">{u.name}</td>
                          <td className="p-4 text-gray-300">{u.email}</td>
                          <td className="p-4 text-gray-400">{u.phone}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                              u.role === 'admin' ? 'bg-gymRed/10 text-gymRed border border-gymRed/20' : 'bg-white/5 text-gray-300'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4 font-semibold uppercase text-gymRed text-xs">{u.membership?.plan || 'None'}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              u.membership?.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-gray-500'
                            }`}>
                              {u.membership?.status || 'inactive'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-3">
                              <button
                                onClick={() => handleOpenUserModal(u)}
                                className="text-gray-400 hover:text-white p-1 transition-colors cursor-pointer"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u._id, u.name)}
                                className="text-gray-400 hover:text-gymRed p-1 transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: PLANS */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white uppercase">Gym Offer Packages</h3>
                <button
                  onClick={() => handleOpenPlanModal(null)}
                  className="px-4 py-2.5 bg-gymRed hover:bg-gymRed-dark text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-lg"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Plan</span>
                </button>
              </div>

              {plansLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gymRed"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {plans.map((p) => (
                    <div key={p._id} className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xl font-extrabold uppercase text-white">{p.name}</h4>
                            <span className="text-xs text-gray-500">{p.durationInMonths} Month duration</span>
                          </div>
                          <span className="text-2xl font-black text-white">₹{p.price}</span>
                        </div>

                        <div className="border-t border-white/5 my-2"></div>

                        <ul className="space-y-2">
                          {p.features.map((f, i) => (
                            <li key={i} className="text-xs text-gray-400 flex items-center">
                              <span className="h-1.5 w-1.5 rounded-full bg-gymRed mr-2 shrink-0"></span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex justify-end gap-3 mt-6 pt-3 border-t border-white/5">
                        <button
                          onClick={() => handleOpenPlanModal(p)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-white cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePlan(p._id, p.name)}
                          className="px-3 py-1.5 bg-gymRed/10 hover:bg-gymRed/20 text-gymRed rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: TRANSACTIONS */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white uppercase">System Transaction Logs</h3>

              {txLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gymRed"></div>
                </div>
              ) : (
                <div className="overflow-x-auto border border-white/5 rounded-2xl">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-white/5 text-gray-300 font-semibold border-b border-white/5">
                        <th className="p-4">Transaction ID</th>
                        <th className="p-4">User Name</th>
                        <th className="p-4">User Email</th>
                        <th className="p-4">Plan Name</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Payment Date</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {transactions.map((tx) => (
                        <tr key={tx._id} className="hover:bg-white/2 transition-colors">
                          <td className="p-4 font-mono text-xs text-gray-300">{tx.transactionId}</td>
                          <td className="p-4 text-white font-bold">{tx.user?.name || 'Unknown'}</td>
                          <td className="p-4 text-gray-400">{tx.user?.email || 'N/A'}</td>
                          <td className="p-4 uppercase font-semibold text-gymRed text-xs">{tx.planName}</td>
                          <td className="p-4 font-bold text-white">₹{tx.amount}</td>
                          <td className="p-4 text-xs text-gray-400">
                            {new Date(tx.paymentDate).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
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

        </div>
      </main>

      {/* MODAL: USER DETAILS (ADD/EDIT) */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gymBlack-dark/80 backdrop-blur-sm">
          <div className="bg-gymBlack-light border border-white/10 p-8 rounded-3xl max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-black uppercase text-white mb-6">
              {selectedUser ? 'Edit Member details' : 'Register New Member'}
            </h3>

            <form onSubmit={handleUserSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mt-1 block w-full px-4 py-2.5 rounded-xl bg-gymBlack-dark/60 border border-white/10 text-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="mt-1 block w-full px-4 py-2.5 rounded-xl bg-gymBlack-dark/60 border border-white/10 text-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase">Phone Number</label>
                <input
                  type="text"
                  required
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="mt-1 block w-full px-4 py-2.5 rounded-xl bg-gymBlack-dark/60 border border-white/10 text-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase">
                  {selectedUser ? 'New Password (Leave blank to keep same)' : 'Account Password'}
                </label>
                <input
                  type="password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-2.5 rounded-xl bg-gymBlack-dark/60 border border-white/10 text-white text-sm focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase">Access Role</label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="mt-1 block w-full py-2.5 px-3 rounded-xl bg-gymBlack-dark border border-white/10 text-white text-sm focus:outline-none cursor-pointer"
                  >
                    <option value="user">User (Member)</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase">Membership Plan</label>
                  <select
                    value={userPlan}
                    onChange={(e) => setUserPlan(e.target.value)}
                    className="mt-1 block w-full py-2.5 px-3 rounded-xl bg-gymBlack-dark border border-white/10 text-white text-sm focus:outline-none cursor-pointer"
                  >
                    <option value="None">None</option>
                    <option value="Basic">Basic</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase">Membership Status</label>
                <select
                  value={userPlanStatus}
                  onChange={(e) => setUserPlanStatus(e.target.value)}
                  className="mt-1 block w-full py-2.5 px-3 rounded-xl bg-gymBlack-dark border border-white/10 text-white text-sm focus:outline-none cursor-pointer"
                >
                  <option value="inactive">Inactive</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="w-1/2 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-gymRed hover:bg-gymRed-dark text-white rounded-xl text-sm font-bold transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PLAN DETAILS (ADD/EDIT) */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gymBlack-dark/80 backdrop-blur-sm">
          <div className="bg-gymBlack-light border border-white/10 p-8 rounded-3xl max-w-lg w-full shadow-2xl relative">
            <h3 className="text-2xl font-black uppercase text-white mb-6">
              {selectedPlan ? 'Edit Membership Plan' : 'Create New Plan'}
            </h3>

            <form onSubmit={handlePlanSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase">Plan Name</label>
                <input
                  type="text"
                  required
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="mt-1 block w-full px-4 py-2.5 rounded-xl bg-gymBlack-dark/60 border border-white/10 text-white text-sm focus:outline-none"
                  placeholder="Basic / Deluxe"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase">Price (USD)</label>
                  <input
                    type="number"
                    required
                    value={planPrice}
                    onChange={(e) => setPlanPrice(e.target.value)}
                    className="mt-1 block w-full px-4 py-2.5 rounded-xl bg-gymBlack-dark/60 border border-white/10 text-white text-sm focus:outline-none"
                    placeholder="49"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase">Duration (Months)</label>
                  <input
                    type="number"
                    required
                    value={planDuration}
                    onChange={(e) => setPlanDuration(e.target.value)}
                    className="mt-1 block w-full px-4 py-2.5 rounded-xl bg-gymBlack-dark/60 border border-white/10 text-white text-sm focus:outline-none"
                    placeholder="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase">Plan Features (One per line)</label>
                <textarea
                  required
                  rows={4}
                  value={planFeatures}
                  onChange={(e) => setPlanFeatures(e.target.value)}
                  className="mt-1 block w-full px-4 py-2.5 rounded-xl bg-gymBlack-dark/60 border border-white/10 text-white text-sm focus:outline-none resize-none"
                  placeholder="Gym access&#10;Locker access&#10;Group classes"
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="w-1/2 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-gymRed hover:bg-gymRed-dark text-white rounded-xl text-sm font-bold transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;
