import * as React from "react";
import type { BrowserHistory } from "history";
import { Router } from "react-router-dom";

export interface HistoryRouterProps {
  history: BrowserHistory;
  basename?: string;
  children?: React.ReactNode;
}

export function HistoryRouter({
  basename,
  children,
  history,
}: HistoryRouterProps) {
  let [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });

  React.useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      basename={basename}
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
}
