import path from "node:path";
import { app, type BrowserWindow, Menu, nativeImage, Tray } from "electron";

let tray: Tray | null = null;

interface TrayOptions {
  mainWindow: BrowserWindow;
  isDev: boolean;
}

const getIconPath = (isDev: boolean): string => {
  if (isDev) {
    return path.join(process.cwd(), "public", "assets", "icon.png");
  }
  return path.join(__dirname, "..", "renderer", "assets", "icon.png");
};

export const createTray = ({ mainWindow, isDev }: TrayOptions): Tray => {
  const iconPath = getIconPath(isDev);
  const icon = nativeImage.createFromPath(iconPath);

  // Resize icon for tray (recommended 16x16 or 22x22 for most platforms)
  const trayIcon = icon.resize({ width: 16, height: 16 });

  tray = new Tray(trayIcon);
  tray.setToolTip("Shutdown Scheduler");

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show App",
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      },
    },
    { type: "separator" },
    {
      label: "No scheduled tasks",
      enabled: false,
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  return tray;
};

interface ScheduledTask {
  name: string;
  timeRemaining: string;
  action: string;
}

export const updateTrayMenu = (
  mainWindow: BrowserWindow,
  tasks: ScheduledTask[]
): void => {
  if (!tray) {
    return;
  }

  const taskMenuItems =
    tasks.length > 0
      ? tasks.map((task) => ({
          label: `${task.action}: ${task.timeRemaining}`,
          enabled: false,
        }))
      : [{ label: "No scheduled tasks", enabled: false }];

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show App",
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      },
    },
    { type: "separator" },
    ...taskMenuItems,
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
};

export const updateTrayTitle = (title: string): void => {
  if (!tray) {
    return;
  }

  // setTitle only works on macOS - shows text next to icon in menu bar
  if (process.platform === "darwin") {
    tray.setTitle(title);
  }

  tray.setToolTip(title || "Shutdown Scheduler");
};

export const destroyTray = (): void => {
  if (tray) {
    tray.destroy();
    tray = null;
  }
};
