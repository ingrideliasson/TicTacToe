import { useState, useEffect, useRef } from "react";

function GameTimer({ gameTime, xIsNext , winner, setWinner}) {
  const xTimerRef = useRef(null);
  const oTimerRef = useRef(null);

  const [xTime, setXTime] = useState(gameTime);
  const [oTime, setOTime] = useState(gameTime);

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

  //Förlorare om timer tar slut
  useEffect(() => {
    if (xTime === 0) {
      console.log("X lost");
      setWinner("0");
    }
    if (oTime === 0) {
      console.log("O lost");
      setWinner("X");
    }
  }, [xTime, oTime]);

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
        <div>{xTime.toFixed(1)}</div>
      </div>
      <div className="flex flex-col items-center pr-5">
        <p className="font-bold">O-player</p>
        <div>{oTime.toFixed(1)}</div>
      </div>
    </div>
  );
}

export default GameTimer;
