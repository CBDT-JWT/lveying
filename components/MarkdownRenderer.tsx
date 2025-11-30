// client-side renderer
'use client';

import { useEffect, useRef, useCallback } from 'react';
import katex from 'katex';
import { format } from 'path';

interface MarkdownRendererProps {
  content: string;
  formatNames?: boolean; // 是否格式化人名为统一宽度，默认false
  className?: string;
  style?: React.CSSProperties;
}

export default function MarkdownRenderer({ content, formatNames = false, className = '', style = {} }: MarkdownRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const renderContent = useCallback(() => {
    if (!containerRef.current) return;
    // 规范化输入：去除 BOM，统一换行符，修剪两端空白
    const rawInput = (content || '').toString().replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').trim();
    let html = rawInput;

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

    // 处理标题
  html = html.replace(/^### (.+$)/gim, '<h3 class="text-lg font-semibold text-gray-800 drop-shadow-lg mt-4 mb-2 text-left break-all whitespace-normal">$1</h3>');
  html = html.replace(/^## (.+$)/gim, '<h2 class="text-lg font-bold text-gray-800 mt-10 mb-3 text-center break-all whitespace-normal">$1</h2>');
  html = html.replace(/^# (.+$)/gim, '<h1 class="text-2xl font-bold text-gray-800 drop-shadow-lg mt-8 mb-4 text-left break-all whitespace-normal">$1</h1>');
  if(formatNames){
    // 处理职位和人员格式（**职位**：人员名单）
    html = html.replace(/^(?!<)(?:\*\*([^*]+)\*\*\s*)?(.+?)(?=\n|$)/gm,(match, title, names) => {
      const safeTitle = title?.trim() || '';
      const safeNames = names.trim();
      
    // 如果标题不存在，走“无标题”的渲染逻辑
      
      if (formatNames) {
        // 将人名按空格分割并格式化为固定宽度
        const formattedNames = safeNames.trim().split(/\s+/).map((name: string) => {
  let chars = name.split('');
  if (chars.length == 2) {
    let tmpchar = chars.pop();
    chars.push('&ensp;'); // 补一个全角占位
    chars.push(tmpchar!);
  }
  if (chars.length == 4){
    return `<span class="inline-flex w-[4em] mx-1.5 mb-0 leading-none text-center text-xs items-start">
    ${chars.map(c => `<span class="inline-block w-[1em]">${c}</span>`).join('')}
  </span>`;
  }

  return `<span class="inline-flex w-[3em] mx-1.5 mb-0 text-center items-start">
    ${chars.map(c => `<span class="inline-block w-[1em]">${c}</span>`).join('')}
  </span>`;
}).join(' ');
        if (!safeTitle) {
        return `<div class="flex mb-2 min-h-[1.5em] items-start justify-center">
           <div class="text-gray-700 drop-shadow-md text-center justify-center leading-relaxed flex flex-wrap items-start">${formattedNames}</div>
        </div>`;
      }
        else {
        return `<div class="flex mb-2 min-h-[1.5em] items-start">
          <span class="font-bold text-gray-800 drop-shadow-md min-w-[140px] text-left flex-shrink-0 mr-1 break-words">${safeTitle}</span>
          <div class="text-gray-700 drop-shadow-md text-left w-[3em] flex-1 leading-relaxed flex flex-wrap items-start">${formattedNames}</div>
        </div>`;
        }
      } else {
        // 普通格式，不格式化人名
        return `<div class="flex mb-3 min-h-[1.5em] items-start">
          <span class="font-bold text-gray-800 drop-shadow-md min-w-[140px] text-left flex-shrink-0 mr-2 break-words">${title}</span>
          <span class="text-gray-700 drop-shadow-md text-left w-[3em] flex-1 leading-relaxed whitespace-normal" style="word-break: keep-all; overflow-wrap: break-word;">${names}</span>
        </div>`;
      }
    });
  }
    // 处理其他粗体 **text** 或 __text__
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-gray-800 drop-shadow-md">$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong class="font-bold text-gray-800 drop-shadow-md">$1</strong>');
    
    // 处理斜体 *text* 或 _text* (但不是公式中的)
    html = html.replace(/\*(.+?)\*/g, '<em class="italic text-gray-700">$1</em>');
    html = html.replace(/_(.+?)_/g, '<em class="italic text-gray-700">$1</em>');
    
    // 处理段落（两个换行符表示段落）
    html = html.replace(/\n\n/g, '</p><p class="mb-3 text-gray-700 drop-shadow-md leading-relaxed whitespace-normal" style="word-break: keep-all; overflow-wrap: break-word;">');
    html = '<p class="mb-3 text-gray-700 drop-shadow-md leading-relaxed whitespace-normal" style="word-break: keep-all; overflow-wrap: break-word;">' + html + '</p>';
    
    // 给纯文本段落（不包含标题或职位格式的）处理格式
    html = html.replace(/<p class="mb-3 text-gray-700[^>]*">([^<]*(?!<h|<div)[^<]*)<\/p>/g, (match, content) => {
      // 检查是否是纯人名列表（没有冒号的内容）
      if (formatNames && content && !content.includes('：') && !content.includes('<h')) {
        const formattedNames = content.trim().split(/\s+/).map((name: string) => 
          `<span class="inline-block text-center w-[4em] mx-0.5 mb-1">${name}</span>`
        ).join('');
        return `<div class="mb-3 text-gray-700 drop-shadow-md leading-relaxed text-left flex flex-wrap items-start">${formattedNames}</div>`;
      }
      return '<p class="mb-3 text-gray-700 drop-shadow-md leading-relaxed text-left whitespace-normal" style="word-break: keep-all; overflow-wrap: break-word;">' + content + '</p>';
    });
    
    // 处理单个换行
    html = html.replace(/\n/g, '<br />');

    containerRef.current.innerHTML = html;

    // 如果 URL 中带 ?dbg=1，则把原始与生成的 HTML 打印到控制台，便于在生产环境对比
    try {
      if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('dbg') === '1') {
        // 打印到控制台和在页面中可见的调试信息
        // eslint-disable-next-line no-console
        console.log('MarkdownRenderer DEBUG - raw input:', rawInput);
        // eslint-disable-next-line no-console
        console.log('MarkdownRenderer DEBUG - generated html:', html);
      }
    } catch (e) {
      // ignore
    }
  }, [content]);

  useEffect(() => {
    if (containerRef.current) {
      renderContent();
    }
  }, [content, renderContent]);

  const defaultStyle: React.CSSProperties = {
    fontSize: '16px',
    lineHeight: '1.8',
    wordBreak: 'keep-all',
    overflowWrap: 'break-word',
    wordSpacing: '0.1em',
  };

  return (
    <div
      ref={containerRef}
      className={`max-w-none w-full min-w-0 text-gray-700 text-left break-words ${className}`}
      style={{ ...defaultStyle, ...style }}
    />
  );
}
