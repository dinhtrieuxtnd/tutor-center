import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export const MarkdownRenderer = ({ text, className = '' }) => {
    if (!text) return null;

    return (
        <div className={className}>
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    // Custom styling for markdown elements
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    code: ({ inline, children }) =>
                        inline ? (
                            <code className="bg-secondary px-1 py-0.5 rounded text-sm font-mono">
                                {children}
                            </code>
                        ) : (
                            <pre className="bg-secondary p-2 rounded overflow-x-auto mb-2">
                                <code className="text-sm font-mono">{children}</code>
                            </pre>
                        ),
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-border pl-4 italic mb-2">
                            {children}
                        </blockquote>
                    ),
                    h1: ({ children }) => <h1 className="text-2xl font-bold mb-2">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-bold mb-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-semibold mb-2">{children}</h3>,
                    h4: ({ children }) => <h4 className="text-base font-semibold mb-1">{children}</h4>,
                }}
            >
                {text}
            </ReactMarkdown>
        </div>
    );
};
