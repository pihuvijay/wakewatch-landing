import React, { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { supabase } from '../lib/supabase'

interface EmailSignupProps {
  isOpen: boolean
  onClose: () => void
}

const EmailSignup: React.FC<EmailSignupProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Save email to a "email_signups" table in Supabase
      const { data, error } = await supabase
        .from('email_signups')
        .insert([
          { 
            email: email,
            created_at: new Date().toISOString(),
            source: 'landing_page'
          }
        ])
      
      if (error) {
        setMessage('Something went wrong. Please try again.')
        setIsSuccess(false)
      } else {
        setMessage('Thanks for your interest! We\'ll keep you updated on WakeWatch.')
        setIsSuccess(true)
        setEmail('')
      }
    } catch (err) {
      setMessage('An unexpected error occurred')
      setIsSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setMessage('')
    setIsSuccess(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Get Early Access to WakeWatch
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Be the first to know when WakeWatch launches. Enter your email to join our waitlist.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Enter your email address"
                    />
                  </div>

                  {message && (
                    <div className={`text-sm ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                      {message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                  >
                    {loading ? 'Joining...' : 'Join Waitlist'}
                  </button>
                </form>

                <div className="mt-4 text-center text-xs text-gray-500">
                  We'll only send you updates about WakeWatch. No spam, ever.
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default EmailSignup
