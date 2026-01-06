import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

/**
 * Debug component to check token status
 * Useful for testing token persistence
 * 
 * Usage: Add to Profile or Dashboard screen
 * <TokenDebugger />
 */
export const TokenDebugger: React.FC = () => {
  const [tokenInfo, setTokenInfo] = useState<{
    hasAccessToken: boolean;
    hasRefreshToken: boolean;
    accessTokenPreview?: string;
    refreshTokenPreview?: string;
  } | null>(null);

  const checkTokens = async () => {
    try {
      const accessToken = await AsyncStorage.getItem(config.ACCESS_TOKEN_KEY);
      const refreshToken = await AsyncStorage.getItem(config.REFRESH_TOKEN_KEY);

      setTokenInfo({
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        accessTokenPreview: accessToken ? `${accessToken.substring(0, 20)}...` : undefined,
        refreshTokenPreview: refreshToken ? `${refreshToken.substring(0, 20)}...` : undefined,
      });

      console.log('🔑 Token Status:');
      console.log('  - Access Token:', accessToken ? '✅ Exists' : '❌ Not found');
      console.log('  - Refresh Token:', refreshToken ? '✅ Exists' : '❌ Not found');
    } catch (error) {
      console.error('Error checking tokens:', error);
      Alert.alert('Error', 'Failed to check tokens');
    }
  };

  const clearTokens = async () => {
    try {
      await AsyncStorage.multiRemove([config.ACCESS_TOKEN_KEY, config.REFRESH_TOKEN_KEY]);
      setTokenInfo(null);
      Alert.alert('Success', 'Tokens cleared. Please login again.');
      console.log('🧹 Tokens cleared from AsyncStorage');
    } catch (error) {
      console.error('Error clearing tokens:', error);
      Alert.alert('Error', 'Failed to clear tokens');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Token Debug</Text>
      
      <TouchableOpacity style={styles.button} onPress={checkTokens}>
        <Text style={styles.buttonText}>Check Tokens</Text>
      </TouchableOpacity>

      {tokenInfo && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Access Token: {tokenInfo.hasAccessToken ? '✅' : '❌'}
          </Text>
          {tokenInfo.accessTokenPreview && (
            <Text style={styles.previewText}>{tokenInfo.accessTokenPreview}</Text>
          )}
          
          <Text style={styles.infoText}>
            Refresh Token: {tokenInfo.hasRefreshToken ? '✅' : '❌'}
          </Text>
          {tokenInfo.refreshTokenPreview && (
            <Text style={styles.previewText}>{tokenInfo.refreshTokenPreview}</Text>
          )}
        </View>
      )}

      <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={clearTokens}>
        <Text style={styles.buttonText}>Clear Tokens (Logout)</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    marginVertical: 6,
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  infoContainer: {
    marginVertical: 12,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 6,
  },
  infoText: {
    fontSize: 14,
    marginVertical: 4,
    fontWeight: '500',
  },
  previewText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 16,
    marginBottom: 8,
    fontFamily: 'monospace',
  },
});
