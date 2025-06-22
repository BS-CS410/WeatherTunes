import { LocalStorage } from './storage';
import type {
  TemperatureUnit,
  TimeFormat,
  SpeedUnit,
  ThemeMode,
} from '@/types/units-types';

const SETTINGS_KEYS = {
  TEMPERATURE_UNIT: 'temperatureUnit',
  TIME_FORMAT: 'timeFormat',
  SPEED_UNIT: 'speedUnit',
  THEME_MODE: 'themeMode',
} as const;

export interface Settings {
  temperatureUnit: TemperatureUnit;
  timeFormat: TimeFormat;
  speedUnit: SpeedUnit;
  themeMode: ThemeMode;
}

export interface LocationDefaults {
  temperatureUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
}

export class SettingsService {
  private static instance: SettingsService;
  private localStorage: LocalStorage;
  private defaultSettings: Settings;

  private constructor() {
    this.localStorage = LocalStorage.getInstance();
    this.defaultSettings = {
      temperatureUnit: 'F',
      timeFormat: '12h',
      speedUnit: 'mph',
      themeMode: 'auto',
    };
  }

  public static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  public getSettings(): Settings {
    return {
      temperatureUnit: this.getSetting<TemperatureUnit>(
        SETTINGS_KEYS.TEMPERATURE_UNIT,
        this.defaultSettings.temperatureUnit,
      ),
      timeFormat: this.getSetting<TimeFormat>(
        SETTINGS_KEYS.TIME_FORMAT,
        this.defaultSettings.timeFormat,
      ),
      speedUnit: this.getSetting<SpeedUnit>(
        SETTINGS_KEYS.SPEED_UNIT,
        this.defaultSettings.speedUnit,
      ),
      themeMode: this.getSetting<ThemeMode>(
        SETTINGS_KEYS.THEME_MODE,
        this.defaultSettings.themeMode,
      ),
    };
  }

  public updateSetting<K extends keyof Settings>(
    key: K,
    value: Settings[K],
  ): void {
    this.localStorage.setItem(key, value);
  }

  public resetToDefaults(defaults?: Partial<Settings>): Settings {
    const settings = { ...this.defaultSettings, ...defaults };
    
    // Update all settings to their default values
    Object.entries(settings).forEach(([key, value]) => {
      this.updateSetting(key as keyof Settings, value);
    });

    return settings;
  }

  private getSetting<T>(key: string, defaultValue: T): T {
    return this.localStorage.getItem(key) ?? defaultValue;
  }

  // Helper methods for specific settings
  public getTemperatureUnit(): TemperatureUnit {
    return this.getSetting(
      SETTINGS_KEYS.TEMPERATURE_UNIT,
      this.defaultSettings.temperatureUnit,
    );
  }

  public setTemperatureUnit(unit: TemperatureUnit): void {
    this.updateSetting(SETTINGS_KEYS.TEMPERATURE_UNIT, unit);
  }

  public getTimeFormat(): TimeFormat {
    return this.getSetting(
      SETTINGS_KEYS.TIME_FORMAT,
      this.defaultSettings.timeFormat,
    );
  }

  public setTimeFormat(format: TimeFormat): void {
    this.updateSetting(SETTINGS_KEYS.TIME_FORMAT, format);
  }

  public getSpeedUnit(): SpeedUnit {
    return this.getSetting(
      SETTINGS_KEYS.SPEED_UNIT,
      this.defaultSettings.speedUnit,
    );
  }

  public setSpeedUnit(unit: SpeedUnit): void {
    this.updateSetting(SETTINGS_KEYS.SPEED_UNIT, unit);
  }

  public getThemeMode(): ThemeMode {
    return this.getSetting(
      SETTINGS_KEYS.THEME_MODE,
      this.defaultSettings.themeMode,
    );
  }

  public setThemeMode(mode: ThemeMode): void {
    this.updateSetting(SETTINGS_KEYS.THEME_MODE, mode);
  }

  // Helper methods for toggling
  public toggleTemperatureUnit(): TemperatureUnit {
    const current = this.getTemperatureUnit();
    const next = current === 'F' ? 'C' : current === 'C' ? 'K' : 'F';
    this.setTemperatureUnit(next);
    return next;
  }

  public toggleTimeFormat(): TimeFormat {
    const current = this.getTimeFormat();
    const next = current === '12h' ? '24h' : '12h';
    this.setTimeFormat(next);
    return next;
  }
}
