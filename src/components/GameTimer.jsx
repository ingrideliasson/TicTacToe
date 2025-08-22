import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import ChangeGameTime from './ChangeGameTime.jsx';

function GameTimer({ gameTime, setGameTime, xIsNext , winner, setWinner, isTie, isGameRunning }) {
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
    if (winner || isTie) {
      stopX();
      stopO();
      setIsAnimatingX(false);
      setIsAnimatingO(false);
    }
  }, [winner, isTie]);

  useEffect(() => {
  if (!isGameRunning || winner || isTie) {
    stopX();
    stopO();
    return;
  }
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
}, [xIsNext, isGameRunning, winner, isTie]);

  //stoppa timer vid lika
  useEffect(() => {
    if (isTie) {
      stopX();
      stopO();
      setIsAnimatingX(false);
      setIsAnimatingO(false);
    }
  }, [isTie]);

  useEffect(() => {
  // Stop animation if winner is an array (win by 3 in a row)
  if (Array.isArray(winner)) {
    setIsAnimatingX(false);
    setIsAnimatingO(false);
    return;
  }
  setIsAnimatingO(oTime <= 5 && !xIsNext);
  setIsAnimatingX(xTime <= 5 && xIsNext);
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
    <div className="flex w-full justify-between items-center gap-1 md:gap-6">
      
      <div className="flex flex-col items-center pr-[1.75vw] md:pr-[4vw] 2xl:pr-[5vw]">
        <p className="font-cherry text-blue-400 text-3xl">X</p>
        <p className="text-lg tabular-nums w-[4ch] text-center">
          <motion.span
            initial={{ rotate: 0, scale: 1, color: "black" }}
            animate={animationTriggerX}
            style={{ display: "inline-block" }}
          >
            {Number(xTime).toFixed(1)}
          </motion.span>
        </p>
      </div>

      <ChangeGameTime gameTime={gameTime} setGameTime={setGameTime} isGameRunning={isGameRunning} />
      
      <div className="flex flex-col items-center pl-[1.75vh] md:pl-[4vw] 2xl:pl-[5vw]">
        <p className="font-cherry text-amber-300 text-3xl">O</p>
        <p className="text-lg tabular-nums w-[4ch] text-center">
          <motion.span
            initial={{ rotate: 0, scale: 1, color: "black" }}
            animate={animationTriggerO}
            style={{ display: "inline-block" }}
          >
            {Number(oTime).toFixed(1)}
          </motion.span>
        </p>
      </div>

    </div>
  );
}

export default GameTimer;
