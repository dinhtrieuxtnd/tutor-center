import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

interface LatexMarkdownViewerProps {
  content: string;
}

export default function LatexMarkdownViewer({ content }: LatexMarkdownViewerProps) {
  const [height, setHeight] = useState(150); // Increase initial height

  if (!content) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không có nội dung để hiển thị</Text>
      </View>
    );
  }

  // Escape content for HTML
  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const escapedContent = escapeHtml(content);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
  <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
      font-size: 16px;
      line-height: 1.5;
      color: #374151;
      padding: 12px;
      overflow-x: hidden;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 16px;
      margin-bottom: 8px;
      font-weight: 600;
      color: #111827;
    }
    h1 { font-size: 28px; }
    h2 { font-size: 24px; }
    h3 { font-size: 20px; }
    h4 { font-size: 18px; }
    p {
      margin-bottom: 12px;
    }
    code {
      background-color: #f3f4f6;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Courier New', Courier, monospace;
      font-size: 14px;
    }
    pre {
      background-color: #f3f4f6;
      padding: 12px;
      border-radius: 6px;
      overflow-x: auto;
      margin-bottom: 12px;
    }
    pre code {
      background: none;
      padding: 0;
    }
    ul, ol {
      margin-left: 20px;
      margin-bottom: 12px;
    }
    li {
      margin-bottom: 4px;
    }
    blockquote {
      border-left: 4px solid #e5e7eb;
      padding-left: 12px;
      margin: 12px 0;
      color: #6b7280;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 12px;
    }
    th, td {
      border: 1px solid #e5e7eb;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f9fafb;
      font-weight: 600;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    .math {
      overflow-x: auto;
      overflow-y: hidden;
    }
  </style>
</head>
<body>
  <div id="content"></div>
  <script>
    // Configure MathJax
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
        displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
        processEscapes: true,
        processEnvironments: true
      },
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
      }
    };

    // Parse markdown with LaTeX support
    const content = \`${escapedContent}\`;
    
    // Use marked to parse markdown
    marked.setOptions({
      breaks: true,
      gfm: true
    });
    
    const htmlContent = marked.parse(content);
    document.getElementById('content').innerHTML = htmlContent;

    // Typeset math after content is loaded
    if (window.MathJax) {
      MathJax.typesetPromise().then(() => {
        // Send height to React Native after MathJax renders
        setTimeout(() => {
          const height = document.body.scrollHeight;
          window.ReactNativeWebView.postMessage(JSON.stringify({ height }));
        }, 200); // Wait for layout to settle
      }).catch(err => console.error('MathJax error:', err));
    } else {
      // Fallback if MathJax not loaded
      setTimeout(() => {
        const height = document.body.scrollHeight;
        window.ReactNativeWebView.postMessage(JSON.stringify({ height }));
      }, 300);
    }

    // Update height on resize
    window.addEventListener('resize', () => {
      const height = document.body.scrollHeight;
      window.ReactNativeWebView.postMessage(JSON.stringify({ height }));
    });
  </script>
</body>
</html>
`;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.height) {
        setHeight(data.height + 40); // Add more padding to ensure all content is visible
      }
    } catch (e) {
      console.error('Error parsing message:', e);
    }
  };

  return (
    <View style={[styles.container, { height }]}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={styles.webview}
        scrollEnabled={false}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        scalesPageToFit={false}
        bounces={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 100, // Ensure minimum height
  },
  webview: {
    backgroundColor: 'transparent',
    minHeight: 100, // Ensure WebView has minimum height
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
