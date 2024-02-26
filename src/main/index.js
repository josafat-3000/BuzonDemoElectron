import { app, shell, BrowserWindow,  ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import nodemailer from "nodemailer"
const Gpio = require('onoff').Gpio;

const Lock_1 = new Gpio(8,'out');
const Lock_2 = new Gpio(9,'out');
const Lock_3 = new Gpio(11,'out');
const Lock_4 = new Gpio(25,'out');

Lock_1.writeSync(1);
Lock_2.writeSync(1);
Lock_3.writeSync(1);
Lock_4.writeSync(1);

let message ;
let EdoLockerDis_1 = true;
let EdoLockerDis_2 = true;
let EdoLockerDis_3 = true;
let EdoLockerDis_4 = true;
let password = "";
let password1 = null;
let password2 = null;
let password3 = null;
let password4 = null;

function codigo() {
  let codigo = '';
  for (let i = 0; i < 6; i++) {
    codigo += Math.floor(Math.random() * 10);
  }
  return codigo;
}

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
  user: 'josafat30000@gmail.com',
  pass: 'ljddpqtgcfrknygy'
  }
});
let count = 0;

function verificarEstado() {
  if (EdoLockerDis_1 || EdoLockerDis_2 || EdoLockerDis_3 || EdoLockerDis_4) {
    let numeroAleatorio = Math.floor(Math.random() * 4) + 1;

    if (numeroAleatorio == 1 && EdoLockerDis_1) {
      EdoLockerDis_1 = false;
      return 1;
    } else if (numeroAleatorio == 2 && EdoLockerDis_2) {
      EdoLockerDis_2 = false;
      return 2;
    } else if (numeroAleatorio == 3 && EdoLockerDis_3) {
      EdoLockerDis_3 = false;
      return 3;
    } else if (numeroAleatorio == 4 && EdoLockerDis_4) {
      EdoLockerDis_4 = false;
      return 4;
    } else {
      // Si el locker no está disponible, se realiza una llamada recursiva y se devuelve el resultado.
      return verificarEstado();
    }
  } else {
    return 0;
  }
}
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })



  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  ipcMain.on('email', (event, datos) => {
    console.log('Datos recibidos en el proceso principal:', datos);
    password = codigo();
    message = {
      from: "josafat30000@gmail.com",
      to: datos.email,
      subject: "Código de seguridad",
      html: `<h1 style="color: #333; font-size: 16px;">Código de seguridad</h1>
      <p style="color: #555; font-size: 14px;">Tu contraseña es: </p>
      <p style="color: #007BFF; font-size: 18px;foo"><b>${password}</b></p>'`
    };
    transporter.sendMail(message, (error, info) => {
      if (error) {
          console.log("Error enviando email")
          console.log(error.message)
      } else {
          console.log("Email enviado")
      }
    });
    let locker = verificarEstado()
    console.log(locker)
    if(locker == 1){
      password1 = password;
      Lock_1.writeSync(0);
      setTimeout(() => {
        console.log('1')
        Lock_1.writeSync(1);
      }, 100);
      
    }

    else if(locker == 2){
      password2 = password;
      Lock_2.writeSync(0);
      setTimeout(() => {
        console.log('2')
        Lock_2.writeSync(1);
      }, 100);

    }
    else if (locker == 3){
      password3 = password;
      console.log('3')
      Lock_3.writeSync(0);
      setTimeout(() => {
        Lock_3.writeSync(1);
      }, 100);
      
    }
    else if(locker == 4){
      console.log('4')
      password4 = password;
      Lock_4.writeSync(0);
      setTimeout(() => {
        Lock_4.writeSync(1);
      }, 100);
      
    }
    console.log(EdoLockerDis_1,EdoLockerDis_2,EdoLockerDis_3,EdoLockerDis_4)
  });

  ipcMain.on('password',(event, datos) =>{
    console.log(datos.code)
    console.log(password1,password2,password3,password4)
    if(datos.code == password1){
      console.log('uno')
      Lock_1.writeSync(0);
      setTimeout(() => {
        Lock_1.writeSync(1);
      }, 100);
      
    }
    else if(datos.code === password2){
      console.log('dos')
      Lock_2.writeSync(0);
      setTimeout(() => {
        Lock_2.writeSync(1);
      }, 100);
    } else if (datos.code === password3){
      console.log('tres')
      Lock_3.writeSync(0);
      setTimeout(() => {
        Lock_3.writeSync(1);
      }, 100);
    } else if (datos.code === password4){
      console.log('cuatro')
      Lock_4.writeSync(0);
      setTimeout(() => {
        Lock_4.writeSync(1);
      }, 100);
    } else{
      mainWindow.webContents.send('fail',null);
      console.log('fail')
    }
  });

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
