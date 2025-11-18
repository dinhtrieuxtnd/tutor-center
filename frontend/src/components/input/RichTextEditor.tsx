'use client';

import { useRef, useEffect, useState } from 'react';
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
} from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    maxLength?: number;
    minHeight?: string;
    maxHeight?: string;
    className?: string;
}

export function RichTextEditor({
    value,
    onChange,
    placeholder = 'Nhập nội dung...',
    maxLength = 5000,
    minHeight = '200px',
    maxHeight = '500px',
    className = '',
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [charCount, setCharCount] = useState(0);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value;
        }
        setCharCount(value.replace(/<[^>]*>/g, '').length);
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            const content = editorRef.current.innerHTML;
            const textContent = editorRef.current.innerText;
            
            if (textContent.length <= maxLength) {
                onChange(content);
                setCharCount(textContent.length);
            } else {
                // Prevent exceeding max length
                editorRef.current.innerHTML = value;
            }
        }
    };

    const executeCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    };

    const toolbarButtons = [
        {
            icon: Bold,
            command: 'bold',
            title: 'In đậm (Ctrl+B)',
        },
        {
            icon: Italic,
            command: 'italic',
            title: 'In nghiêng (Ctrl+I)',
        },
        {
            icon: Underline,
            command: 'underline',
            title: 'Gạch chân (Ctrl+U)',
        },
        {
            type: 'divider',
        },
        {
            icon: List,
            command: 'insertUnorderedList',
            title: 'Danh sách không thứ tự',
        },
        {
            icon: ListOrdered,
            command: 'insertOrderedList',
            title: 'Danh sách có thứ tự',
        },
        {
            type: 'divider',
        },
        {
            icon: AlignLeft,
            command: 'justifyLeft',
            title: 'Căn trái',
        },
        {
            icon: AlignCenter,
            command: 'justifyCenter',
            title: 'Căn giữa',
        },
        {
            icon: AlignRight,
            command: 'justifyRight',
            title: 'Căn phải',
        },
    ];

    return (
        <div className={`border rounded-lg overflow-hidden transition-all ${isFocused ? 'ring-2 ring-orange-500 border-orange-500' : 'border-gray-300'} ${className}`}>
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex items-center gap-1 flex-wrap">
                {toolbarButtons.map((button, index) => {
                    if (button.type === 'divider') {
                        return (
                            <div
                                key={`divider-${index}`}
                                className="w-px h-6 bg-gray-300 mx-1"
                            />
                        );
                    }

                    const Icon = button.icon!;
                    return (
                        <button
                            key={button.command}
                            type="button"
                            onClick={() => executeCommand(button.command!)}
                            className="p-2 rounded hover:bg-gray-200 transition-colors"
                            title={button.title}
                        >
                            <Icon className="w-4 h-4 text-gray-700" />
                        </button>
                    );
                })}
            </div>

            {/* Editor */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onPaste={handlePaste}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="p-4 outline-none overflow-y-auto font-open-sans text-gray-900"
                style={{
                    minHeight,
                    maxHeight,
                }}
                data-placeholder={placeholder}
                suppressContentEditableWarning
            />

            {/* Character Counter */}
            <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 flex justify-end">
                <span className={`text-sm font-open-sans ${charCount > maxLength * 0.9 ? 'text-orange-600 font-semibold' : 'text-gray-500'}`}>
                    {charCount} / {maxLength}
                </span>
            </div>

            <style jsx>{`
                [contenteditable][data-placeholder]:empty:before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
}
