'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { FileText } from 'lucide-react';

interface MarkdownViewerProps {
    content: string;
    className?: string;
}

export function MarkdownViewer({ content, className = '' }: MarkdownViewerProps) {
    if (!content) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mb-3 text-gray-400" />
                <p className="text-sm">Không có nội dung để hiển thị</p>
            </div>
        );
    }

    return (
        <div className={`markdown-viewer ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={{
                    // Headings
                    h1: ({ node, ...props }) => (
                        <h1 className="text-3xl font-bold text-gray-900 mb-4 mt-6 font-poppins" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-5 font-poppins" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                        <h3 className="text-xl font-bold text-gray-900 mb-3 mt-4 font-poppins" {...props} />
                    ),
                    h4: ({ node, ...props }) => (
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 mt-3 font-poppins" {...props} />
                    ),
                    h5: ({ node, ...props }) => (
                        <h5 className="text-base font-semibold text-gray-900 mb-2 mt-3 font-poppins" {...props} />
                    ),
                    h6: ({ node, ...props }) => (
                        <h6 className="text-sm font-semibold text-gray-900 mb-2 mt-3 font-poppins" {...props} />
                    ),

                    // Paragraphs
                    p: ({ node, ...props }) => (
                        <p className="text-gray-700 mb-4 leading-relaxed font-open-sans" {...props} />
                    ),

                    // Links
                    a: ({ node, ...props }) => (
                        <a
                            className="text-primary hover:text-blue-700 underline font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                        />
                    ),

                    // Lists
                    ul: ({ node, ...props }) => (
                        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 font-open-sans" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                        <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 font-open-sans" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                        <li className="ml-4" {...props} />
                    ),

                    // Code
                    code: ({ node, inline, ...props }: any) =>
                        inline ? (
                            <code
                                className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono"
                                {...props}
                            />
                        ) : (
                            <code
                                className="block bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 overflow-x-auto font-mono text-sm"
                                {...props}
                            />
                        ),
                    pre: ({ node, ...props }) => (
                        <pre className="bg-gray-900 rounded-lg mb-4 overflow-x-auto" {...props} />
                    ),

                    // Blockquotes
                    blockquote: ({ node, ...props }) => (
                        <blockquote
                            className="border-l-4 border-primary bg-blue-50 pl-4 py-2 mb-4 italic text-gray-700 font-open-sans"
                            {...props}
                        />
                    ),

                    // Tables
                    table: ({ node, ...props }) => (
                        <div className="overflow-x-auto mb-4">
                            <table className="min-w-full border border-gray-300 font-open-sans" {...props} />
                        </div>
                    ),
                    thead: ({ node, ...props }) => (
                        <thead className="bg-gray-100" {...props} />
                    ),
                    tbody: ({ node, ...props }) => (
                        <tbody {...props} />
                    ),
                    tr: ({ node, ...props }) => (
                        <tr className="border-b border-gray-300" {...props} />
                    ),
                    th: ({ node, ...props }) => (
                        <th className="px-4 py-2 text-left font-semibold text-gray-900 border-r border-gray-300 last:border-r-0" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                        <td className="px-4 py-2 text-gray-700 border-r border-gray-300 last:border-r-0" {...props} />
                    ),

                    // Horizontal Rule
                    hr: ({ node, ...props }) => (
                        <hr className="my-6 border-gray-300" {...props} />
                    ),

                    // Images
                    img: ({ node, ...props }) => (
                        <img
                            className="max-w-full h-auto rounded-lg my-4"
                            {...props}
                        />
                    ),

                    // Strong/Bold
                    strong: ({ node, ...props }) => (
                        <strong className="font-bold text-gray-900" {...props} />
                    ),

                    // Emphasis/Italic
                    em: ({ node, ...props }) => (
                        <em className="italic" {...props} />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
