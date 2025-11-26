import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Feather } from '@expo/vector-icons';

interface PDFViewerProps {
  url: string;
  fileName?: string;
}

const { height } = Dimensions.get('window');

export default function PDFViewer({ url, fileName = 'document.pdf' }: PDFViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(1); // Start with method 2 (Google Docs)
  const [loadTimeout, setLoadTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Log URL for debugging
  console.log('📄 PDFViewer - URL:', url);

  // Try multiple viewer options
  const viewerUrls = [
    // Method 1: Direct PDF URL (skip this, usually doesn't work well)
    url,
    // Method 2: Google Docs Viewer (START WITH THIS - most reliable)
    `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`,
    // Method 3: Mozilla PDF.js
    `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(url)}`,
  ];

  const currentViewerUrl = viewerUrls[retryCount % viewerUrls.length];
  console.log(`🔄 Method ${retryCount + 1}/${viewerUrls.length}:`, currentViewerUrl.substring(0, 100) + '...');

  const handleError = (syntheticEvent?: any) => {
    const { nativeEvent } = syntheticEvent || {};
    console.error('❌ PDF Load Error with method:', retryCount + 1);
    console.error('❌ Error details:', nativeEvent);
    
    // Clear timeout if any
    if (loadTimeout) {
      clearTimeout(loadTimeout);
      setLoadTimeout(null);
    }
    
    setError(true);
    setLoading(false);
  };

  const handleRetry = () => {
    console.log('🔄 Retrying with next method...');
    
    // Clear previous timeout
    if (loadTimeout) {
      clearTimeout(loadTimeout);
      setLoadTimeout(null);
    }
    
    setError(false);
    setLoading(true);
    setRetryCount(prev => prev + 1);
  };

  const handleOpenInBrowser = async () => {
    try {
      console.log('🌐 Opening in browser:', url);
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Lỗi', `Không thể mở URL này:\n${url}`);
      }
    } catch (err) {
      console.error('Browser open error:', err);
      Alert.alert('Lỗi', 'Không thể mở trình duyệt');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="file-text" size={24} color="#007AFF" />
        <Text style={styles.title}>Tài liệu đính kèm</Text>
      </View>

      <View style={styles.viewerContainer}>
        {loading && !error && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Đang tải PDF...</Text>
            <Text style={styles.methodText}>
              Phương thức {retryCount + 1}/{viewerUrls.length}
            </Text>
          </View>
        )}
        
        {error && (
          <View style={styles.errorContainer}>
            <Feather name="alert-circle" size={48} color="#FF3B30" />
            <Text style={styles.errorText}>Không thể hiển thị PDF</Text>
            <Text style={styles.errorSubText}>
              Phương thức {retryCount + 1} không hoạt động
            </Text>
            <Text style={styles.urlText} numberOfLines={2} ellipsizeMode="middle">
              {url}
            </Text>
            <View style={styles.errorActions}>
              {retryCount < viewerUrls.length - 1 && (
                <TouchableOpacity 
                  style={[styles.actionButton, styles.retryButton]}
                  onPress={handleRetry}
                >
                  <Feather name="refresh-cw" size={20} color="#FFF" />
                  <Text style={styles.actionButtonText}>Thử cách khác</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[styles.actionButton, styles.openButton]}
                onPress={handleOpenInBrowser}
              >
                <Feather name="external-link" size={20} color="#FFF" />
                <Text style={styles.actionButtonText}>Mở trình duyệt</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!error && (
          <WebView
            source={{ uri: currentViewerUrl }}
            style={styles.webview}
            onLoadStart={() => {
              console.log('⏳ Loading started...');
              setLoading(true);
              setError(false);
              
              // Set timeout to auto-retry if loading takes too long (15 seconds)
              const timeout = setTimeout(() => {
                console.log('⏰ Loading timeout - trying next method...');
                handleRetry();
              }, 15000);
              setLoadTimeout(timeout);
            }}
            onLoadEnd={() => {
              console.log('✅ Loaded successfully');
              
              // Clear timeout on successful load
              if (loadTimeout) {
                clearTimeout(loadTimeout);
                setLoadTimeout(null);
              }
              
              setLoading(false);
            }}
            onError={handleError}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error('❌ HTTP Error:', nativeEvent.statusCode);
              handleError(syntheticEvent);
            }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            mixedContentMode="always"
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            originWhitelist={['*']}
            cacheEnabled={true}
            incognito={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  viewerContainer: {
    height: height * 0.6,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  methodText: {
    marginTop: 8,
    fontSize: 12,
    color: '#9ca3af',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    textAlign: 'center',
  },
  errorSubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  urlText: {
    marginTop: 8,
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  errorActions: {
    marginTop: 24,
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  retryButton: {
    backgroundColor: '#007AFF',
  },
  openButton: {
    backgroundColor: '#34C759',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
