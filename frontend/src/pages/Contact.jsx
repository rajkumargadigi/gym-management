import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock } from 'lucide-react';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gymBlack text-white flex flex-col">
      <Navbar />

      <main className="flex-grow py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gymRed/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gymRed/5 blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto space-y-16 z-10 relative">
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight">
              Contact <span className="text-gymRed">Us</span>
            </h1>
            <p className="text-gray-400 font-light">
              Have a question about our classes, training schedules, or pricing? Drop us a line and our squad will reply shortly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto items-start">
            {/* Left Contact Details Panel */}
            <div className="space-y-6 lg:col-span-1">
              <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-8">
                <h3 className="text-2xl font-bold tracking-tight text-white uppercase">Get In Touch</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gymRed/10 border border-gymRed/20 rounded-xl text-gymRed shrink-0">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Gym Address</h4>
                      <p className="text-gray-400 text-sm font-light mt-1">100 Fitness Blvd, Muscle City, MC 90210</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gymRed/10 border border-gymRed/20 rounded-xl text-gymRed shrink-0">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Call Center</h4>
                      <p className="text-gray-400 text-sm font-light mt-1">+1 (555) 999-8888</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gymRed/10 border border-gymRed/20 rounded-xl text-gymRed shrink-0">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Email Support</h4>
                      <p className="text-gray-400 text-sm font-light mt-1">support@ironhousegym.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gymRed/10 border border-gymRed/20 rounded-xl text-gymRed shrink-0">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Club Hours</h4>
                      <p className="text-gray-400 text-sm font-light mt-1">Mon - Fri: 5 AM - 11 PM</p>
                      <p className="text-gray-400 text-sm font-light">Sat - Sun: 6 AM - 9 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Contact Form Panel */}
            <div className="glass-panel p-8 rounded-3xl border border-white/5 lg:col-span-2 shadow-2xl glow-red">
              {submitted ? (
                <div className="py-16 text-center space-y-4">
                  <div className="inline-flex items-center justify-center p-4 bg-green-500/10 border border-green-500/35 rounded-full text-green-500 mb-2">
                    <CheckCircle className="h-12 w-12" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-white uppercase">Message Sent!</h3>
                  <p className="text-gray-400 max-w-sm mx-auto font-light text-sm">
                    Thank you for contacting us. An Iron House specialist will review your inquiry and follow up within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 px-6 py-2.5 bg-gymRed hover:bg-gymRed-dark text-white rounded-xl text-sm font-bold transition-all cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-2xl font-bold tracking-tight text-white uppercase">Send Us A Message</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-300">Name</label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-4 py-3 border border-white/10 rounded-xl bg-gymBlack-dark/60 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gymRed focus:border-transparent text-sm transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-300">Email</label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-4 py-3 border border-white/10 rounded-xl bg-gymBlack-dark/60 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gymRed focus:border-transparent text-sm transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-300">Subject (Optional)</label>
                    <input
                      id="subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="mt-1 block w-full px-4 py-3 border border-white/10 rounded-xl bg-gymBlack-dark/60 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gymRed focus:border-transparent text-sm transition-all"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-300">Message</label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="mt-1 block w-full px-4 py-3 border border-white/10 rounded-xl bg-gymBlack-dark/60 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gymRed focus:border-transparent text-sm transition-all resize-none"
                      placeholder="Type your message here..."
                    ></textarea>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gymRed hover:bg-gymRed-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gymRed transition-all duration-300 disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <span>Send Inquiry</span>
                          <Send className="ml-2 h-4.5 w-4.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
