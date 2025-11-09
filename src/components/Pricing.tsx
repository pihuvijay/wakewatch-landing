import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const Pricing = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Save email to a "email_signups" table in Supabase
      const { error } = await supabase
        .from('email_signups')
        .insert([
          { 
            email: email,
            created_at: new Date().toISOString(),
            source: 'landing_page'
          }
        ]);
      
      if (error) {
        setMessage('Something went wrong. Please try again.');
        setIsSuccess(false);
      } else {
        setMessage('Thanks for your interest! We\'ll keep you updated on WakeWatch.');
        setIsSuccess(true);
        setEmail('');
      }
    } catch (err) {
      setMessage('An unexpected error occurred');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`bg-background py-8`} id="pricing">
      <div className={`container mx-auto px-2 pt-4 pb-12 text-primary`}>
        <h1
          className={`w-full my-2 text-5xl font-bold leading-tight text-center text-primary`}
        >
          Get Early Access
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Be the first to know when WakeWatch launches
        </p>
        <div className="flex flex-col justify-center items-center space-y-4">
          <form onSubmit={handleSubmit} className="w-1/2 rounded-xl overflow-hidden">
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </form>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className={`w-1/8 flex items-center justify-center px-4 border border-transparent text-base font-medium rounded-md text-background bg-primary hover:bg-border hover:text-primary md:py-4 md:text-lg md:px-10 disabled:opacity-50`}
          >
            {loading ? 'Joining...' : 'Join Waitlist'}
          </button>
          {message && (
            <div className={`text-sm ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
