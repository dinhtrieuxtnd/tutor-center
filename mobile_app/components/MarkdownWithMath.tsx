import React from 'react';
import { View, StyleSheet, TextStyle } from 'react-native';
import { WebView } from 'react-native-webview';

interface MarkdownWithMathProps {
  children: string;
  style?: TextStyle | TextStyle[];
}

/**
 * Component hiển thị Markdown + LaTeX (công thức toán học)
 * 
 * Hỗ trợ:
 * - Markdown: **bold**, *italic*, # heading, - list, etc.
 * - LaTeX inline: $x^2 + y^2$
 * - LaTeX display: $$\frac{a}{b}$$
 * 
 * Ví dụ:
 * ```
 * **Câu hỏi:** Tính $\frac{1}{2} + \frac{3}{4}$
 * 
 * Cho biểu thức: $\sqrt{x + 4} = 3$
 * 
 * - Đáp án A: $x = 5$
 * - Đáp án B: $x = 9$
 * ```
 */
export default function MarkdownWithMath({ children, style }: MarkdownWithMathProps) {
  // Flatten style để lấy fontSize và color
  const flatStyle = StyleSheet.flatten(style);
  const fontSize = flatStyle?.fontSize || 16;
  const color = flatStyle?.color || '#374151';

  // Escape HTML nhưng giữ nguyên $ cho LaTeX
  const escapeHtmlKeepMath = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };

  // Tạo HTML với Marked.js (Markdown) + KaTeX (Math)
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      
      <!-- KaTeX CSS -->
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
      
      <!-- Marked.js for Markdown -->
      <script src="https://cdn.jsdelivr.net/npm/marked@11.1.1/marked.min.js"></script>
      
      <!-- KaTeX JS -->
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
          padding: 8px;
          line-height: 1.6;
          overflow-x: hidden;
          word-wrap: break-word;
        }
        
        /* Markdown styles */
        h1, h2, h3, h4, h5, h6 {
          margin-top: 16px;
          margin-bottom: 8px;
          font-weight: 600;
          line-height: 1.3;
        }
        
        h1 { font-size: 1.8em; }
        h2 { font-size: 1.5em; }
        h3 { font-size: 1.3em; }
        h4 { font-size: 1.1em; }
        
        p {
          margin-bottom: 8px;
        }
        
        ul, ol {
          margin-left: 20px;
          margin-bottom: 8px;
        }
        
        li {
          margin-bottom: 4px;
        }
        
        strong, b {
          font-weight: 600;
        }
        
        em, i {
          font-style: italic;
        }
        
        code {
          background-color: #f3f4f6;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }
        
        pre {
          background-color: #f3f4f6;
          padding: 12px;
          border-radius: 6px;
          overflow-x: auto;
          margin-bottom: 8px;
        }
        
        blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 12px;
          margin: 8px 0;
          color: #6b7280;
        }
        
        /* KaTeX styles */
        .katex {
          font-size: 1.1em;
        }
        
        .katex-display {
          margin: 12px 0;
          overflow-x: auto;
          overflow-y: hidden;
        }
        
        /* Table styles */
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 8px 0;
        }
        
        th, td {
          border: 1px solid #e5e7eb;
          padding: 8px;
          text-align: left;
        }
        
        th {
          background-color: #f3f4f6;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div id="content"></div>
      
      <script>
        // Wait for all libraries to load
        window.addEventListener('load', function() {
          try {
            const rawContent = ${JSON.stringify(children)};
            
            // Step 1: Render Markdown to HTML
            const htmlContent = marked.parse(rawContent);
            
            // Step 2: Insert HTML
            document.getElementById('content').innerHTML = htmlContent;
            
            // Step 3: Render LaTeX math
            if (window.renderMathInElement) {
              renderMathInElement(document.getElementById('content'), {
                delimiters: [
                  {left: '$$', right: '$$', display: true},
                  {left: '$', right: '$', display: false},
                  {left: '\\\\[', right: '\\\\]', display: true},
                  {left: '\\\\(', right: '\\\\)', display: false}
                ],
                throwOnError: false,
                strict: false
              });
            }
            
            // Step 4: Auto-resize height
            setTimeout(() => {
              const height = document.body.scrollHeight;
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ height }));
              }
            }, 200);
          } catch (error) {
            console.error('Error rendering content:', error);
            document.getElementById('content').innerHTML = '<p>Error rendering content</p>';
          }
        });
      </script>
    </body>
    </html>
  `;

  const [webViewHeight, setWebViewHeight] = React.useState(fontSize * 3);

  return (
    <View style={[styles.container, { minHeight: webViewHeight }]}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={[styles.webview, { height: webViewHeight }]}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.height) {
              setWebViewHeight(Math.max(data.height + 10, fontSize * 2));
            }
          } catch (e) {
            // Ignore parse errors
          }
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
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
