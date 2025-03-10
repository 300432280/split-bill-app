import { Settlement, Person } from '../types';

interface SettlementListProps {
  settlements: Settlement[];
  people: Person[];
}

const SettlementList = ({ settlements, people }: SettlementListProps) => {
  // Helper function to get a person's name by ID
  const getPersonName = (id: string) => {
    const person = people.find(p => p.id === id);
    return person ? person.name : 'Unknown';
  };

  if (settlements.length === 0) {
    return (
      <div className="bg-green-50 border-l-4 border-green-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              All settled! Everyone has paid their fair share.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {settlements.map((settlement, index) => (
        <li key={index} className="bg-blue-50 p-3 rounded-md">
          <div className="flex items-center">
            <div className="mr-3 text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                <span className="font-semibold">{getPersonName(settlement.from)}</span>
                {' pays '}
                <span className="font-semibold">{getPersonName(settlement.to)}</span>
              </p>
              <p className="text-lg font-bold text-blue-700">
                ${settlement.amount.toFixed(2)}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SettlementList; 