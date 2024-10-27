import { useState, useEffect } from "react";

function TypingEffect({ text, speed = 150 }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const handleTyping = () => {
      if (isDeleting) {
        // deletion 
        if (displayedText.length > 0) {
          setDisplayedText(text.slice(0, displayedText.length - 1));
        } else {
          setIsDeleting(false);
          setIndex(0);
        }
      } else {
        // writing
        if (displayedText.length < text.length) {
          setDisplayedText(text.slice(0, displayedText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 6000); // wait to delete
        }
      }
    };

    const timer = setTimeout(handleTyping, speed);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, text, speed]);
  
  console.log(index)
  return <span>{displayedText}</span>;
}

export default TypingEffect;
