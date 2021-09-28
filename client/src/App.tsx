import React from "react";
// import { DndProvider } from "react-dnd";
import { DndProvider } from "react-dnd-multi-backend";
import HTML5toTouch from "react-dnd-multi-backend/dist/esm/HTML5toTouch";
import { createClient, Provider } from "urql";
import { QueryClientProvider, QueryClient } from "react-query";

import Main from "./components/Main";

const client = createClient({
  url: "http://localhost:4000/graphql",
});

// import { HTML5Backend } from "react-dnd-html5-backend";
// import { TouchBackend } from 'react-dnd-touch-backend';

// import { ReactQueryDevtools} from "react-query-devtools";

const queryClient = new QueryClient();

function App() {
  return (
    <Provider value={client}>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          {/* <DndProvider backend={HTML5Backend}> */}
          <DndProvider options={HTML5toTouch}>
            <Main />
          </DndProvider>
        </div>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
