import * as React from 'react';

import type { ITsoAdminPanelProps } from './ITsoAdminPanelProps';

import App from './App';
import ExpensesProvider from './ExpensesProvider';

export default class TsoAdminPanel extends React.Component<ITsoAdminPanelProps> {
  public render(): React.ReactElement<ITsoAdminPanelProps> {
   

    return (
     <ExpensesProvider>
     <App />
     </ExpensesProvider>
    );
  }
}
