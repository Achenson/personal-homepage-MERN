import React from "react";
// import { DndProvider } from "react-dnd";
import { DndProvider } from "react-dnd-multi-backend";
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';

// import { HTML5Backend } from "react-dnd-html5-backend";
// import { TouchBackend } from 'react-dnd-touch-backend';

// import { ReactQueryDevtools} from "react-query-devtools";
import {QueryClientProvider, QueryClient} from "react-query";
import Main from "./components/Main";

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <div className="App">
        {/* <DndProvider backend={HTML5Backend}> */}
        <DndProvider options={HTML5toTouch}>
          <Main />
        </DndProvider>
      </div>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
    
  );
}

export default App;
