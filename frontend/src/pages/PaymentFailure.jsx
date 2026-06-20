import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

const PaymentFailure = () => {
  const location = useLocation();
  const errorMsg = location.state?.error || 'Signature verification failed or transaction was declined by bank.';

  return (
    <div className="min-h-screen bg-gymBlack text-white flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-gymRed/10 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-gymRed/5 blur-[100px] pointer-events-none"></div>

        <div className="max-w-md w-full bg-gymBlack-light border border-gymRed/20 p-8 rounded-3xl glass-panel text-center space-y-6 z-10 shadow-2xl relative">
          
          {/* Animated Failure Badge */}
          <div className="inline-flex items-center justify-center p-4 bg-gymRed/10 border border-gymRed/20 rounded-full text-gymRed mb-2 animate-bounce">
            <AlertTriangle className="h-16 w-16" />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white uppercase">
            Payment <span className="text-gymRed">Failed</span>
          </h1>
          <p className="text-gray-400 font-light text-sm">
            We were unable to verify your transaction. Please verify your banking details or try again.
          </p>

          {/* Details Card */}
          <div className="border border-white/5 bg-gymBlack-dark/50 rounded-2xl p-5 text-left text-sm space-y-2">
            <h4 className="font-bold text-white uppercase text-xs tracking-wider">Error Details</h4>
            <p className="text-gray-400 font-mono text-xs leading-relaxed">
              {errorMsg}
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col space-y-3 pt-2">
            <Link
              to="/membership"
              className="w-full py-3.5 bg-gymRed hover:bg-gymRed-dark text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry Purchase</span>
            </Link>
            <Link
              to="/"
              className="w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold transition-all flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentFailure;
