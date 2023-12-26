import { createContext } from 'react';
import { defaultSettings } from '../config';
import useLocalStorage from '../hooks/useLocalStorage';
import getColorPresets, { defaultPreset, colorPresets } from '../utils/getColorPresets';

const initialState = {
  ...defaultSettings,

  // Mode
  onToggleMode: () => {},

  // Color
  setColor: defaultPreset,
  colorOption: [],
};

const SettingsContext = createContext(initialState);

const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useLocalStorage('settings', {
    themeMode: initialState.themeMode,
  });

  const onToggleMode = () => {
    setSettings({
      ...settings,
      themeMode: settings.themeMode === 'light' ? 'dark' : 'light',
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        // Mode
        onToggleMode,

        // Color

        setColor: getColorPresets(settings.themeColorPresets),
        colorOption: colorPresets.map((color) => ({
          name: color.name,
          value: color.main,
        })),
      }}>
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsContext };

export default SettingsProvider;
