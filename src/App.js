import logo from './logo.svg';
import './App.css';
import Header from './component/Header';
import { Outlet } from "react-router-dom";

function App() {
  return (
   <div>
    <Header />
    <main className="pt-16 min-h-[calc(100vh)]">
          <Outlet />
        </main>
   </div>
  );
}

export default App;
