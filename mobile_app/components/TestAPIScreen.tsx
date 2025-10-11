import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { apiService } from '../services/api';

export default function TestAPIScreen() {
  const testConnection = async () => {
    try {
      Alert.alert('Testing...', 'Đang test kết nối API');
      
      // Test simple register call
      const result = await apiService.register({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'testpass123'
      });
      
      Alert.alert('Success!', 'API connection working!');
      console.log('API Response:', result);
    } catch (error: any) {
      Alert.alert('Error', `API Error: ${error.message}`);
      console.error('API Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Connection Test</Text>
      <Text style={styles.subtitle}>Backend: http://192.168.0.102:5000/api</Text>
      
      <TouchableOpacity style={styles.testButton} onPress={testConnection}>
        <Text style={styles.buttonText}>Test API Connection</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  testButton: {
    backgroundColor: '#4F46E5',
    padding: 15,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});