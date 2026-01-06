import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Component to render text with LaTeX math expressions
 * Supports both inline math ($...$) and display math ($$...$$)
 * 
 * @param {string} text - Text containing LaTeX expressions
 * @param {string} className - Additional CSS classes
 */
export const LatexRenderer = ({ text, className = '' }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!text || !containerRef.current) return;

        try {
            // Parse and render LaTeX in the text
            const rendered = renderLatex(text);
            containerRef.current.innerHTML = rendered;
        } catch (error) {
            console.error('LaTeX rendering error:', error);
            containerRef.current.textContent = text;
        }
    }, [text]);

    return <div ref={containerRef} className={className} />;
};

/**
 * Parse text and render LaTeX expressions
 * @param {string} text - Input text with LaTeX
 * @returns {string} HTML string with rendered LaTeX
 */
function renderLatex(text) {
    if (!text) return '';

    let result = text;
    
    // Replace display math ($$...$$) first
    result = result.replace(/\$\$([^\$]+)\$\$/g, (match, latex) => {
        try {
            return katex.renderToString(latex.trim(), {
                displayMode: true,
                throwOnError: false,
                trust: true,
            });
        } catch (e) {
            console.error('LaTeX error (display):', e);
            return match;
        }
    });

    // Replace inline math ($...$)
    result = result.replace(/\$([^\$]+)\$/g, (match, latex) => {
        try {
            return katex.renderToString(latex.trim(), {
                displayMode: false,
                throwOnError: false,
                trust: true,
            });
        } catch (e) {
            console.error('LaTeX error (inline):', e);
            return match;
        }
    });

    // Convert newlines to <br> tags
    result = result.replace(/\n/g, '<br>');

    return result;
}

export default LatexRenderer;
