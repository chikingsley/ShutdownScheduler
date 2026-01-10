import path from "node:path";
import {
  app,
  autoUpdater,
  BrowserWindow,
  ipcMain,
  nativeTheme,
  shell,
} from "electron";
import { updateElectronApp } from "update-electron-app";
import { scheduleFileName } from "./common";
import {
  createTray,
  destroyTray,
  updateTrayMenu,
  updateTrayTitle,
} from "./tray";

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

let mainWindow: BrowserWindow | null = null;

if (!MAIN_WINDOW_VITE_DEV_SERVER_URL) {
  updateElectronApp({
    notifyUser: true,
    updateInterval: "1 hour",
  });
}

const createWindow = (): BrowserWindow => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    fullscreenable: false,
    autoHideMenuBar: !MAIN_WINDOW_VITE_DEV_SERVER_URL,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      sandbox: false,
    },
  });

  autoUpdater.on("update-available", () => {
    mainWindow?.webContents.send("update-available");
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.webContents.openDevTools();
  }

  // Create system tray
  const isDev = !!MAIN_WINDOW_VITE_DEV_SERVER_URL;
  createTray({ mainWindow, isDev });

  return mainWindow;
};

ipcMain.handle("dark-mode:system", () => {
  nativeTheme.themeSource = "system";
});
// Menu.setApplicationMenu(null);
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);
app.whenReady().then(() => {
  const isDev = !!MAIN_WINDOW_VITE_DEV_SERVER_URL;
  ipcMain.handle("isDev", (_e, args) => [
    !!MAIN_WINDOW_VITE_DEV_SERVER_URL,
    args,
  ]);
  ipcMain.handle("getSaveLocation", () => {
    return path.join(
      isDev ? __dirname : app.getPath("userData"),
      scheduleFileName
    );
  });
  ipcMain.handle("getUserDataLocation", () => {
    return path.join(isDev ? __dirname : app.getPath("userData"));
  });
  ipcMain.handle("getAppVersion", () => {
    return app.getVersion();
  });

  // Tray IPC handlers
  ipcMain.handle("tray:updateTitle", (_e, title: string) => {
    updateTrayTitle(title);
  });

  ipcMain.handle(
    "tray:updateMenu",
    (
      _e,
      tasks: Array<{ name: string; timeRemaining: string; action: string }>
    ) => {
      if (mainWindow) {
        updateTrayMenu(mainWindow, tasks);
      }
    }
  );
});

// Clean up tray on quit
app.on("before-quit", () => {
  destroyTray();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
