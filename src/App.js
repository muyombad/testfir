import { BrowserRouter as Router, Route, Routes , Link} from 'react-router-dom';
import SignUp from './components/singup';
import Login from './components/login';


function App() {
  return (
    <Router>
          <nav>
          <Link to="singup">Sign Up</Link> | <Link to="/login">Log In</Link>
        </nav>
            <Routes>
              <Route path="/singup"  element={<SignUp/>}/>
               
               <Route path='/login' element={<Login/>}/>
            </Routes>

     </Router>       

  );
}

export default App;
