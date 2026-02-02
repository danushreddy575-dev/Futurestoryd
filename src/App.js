import './App.css';
import Cart from './Components/cart/Cart';
import Childrenbook from './Components/Childrenbook/Childrenbook';
import Comics from './Components/Comics/Comics';
import Fiction from './Components/Fiction/Fiction';
import Nonfiction from './Components/Nonfiction/Nonfiction';
import Allbooks from './Components/Allbooks/Allbooks';
import Root from './Components/Root';
import Errorpage from './Components/Errorpage';
import Login from './Components/Login/Login';
import Register from "./Components/Registration/Register";
import Account from "./Components/Account/Account";
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Root/>} errorElement={<Errorpage/>}>
        <Route index element={<Allbooks/>} />
        <Route path="Fiction" element={<Fiction/>} />
        <Route path="Nonfiction" element={<Nonfiction/>} />
        <Route path="Childrenbook" element={<Childrenbook/>} />
        <Route path="Comics" element={<Comics/>} />
        <Route path="Cart" element={<Cart/>} />
        <Route path="Login" element={<Login/>} />
        <Route path="Register" element={<Register/>} />
        <Route path="Account" element={<Account/>} />
      </Route>
    </Routes>
  );
}
export default App;
