import React, { useState, useEffect } from 'react';
import './OverlayText.css';

interface OverlayTextProps {
  text: string;
  width?: string | number;
  height?: string | number;
  top?: string | number;
  left?: string | number;
  right?: string | number;
  bottom?: string | number;
  typingSpeed?: number;
  className?: string;
}

const OverlayText: React.FC<OverlayTextProps> = ({
  text,
  width = '300px',
  height = '200px',
  top,
  left,
  right,
  bottom,
  typingSpeed = 50,
  className = ''
}) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  
  const textLines = text.split('\n');
  const maxLines = Math.floor(parseInt(height.toString()) / 20); // Approximate lines based on height
  const isTypingNow = currentCharIndex < (textLines[currentLineIndex] ?? '').length;
  
  const containerStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    position: 'fixed',
    ...(top !== undefined && { top: typeof top === 'number' ? `${top}px` : top }),
    ...(left !== undefined && { left: typeof left === 'number' ? `${left}px` : left }),
    ...(right !== undefined && { right: typeof right === 'number' ? `${right}px` : right }),
    ...(bottom !== undefined && { bottom: typeof bottom === 'number' ? `${bottom}px` : bottom }),
  };

  useEffect(() => {

    const currentLine = textLines[currentLineIndex];
    
    if (currentCharIndex < currentLine.length) {
      // Typing current character
      const timer = setTimeout(() => {
        setDisplayedLines(prev => {
          const newLines = [...prev];
          if (newLines.length === 0 || newLines[newLines.length - 1] === '') {
            newLines.push(currentLine.substring(0, currentCharIndex + 1));
          } else {
            newLines[newLines.length - 1] = currentLine.substring(0, currentCharIndex + 1);
          }
          return newLines;
        });
        setCurrentCharIndex(prev => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(timer);
    } else {
      // Move immediately to next line
      setCurrentLineIndex(prev => (prev + 1) % textLines.length);
      setCurrentCharIndex(0);
      setDisplayedLines(prev => {
        const newLines = [...prev];
        if (newLines.length >= maxLines) {
          newLines.shift();
        }
        newLines.push('');
        return newLines;
      });
    }
  }, [currentCharIndex, currentLineIndex, textLines, typingSpeed, maxLines]);

  return (
    <div 
      className={`overlay-text ${className}`}
      style={containerStyle}
    >
      {displayedLines.map((line, index) => (
        <div key={index} className="overlay-text-line">
          {line}
          {index === displayedLines.length - 1 && isTypingNow && (
            <span className="cursor">|</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default OverlayText;
