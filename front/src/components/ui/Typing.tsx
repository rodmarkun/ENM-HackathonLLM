import { useState, useEffect } from "react";

type Props = {
  text: string;
  speed: number;
};

function TypingEffect({ text, speed }: Props) {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      if (isDeleting) {
        // deletion
        if (displayedText.length > 0) {
          setDisplayedText(text.slice(0, displayedText.length - 1));
        } else {
          setIsDeleting(false);
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

  return <span>{displayedText}</span>;
}

export default TypingEffect;
