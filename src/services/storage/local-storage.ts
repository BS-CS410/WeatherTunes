interface StorageItem<T> {
  value: T;
  timestamp: number;
}

export class LocalStorage {
  private static instance: LocalStorage;
  private prefix: string = 'weathertunes';

  private constructor() {}

  public static getInstance(): LocalStorage {
    if (!LocalStorage.instance) {
      LocalStorage.instance = new LocalStorage();
    }
    return LocalStorage.instance;
  }

  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  public getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key));
      if (!item) return null;
      
      const parsed = JSON.parse(item) as StorageItem<T>;
      return parsed.value;
    } catch (error) {
      console.error(`Error reading from localStorage for key "${key}":`, error);
      return null;
    }
  }

  public setItem<T>(key: string, value: T): void {
    try {
      const item: StorageItem<T> = {
        value,
        timestamp: Date.now(),
      };
      localStorage.setItem(this.getKey(key), JSON.stringify(item));
    } catch (error) {
      console.error(`Error writing to localStorage for key "${key}":`, error);
    }
  }

  public removeItem(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error(`Error removing item from localStorage for key "${key}":`, error);
    }
  }

  public clear(): void {
    try {
      // Only clear items with our prefix
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(`${this.prefix}:`)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  // Helper methods for specific data types
  public getString(key: string, defaultValue: string = ''): string {
    return this.getItem<string>(key) ?? defaultValue;
  }

  public getNumber(key: string, defaultValue: number = 0): number {
    return this.getItem<number>(key) ?? defaultValue;
  }

  public getBoolean(key: string, defaultValue: boolean = false): boolean {
    return this.getItem<boolean>(key) ?? defaultValue;
  }

  public getObject<T>(key: string, defaultValue: T): T {
    return this.getItem<T>(key) ?? defaultValue;
  }
}
