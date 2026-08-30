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
import SearchResults from "./Components/SearchResults/SearchResults";
import BookDetails from "./Components/BookDetails/BookDetails";
import { Navigate } from 'react-router-dom';
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
        <Route path="Wishlist" element={<Cart/>} />
        <Route path="Cart" element={<Navigate to="/Wishlist" replace />} />
        <Route path="Login" element={<Login/>} />
        <Route path="Register" element={<Register/>} />
        <Route path="Account" element={<Account/>} />
        <Route path="Search" element={<SearchResults/>} />
        <Route path="Book/:id" element={<BookDetails/>} />
      </Route>
    </Routes>
  );
}
export default App;
