import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Person, Expense, Balance, Settlement } from './types';
import PersonList from './components/PersonList';
import AddPersonForm from './components/AddPersonForm';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import BalanceList from './components/BalanceList';
import SettlementList from './components/SettlementList';

function App() {
  const [people, setPeople] = useState<Person[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);

  // Calculate balances whenever people or expenses change
  useEffect(() => {
    calculateBalances();
  }, [people, expenses]);

  // Add a new person
  const addPerson = (name: string) => {
    if (name.trim() === '') return;
    const newPerson: Person = {
      id: uuidv4(),
      name: name.trim()
    };
    setPeople([...people, newPerson]);
  };

  // Remove a person
  const removePerson = (id: string) => {
    setPeople(people.filter(person => person.id !== id));
    // Also remove any expenses paid by this person
    setExpenses(expenses.filter(expense => expense.payerId !== id));
  };

  // Add a new expense
  const addExpense = (payerId: string, amount: number, description: string) => {
    if (amount <= 0) return;
    
    const newExpense: Expense = {
      id: uuidv4(),
      payerId,
      amount,
      description,
      date: new Date().toISOString()
    };
    
    setExpenses([...expenses, newExpense]);
  };

  // Remove an expense
  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  // Calculate balances for each person
  const calculateBalances = () => {
    if (people.length === 0) {
      setBalances([]);
      setSettlements([]);
      return;
    }

    // Calculate the total amount spent
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate the amount each person should have paid (equal share)
    const equalShare = totalAmount / people.length;

    // Initialize balances for all people
    const newBalances: Balance[] = people.map(person => {
      // Calculate how much this person paid
      const paid = expenses
        .filter(expense => expense.payerId === person.id)
        .reduce((sum, expense) => sum + expense.amount, 0);

      return {
        personId: person.id,
        name: person.name,
        paid,
        shouldPay: equalShare,
        netBalance: paid - equalShare // Positive means they're owed money
      };
    });

    // Sort by netBalance (descending)
    newBalances.sort((a, b) => b.netBalance - a.netBalance);
    setBalances(newBalances);

    // Calculate optimal settlement plans
    calculateSettlements(newBalances);
  };

  // Calculate the optimal way to settle debts
  const calculateSettlements = (currentBalances: Balance[]) => {
    const newSettlements: Settlement[] = [];
    const creditors = [...currentBalances.filter(b => b.netBalance > 0)]
      .sort((a, b) => b.netBalance - a.netBalance);
    const debtors = [...currentBalances.filter(b => b.netBalance < 0)]
      .sort((a, b) => a.netBalance - b.netBalance);

    while (creditors.length > 0 && debtors.length > 0) {
      const creditor = creditors[0];
      const debtor = debtors[0];
      
      // Calculate the amount to be transferred
      const amount = Math.min(creditor.netBalance, Math.abs(debtor.netBalance));
      
      if (amount > 0) {
        newSettlements.push({
          from: debtor.personId,
          to: creditor.personId,
          amount: Number(amount.toFixed(2))
        });
        
        // Update balances
        creditor.netBalance -= amount;
        debtor.netBalance += amount;
        
        // Remove people who have settled their balances
        if (Math.abs(creditor.netBalance) < 0.01) {
          creditors.shift();
        }
        
        if (Math.abs(debtor.netBalance) < 0.01) {
          debtors.shift();
        }
      }
    }
    
    setSettlements(newSettlements);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-2">Split Bill App</h1>
          <p className="text-gray-600">Track expenses and settle debts equally</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* People Management Section */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-xl font-semibold text-indigo-700 mb-4">People</h2>
            <AddPersonForm onAddPerson={addPerson} />
            <PersonList people={people} onRemovePerson={removePerson} />
          </div>
          
          {/* Expense Section */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-xl font-semibold text-indigo-700 mb-4">Add Expense</h2>
            <ExpenseForm 
              people={people} 
              onAddExpense={addExpense} 
            />
          </div>
        </div>
        
        {/* Expense History Section */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mt-6">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">Expense History</h2>
          <ExpenseList 
            expenses={expenses} 
            people={people} 
            onRemoveExpense={removeExpense} 
          />
        </div>
        
        {/* Balances and Settlements Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-xl font-semibold text-indigo-700 mb-4">Current Balances</h2>
            <BalanceList balances={balances} />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-xl font-semibold text-indigo-700 mb-4">How to Settle</h2>
            <SettlementList 
              settlements={settlements} 
              people={people} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
