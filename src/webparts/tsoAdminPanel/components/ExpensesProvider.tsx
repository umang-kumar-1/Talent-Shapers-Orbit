import * as React from 'react';
import { web } from '../PnpUrl';
import { ExpenseContext } from './context/ExpenseContext';

export default function ExpensesProvider({ children }: any) {
  const [expenseData, setExpenseData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<any>(null);

  // Get Expenses Data

  React.useEffect(() => {
    setLoading(true);
    setError(null);

    (async (): Promise<void> => {
      try {
        const res = await web.lists.getByTitle('Expenses').items.get();
        setExpenseData(res);
        console.log('expenses data :: => ', res);
      } catch (err: any) {
        console.log('expenses data error ::', err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    })();

  }, []);

  // Post Expenses Data

  const addExpense = React.useCallback( ()=>{
    setError(null);
    async(): Promise<void>=>{
        try {
            web.lists.getByTitle('Expenses').items.add({
                Title : 1,
            })
        } catch (error:any) {
            
        }

  }
  },[])

  return (
    <ExpenseContext.Provider
      value={{
        expenseData,
        loading,
        error,
        setExpenseData,
        setLoading,
        setError,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}
