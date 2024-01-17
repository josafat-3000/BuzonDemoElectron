import { Routes, Route, Outlet, Link } from "react-router-dom";
import { useState } from 'react';


export default function App() {
  return (
    <div>
      <h1>Basic Example</h1>

      {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="colocar" element={<Colocar />} />
          <Route path="retirar" element={<Retirar />} />
        </Route>
      </Routes>
    </div>
  );
}

function Layout() {
  return (
    <div>
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}

      <Link to="/">Home</Link>


      <hr />

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />
    </div>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
      <div className="button-links">
        <Link to="/colocar" className="button-link">
          Colocar paquete
        </Link>
        <Link to="/retirar" className="button-link">
          Retirar paquete
        </Link>
      </div>
    </div>
  );
}


function Colocar() {
  return (
    <div>
      <h2>Colocar Paquete</h2>
      <EmailForm/>
    </div>
  );
}

function Retirar() {
  return (
    <div>
      <h2>Retirar paquete</h2>
      <SecurityCodeForm/>
    </div>
  );
}



const EmailForm = () => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar que sea un correo electrónico válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Por favor, ingrese un correo electrónico válido.");
      return;
    }

    // Mostrar confirmación mediante window.confirm
    const isConfirmed = window.confirm(`¿Confirma que ${email} es su correo electrónico?`);

    if (isConfirmed) {
      // Aquí puedes realizar cualquier acción que desees con el correo electrónico confirmado
      window.electron.ipcRenderer.send('email',{email});
    } 
  };

  return (
    <div>
      <h1>Formulario de Correo Electrónico</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Correo Electrónico:
          <input type="email" value={email} onChange={handleEmailChange} />
        </label>
        <br />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

const SecurityCodeForm = () => {
  const [code, setCode] = useState("");

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mostrar confirmación mediante window.confirm
    const isConfirmed = window.confirm(`¿Confirma que ${code} es correcto?`);

    if (isConfirmed) {
      // Aquí puedes realizar cualquier acción que desees con el correo electrónico confirmado
      window.electron.ipcRenderer.send('password',{code});
    } 
    window.electron.ipcRenderer.on('fail', (datos)=>{
      alert('contraseña erronea');
    })
  };

  return (
    <div>
      <h1>Formulario de Correo Electrónico</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Correo Electrónico:
          <input type="text" value={code} onChange={handleCodeChange} />
        </label>
        <br />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};