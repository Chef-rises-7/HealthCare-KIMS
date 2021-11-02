import { useEffect } from "react";
import useSound from "use-sound";

export default function Sound({ counter }) {
  const [play] = useSound("https://www.kozco.com/tech/piano2.wav", { interrupt: true });

  useEffect(() => {
    setTimeout(() => {
      play();
    },5000);
    
  }, [counter, play]);
  return null;
}
