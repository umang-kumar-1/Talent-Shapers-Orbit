import { useState, useEffect } from 'react';
import { web } from "../PnpUrl";

export function ExpensesMethods() {
    const [expenseData, setExpenseData] = useState<any[]>([]);
      const [loading, setLoading] = useState<boolean>(true);
      const [error, setError] = useState<any>(null);
    
      // Get Expenses Data

      useEffect(() => {
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

      return {
        expenseData, loading, error
      };
    }