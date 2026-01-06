import React from 'react';
import { Text, View, StyleSheet, TextStyle } from 'react-native';
import { WebView } from 'react-native-webview';

interface MathTextProps {
  children: string;
  style?: TextStyle | TextStyle[];
}

/**
 * Component hiển thị text có chứa công thức toán học LaTeX sử dụng KaTeX
 * 
 * Cách sử dụng:
 * - Wrap công thức trong $ $ cho inline math: Phương trình $x^2 + y^2 = r^2$
 * - Wrap công thức trong $$ $$ cho display math (block level)
 * 
 * Ví dụ:
 * <MathText>Tính giá trị của $\frac{1}{2} + \frac{3}{4}$</MathText>
 * <MathText>Phương trình $\sqrt{x + 4} = 3$ có nghiệm là:</MathText>
 */
export default function MathText({ children, style }: MathTextProps) {
  if (!children) {
    return <Text style={style}>{children}</Text>;
  }

  // Kiểm tra xem có công thức LaTeX không
  const hasMath = /\$\$?[^$]+\$\$?/.test(children);
  
  // Nếu không có công thức, trả về Text thông thường
  if (!hasMath) {
    return <Text style={style}>{children}</Text>;
  }

  // Flatten style để lấy fontSize và color
  const flatStyle = StyleSheet.flatten(style);
  const fontSize = flatStyle?.fontSize || 16;
  const color = flatStyle?.color || '#000000';

  // Escape text cho HTML
  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // Tạo HTML với KaTeX
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
      <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
      <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: ${fontSize}px;
          color: ${color};
          padding: 4px;
          line-height: 1.5;
          overflow-x: hidden;
        }
        .katex {
          font-size: 1em;
        }
        .katex-display {
          margin: 8px 0;
        }
      </style>
    </head>
    <body>
      <div id="math-content">${escapeHtml(children)}</div>
      <script>
        document.addEventListener("DOMContentLoaded", function() {
          renderMathInElement(document.getElementById('math-content'), {
            delimiters: [
              {left: '$$', right: '$$', display: true},
              {left: '$', right: '$', display: false}
            ],
            throwOnError: false
          });
          
          // Auto-resize height
          setTimeout(() => {
            const height = document.body.scrollHeight;
            window.ReactNativeWebView.postMessage(JSON.stringify({ height }));
          }, 100);
        });
      </script>
    </body>
    </html>
  `;

  const [webViewHeight, setWebViewHeight] = React.useState(fontSize * 2);

  return (
    <View style={[styles.container, { minHeight: webViewHeight }]}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={[styles.webview, { height: webViewHeight }]}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.height) {
              setWebViewHeight(Math.max(data.height, fontSize * 1.5));
            }
          } catch (e) {
            // Ignore parse errors
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  webview: {
    backgroundColor: 'transparent',
  },
});
