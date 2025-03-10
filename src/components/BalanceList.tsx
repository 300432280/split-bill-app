import { Balance } from '../types';

interface BalanceListProps {
  balances: Balance[];
}

const BalanceList = ({ balances }: BalanceListProps) => {
  if (balances.length === 0) {
    return <p className="text-gray-500 italic">No balance information available.</p>;
  }

  const totalExpense = balances.reduce((sum, balance) => sum + balance.shouldPay, 0).toFixed(2);

  return (
    <div>
      <div className="mb-4 pb-2 border-b border-gray-200">
        <p className="text-sm text-gray-600">Total group expense: <span className="font-semibold">${totalExpense}</span></p>
        <p className="text-sm text-gray-600">Each person should pay: <span className="font-semibold">${balances.length > 0 ? balances[0].shouldPay.toFixed(2) : '0.00'}</span></p>
      </div>
      
      <ul className="divide-y divide-gray-200">
        {balances.map((balance) => (
          <li key={balance.personId} className="py-3">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">{balance.name}</span>
              <span 
                className={`font-semibold ${
                  balance.netBalance > 0 
                    ? 'text-green-600' 
                    : balance.netBalance < 0 
                      ? 'text-red-600' 
                      : 'text-gray-600'
                }`}
              >
                {balance.netBalance > 0 ? '+' : ''}${balance.netBalance.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Paid: ${balance.paid.toFixed(2)}</span>
              <span>Should pay: ${balance.shouldPay.toFixed(2)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BalanceList; 