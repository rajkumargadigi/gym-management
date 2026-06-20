import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle, ArrowRight, ShieldCheck, Download, Calendar } from 'lucide-react';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tx = location.state?.transaction;

  return (
    <div className="min-h-screen bg-gymBlack text-white flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-green-500/10 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-green-500/5 blur-[100px] pointer-events-none"></div>

        <div className="max-w-md w-full bg-gymBlack-light border border-green-500/20 p-8 rounded-3xl glass-panel text-center space-y-6 z-10 shadow-2xl relative">
          
          {/* Animated Success Badge */}
          <div className="inline-flex items-center justify-center p-4 bg-green-500/10 border border-green-500/20 rounded-full text-green-500 mb-2">
            <CheckCircle className="h-16 w-16" />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white uppercase">
            Payment <span className="text-green-500">Success!</span>
          </h1>
          <p className="text-gray-400 font-light text-sm">
            Your payment has been securely completed and your membership is now active. Welcome to the gym squad!
          </p>

          {/* Receipt Panel */}
          <div className="border border-white/5 bg-gymBlack-dark/50 rounded-2xl p-5 text-left text-sm space-y-3.5">
            <div className="flex justify-between">
              <span className="text-gray-500">Transaction ID:</span>
              <span className="font-mono text-white text-xs">{tx?.transactionId || 'pay_sim_9z8y7x6w'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Membership Plan:</span>
              <span className="font-semibold text-gymRed uppercase">{tx?.planName || 'Premium'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Amount Paid:</span>
              <span className="font-bold text-white">₹{tx?.amount || '79.00'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Status:</span>
              <span className="text-green-500 font-semibold flex items-center">
                <ShieldCheck className="h-4 w-4 mr-1 shrink-0" />
                Verified Active
              </span>
            </div>
            <div className="flex justify-between border-t border-white/5 pt-3">
              <span className="text-gray-500 flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                Date:
              </span>
              <span className="text-gray-300">
                {tx?.paymentDate ? new Date(tx.paymentDate).toLocaleDateString() : new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col space-y-3 pt-2">
            <Link
              to="/dashboard"
              className="w-full py-3.5 bg-gymRed hover:bg-gymRed-dark text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
