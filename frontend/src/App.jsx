import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Navbar from "./Components/Navbar/Navbar";
import Subjects from "./Pages/Subjects/Subjects";
import CreateProgram from "./Pages/CreateProgram/CreateProgram";
import EditProgram from "./Pages/EditProgram/EditProgram";
import CreateSubject from "./Pages/CreateSubject/CreateSubject";
import EditSubject from "./Pages/EditSubject/EditSubject";
import Versions from "./Pages/Versions/Versions";
function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="programs">
            <Route index={true} element={<Home />} />
            <Route index={false} path=":programCode" element={<Subjects />} />
          </Route>
          <Route path="subjects">
            <Route path=":subjectCode" element={<Versions />} />
          </Route>
          <Route path="create-program" element={<CreateProgram />} />
          <Route path="edit-program" element={<EditProgram />} />
          <Route path="create-subject" element={<CreateSubject />} />
          <Route path="edit-subject" element={<EditSubject />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
