'use client';

import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      renderContent();
    }
  }, [content]);

  const renderContent = () => {
    if (!containerRef.current) return;

    let html = content;

    // 处理块级公式 $$...$$
    html = html.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
      try {
        return `<div class="katex-display">${katex.renderToString(formula.trim(), {
          displayMode: true,
          throwOnError: false,
        })}</div>`;
      } catch (e) {
        return `<div class="katex-error">公式错误: ${formula}</div>`;
      }
    });

    // 处理行内公式 $...$
    html = html.replace(/\$([^\$\n]+?)\$/g, (match, formula) => {
      try {
        return katex.renderToString(formula.trim(), {
          displayMode: false,
          throwOnError: false,
        });
      } catch (e) {
        return `<span class="katex-error">公式错误: ${formula}</span>`;
      }
    });

    // 处理粗体 **text** 或 __text__
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
    
    // 处理斜体 *text* 或 _text_ (但不是公式中的)
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');
    
    // 处理换行
    html = html.replace(/\n/g, '<br />');

    containerRef.current.innerHTML = html;
  };

  return (
    <div
      ref={containerRef}
      className="prose prose-sm max-w-none text-gray-700"
      style={{
        fontSize: '14px',
        lineHeight: '1.6',
      }}
    />
  );
}
