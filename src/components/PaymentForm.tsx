import { useState } from 'react';
import { Person } from '../types';

interface PaymentFormProps {
  people: Person[];
  onAddPayment: (payerId: string, payeeId: string, amount: number, description: string) => void;
}

const PaymentForm = ({ people, onAddPayment }: PaymentFormProps) => {
  const [payerId, setPayerId] = useState('');
  const [payeeId, setPayeeId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (payerId && payeeId && amount && payerId !== payeeId) {
      onAddPayment(payerId, payeeId, parseFloat(amount), description);
      // Reset form
      setAmount('');
      setDescription('');
    }
  };

  const isFormValid = payerId && payeeId && amount && payerId !== payeeId;

  // Check if we have enough people to make a payment
  if (people.length < 2) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              You need at least 2 people to record a payment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="payer" className="block text-sm font-medium text-gray-700 mb-1">
            Payer (Who paid?)
          </label>
          <select
            id="payer"
            value={payerId}
            onChange={(e) => setPayerId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="">Select a person</option>
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="payee" className="block text-sm font-medium text-gray-700 mb-1">
            Payee (Who received?)
          </label>
          <select
            id="payee"
            value={payeeId}
            onChange={(e) => setPayeeId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="">Select a person</option>
            {people.map((person) => (
              <option 
                key={person.id} 
                value={person.id}
                disabled={person.id === payerId}
              >
                {person.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Amount ($)
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          min="0.01"
          step="0.01"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Dinner, movie tickets, etc."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <button
        type="submit"
        disabled={!isFormValid}
        className={`w-full py-2 px-4 rounded-md text-white font-medium 
          ${isFormValid 
            ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' 
            : 'bg-indigo-300 cursor-not-allowed'}`}
      >
        Record Payment
      </button>
    </form>
  );
};

export default PaymentForm; 