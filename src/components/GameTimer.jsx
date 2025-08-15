import { useState, useEffect, useRef } from "react";
import { color, motion, useAnimation } from "framer-motion";
import { use } from "framer-motion/m";

function GameTimer({ gameTime, xIsNext , winner, setWinner, isTie}) {
  const xTimerRef = useRef(null);
  const oTimerRef = useRef(null);

  const [xTime, setXTime] = useState(gameTime);
  const [oTime, setOTime] = useState(gameTime);
  const animationTriggerO = useAnimation();
  const animationTriggerX = useAnimation();
  const [isAnimatingO, setIsAnimatingO] = useState(false);
  const [isAnimatingX, setIsAnimatingX] = useState(false);

  // Starta/stoppa timers när xIsNext ändras
  useEffect(() => {
    if (xIsNext) {
      startX();
      stopO();
    } else {
      startO();
      stopX();
    }

    return () => {
      clearInterval(xTimerRef.current);
      clearInterval(oTimerRef.current);
    };
  }, [xIsNext]);

  //stoppa timer vid lika
  useEffect(() => {
    if (isTie) {
      stopX();
      stopO();
      setIsAnimatingX(false);
      setIsAnimatingO(false);
    }
  }, [isTie]);

  //starta animation när timer är under 5 sek
  useEffect(() => {
    setIsAnimatingO(oTime <= 5 && !xIsNext);
    setIsAnimatingX(xTime <= 5 && xIsNext);
  
  if (winner) {
    setIsAnimatingX(false);
    setIsAnimatingO(false);
  }
  }, [oTime, xTime, xIsNext, winner]);

  //animation till timer
  useEffect(() => {
  if (oTime === 0 || xTime === 0) {
    animationTriggerO.start({ rotate: 0, scale: 1, color: "black" });
    animationTriggerX.start({ rotate: 0, scale: 1, color: "black" });
  }
  if (isAnimatingO) {
    animationTriggerO.start({
      rotate: [-20, 20, -20], // frames för animationen
      scale: [1, 1.5, 1],
      color: ["red", "darkred", "red"],
      transition: {
        duration: 1, // hur lång tid en cykel tar
        repeat: Infinity, // pågående animation
        ease: "easeInOut"
      }
    });
  } else {
    // återställ till normal
    animationTriggerO.start({ rotate: 0, scale: 1, color: "black" });
    animationTriggerX.start({ rotate: 0, scale: 1, color: "black" });
    }

  if (isAnimatingX) {
    animationTriggerX.start({
      rotate: [-20, 20, -20], // frames för animationen
      scale: [1, 1.5, 1],
      color: ["red", "darkred", "red"],
      transition: {
        duration: 1, // hur lång tid en cykel tar
        repeat: Infinity, // pågående animation
        ease: "easeInOut"
      }
    });
  } else {
    // återställ till normal
    animationTriggerX.start({ rotate: 0, scale: 1, color: "black" });
  }
}, [isAnimatingO, isAnimatingX]);

  //uppdatera gametime vid ändring
  useEffect(() => {
    setXTime(gameTime)
    setOTime(gameTime)
  }, [gameTime]);

  //Förlorare om timer tar slut
  useEffect(() => {
    if (xTime === 0) {
      setWinner("O");
    }
    if (oTime === 0) {
      setWinner("X");
    }
  }, [xTime, oTime, setWinner]);

   //Stoppa timer om vinnare utses
  useEffect(() => {
    if (winner) {
      stopO();
      stopX();
    }
  }, [winner]);


  function startX() {
    if (xTimerRef.current) return; // redan igång
    xTimerRef.current = setInterval(() => {
      setXTime(prev => {
        if (prev <= 0) {
          clearInterval(xTimerRef.current);
          xTimerRef.current = null;
          return 0;
        }
        return parseFloat((prev - 0.1).toFixed(1));
      });
    }, 100);
  }

  function stopX() {
    clearInterval(xTimerRef.current);
    xTimerRef.current = null;
  }

  function startO() {
    if (oTimerRef.current) return;
    oTimerRef.current = setInterval(() => {
      setOTime(prev => {
        if (prev <= 0) {
          clearInterval(oTimerRef.current);
          oTimerRef.current = null;
          return 0;
        }
        return parseFloat((prev - 0.1).toFixed(1));
      });
    }, 100);
  }

  function stopO() {
    clearInterval(oTimerRef.current);
    oTimerRef.current = null;
  }

  return (
    <div className="flex w-full justify-between items-center">
      <div className="flex flex-col items-center pl-5">
        <p className="font-bold">X-player</p>
        <motion.div
          initial={{ rotate: 0, scale: 1, color: "black" }}
          animate={animationTriggerX}
        >{Number(xTime).toFixed(1)}</motion.div>
      </div>
      <div className="flex flex-col items-center pr-5">
        <p className="font-bold">O-player</p>
        <motion.div
          initial={{ rotate: 0, scale: 1, color: "black" }}
          animate={animationTriggerO}
        >{Number(oTime).toFixed(1)}</motion.div>
      </div>
    </div>
  );
}

export default GameTimer;
