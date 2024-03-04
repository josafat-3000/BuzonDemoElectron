import { Routes, Route, Outlet, Link } from "react-router-dom";
import { useState } from 'react';
import colocar from './assets/colocar.jpg';
import retirar from './assets/retirar.jpg';
import home from './assets/house-solid.svg';
import RFID from './assets/RFID.png';
import './assets/index.css';

export default function App() {
  return (
    <div >
      {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/colocar" element={<Colocar2 />} />
          <Route path="/email" element={<Colocar />} />
          <Route path="/retirar" element={<Retirar />} />
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



      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />
    </div>
  );
}

function Home() {
  const handleClick = ()=>{
    window.electron.ipcRenderer.send('rfid');
    window.electron.ipcRenderer.on('uid', (datos) => {
      alert(datos.uid);
    })
  }
  return (
    <div className="body">
      <h1>Bienvenido</h1>
      <div className="container">
        <div className="button-container">
          <img src={colocar} alt="Descripción de la imagen" />
          <Link className="colocar-button" to="/colocar" onClick={handleClick}>
            Colocar paquete
          </Link>
        </div>
        <div className="button-container">
          <img src={retirar} alt="Descripción de la imagen" />
          <Link className="retirar-button" to="/retirar">
            Retirar paquete
          </Link>
        </div>
      </div>
    </div>
  );
}


function Colocar() {
  return (
    <div className="body">
      <h2>Colocar Paquete</h2>
      <Link to="/"> <img className="home" src={home} alt="" /></Link>
      <hr className="mi-hr" />
      <div className="email-form">

        <EmailForm />
      </div>
    </div>
  );
}
function Colocar2() {
  return (
    <div className="body">
      <h2>Colocar Paquete</h2>
      <Link to="/"> <img className="home" src={home} alt="" /></Link>
      <hr className="mi-hr" />
      <div className="email-form">

        <LookForUsers />
      </div>
    </div>
  );
}

function Retirar() {
  return (

    <div className="body">
      <h2>Retirar paquete</h2>
      <Link to="/"> <img className="home" src={home} alt="" /></Link>
      <hr className="mi-hr" />
      <div className="email-form">

        <SecurityCodeForm />
      </div>
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
      window.electron.ipcRenderer.send('email', { email });
    }
  };

  return (
    <div>
      <h2>Introduce tu correo electrónico</h2>
      <form onSubmit={handleSubmit}>


        <input className="input" type="email" value={email} onChange={handleEmailChange} />

        <br />
        <button className="submit-button" type="submit">Enviar</button>
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
      window.electron.ipcRenderer.send('password', { code });
    }
    window.electron.ipcRenderer.on('fail', (datos) => {
      alert('contraseña erronea');
    })
  };

  return (
    <div>
      <h2>Introduce tu codigo de seguridad</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <input className="input" type="text" value={code} onChange={handleCodeChange} />
        </label>
        <br />
        <button className="submit-button" type="submit">Enviar</button>
      </form>
    </div>
  );
};

const LookForUsers = () => {

  return (
    <div>
      <h2>Coloque su tarjeta en el lector</h2>
      <img className="antena" src={RFID} alt="" />
      <Link to="/email"> O usar correo electrónico</Link>     
    </div>
  );
}