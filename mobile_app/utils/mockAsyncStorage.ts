// Mock AsyncStorage for development
// Trong môi trường thực tế, bạn cần cài đặt @react-native-async-storage/async-storage

interface AsyncStorageStatic {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  multiRemove: (keys: string[]) => Promise<void>;
}

class MockAsyncStorage implements AsyncStorageStatic {
  private storage = new Map<string, string>();

  async getItem(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async multiRemove(keys: string[]): Promise<void> {
    for (const key of keys) {
      this.storage.delete(key);
    }
  }
}

// Tạo instance mock cho development
const AsyncStorage = new MockAsyncStorage();

export default AsyncStorage;