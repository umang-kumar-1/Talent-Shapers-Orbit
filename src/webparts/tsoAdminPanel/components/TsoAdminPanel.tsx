import * as React from 'react';

import type { ITsoAdminPanelProps } from './ITsoAdminPanelProps';

import App from './App';

export default class TsoAdminPanel extends React.Component<ITsoAdminPanelProps> {
  public render(): React.ReactElement<ITsoAdminPanelProps> {
   

    return (
     <>
     <App />
     </>
    );
  }
}
