import { useState } from "react";
import StartModal from "./components/StartModal";
import Game from "./components/Game";
import EndModal from "./components/EndModal";

export default function App() {
  const [gameState, setGameState] = useState("start");

  return (
    <div className="app">
      {gameState === "start" && (
        <StartModal onStart={() => setGameState("playing")} />
      )}

      {gameState === "playing" && (
        <Game
          onGameOver={() => setGameState("gameOver")}
          onFinish={() => setGameState("finished")}
        />
      )}

      {(gameState === "finished" || gameState === "gameOver") && (
        <EndModal
          gameState={gameState}
          onRestart={() => setGameState("start")}
        />
      )}
    </div>
  );
}
