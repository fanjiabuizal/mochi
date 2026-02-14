import { useState, useEffect, useRef } from "react";
import Player from "./Player";
import Obstacle from "./Obstacle";
import { playSound } from "../utils/sound";

export default function Game({ onGameOver, onFinish }) {
  const [playerLeft, setPlayerLeft] = useState(40);
  const [playerBottom, setPlayerBottom] = useState(40);
  const [canJump, setCanJump] = useState(true);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(3);
  const [encouragement, setEncouragement] = useState("");
  const [jumpTriggered, setJumpTriggered] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  const gameLoopRef = useRef();
  const jumpVelocityRef = useRef(0);
  const obstacleCounterRef = useRef(0);
  const encouragementTimeoutRef = useRef(null);
  const jumpTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  const GROUND_HEIGHT = 40;
  const JUMP_STRENGTH = 30;
  const GRAVITY = 0.8;
  const PLAYER_WIDTH = 70;
  const PLAYER_HEIGHT = 70;
  const OBSTACLE_WIDTH = 70;
  const OBSTACLE_HEIGHT = 50;
  const WIN_SCORE = 14;

  // Adjust jump strength based on screen size
  const isMobile = window.innerWidth <= 768;
  const isLandscape = window.innerWidth > window.innerHeight;
  const adjustedJumpStrength = (isMobile && isLandscape) ? 20 : JUMP_STRENGTH;

  const encouragements = [
    "POV: Cewe baca map lebih cepet dari loading Google Maps 🗺️⚡",
    "Plot twist: Ternyata GPS yang nyasar, bukan Aisya 📍😎",
    "Stereotip cewe nyasar? Aisya: 'Hold my navigation skills' 💁",
    "When she says 'aku tau jalan' dan beneran tau jalan 🛣️✨",
    "Aisya speedrun any% world record 🏃‍♀️🔥",
    "Google Maps: 'Recalculating...' Aisya: 'Gausah, aku udah tau' 🧭",
    "Main character energy: ACTIVATED 💫",
    "Aisya: 1, Rintangan: 0 🎯",
  ];

  // Jump logic - FIX BUG #1: Prevent double jump
  const handleJump = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (canJump && playerBottom <= GROUND_HEIGHT + 5 && !gameEnded) {
      setCanJump(false);
      jumpVelocityRef.current = adjustedJumpStrength;
      setPlayerLeft(prev => Math.min(prev + 40, 120));
      setJumpTriggered(true);
      playSound.jump(); // Play jump sound
      
      // Clear previous timeout to prevent memory leak
      if (jumpTimeoutRef.current) {
        clearTimeout(jumpTimeoutRef.current);
      }
      jumpTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setJumpTriggered(false);
        }
      }, 1000);
    }
  };

  // FIX BUG #2: Generate more obstacles than needed
  useEffect(() => {
    const obstacleTypes = ["wrong_path", "dead_end", "blocked_road"];
    const generateObstacle = () => {
      const randomType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
      const newObstacle = {
        id: Date.now(),
        type: randomType,
        position: -100,
        passed: false,
      };
      setObstacles((prev) => [...prev, newObstacle]);
    };

    const interval = setInterval(() => {
      // Generate 20 obstacles to ensure enough for 14 wins
      if (obstacleCounterRef.current < 20 && !gameEnded) {
        generateObstacle();
        obstacleCounterRef.current++;
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [gameEnded]);

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      if (gameEnded) return;

      // Update player position (jump physics)
      setPlayerBottom((prev) => {
        let newBottom = prev + jumpVelocityRef.current;
        jumpVelocityRef.current -= GRAVITY;

        if (newBottom <= GROUND_HEIGHT) {
          newBottom = GROUND_HEIGHT;
          jumpVelocityRef.current = 0;
          setCanJump(true);
          setPlayerLeft(40);
        }

        return newBottom;
      });

      // Move obstacles
      setObstacles((prevObstacles) => {
        const updatedObstacles = prevObstacles
          .map((obstacle) => {
            const obstacleLeft = window.innerWidth - obstacle.position;
            const isNearPlayer = obstacleLeft > 50 && obstacleLeft < 500;
            
            const speedMultiplier = (jumpTriggered && isNearPlayer) ? 10 : 1;
            const newPosition = obstacle.position + (gameSpeed * speedMultiplier);
            return { ...obstacle, position: newPosition };
          })
          .filter((obstacle) => {
            if (obstacle.position >= window.innerWidth + 100) {
              if (!obstacle.passed) {
                setScore((s) => s + 1);
                
                // FIX BUG #7: Clear previous timeout before setting new one
                if (isMountedRef.current) {
                  const randomMsg = encouragements[Math.floor(Math.random() * encouragements.length)];
                  setEncouragement(randomMsg);
                  
                  if (encouragementTimeoutRef.current) {
                    clearTimeout(encouragementTimeoutRef.current);
                  }
                  encouragementTimeoutRef.current = setTimeout(() => {
                    if (isMountedRef.current) {
                      setEncouragement("");
                    }
                  }, 2000);
                }
              }
              return false;
            }
            return true;
          });

        return updatedObstacles;
      });

      // FIX BUG #6: Dynamic collision detection based on screen size
      setObstacles((currentObstacles) => {
        if (gameEnded) return currentObstacles;

        const currentPlayerLeft = playerLeft;
        const playerRight = currentPlayerLeft + PLAYER_WIDTH;
        const playerTop = window.innerHeight - playerBottom - PLAYER_HEIGHT;
        const playerBottomPos = window.innerHeight - playerBottom;

        // Adjust hitbox margin based on screen size
        const isMobile = window.innerWidth <= 480;
        const hitboxMargin = isMobile ? 25 : 30;

        for (let obstacle of currentObstacles) {
          const obstacleLeft = window.innerWidth - obstacle.position;
          const obstacleRight = obstacleLeft + OBSTACLE_WIDTH;
          const obstacleTop = window.innerHeight - GROUND_HEIGHT - OBSTACLE_HEIGHT;
          const obstacleBottom = window.innerHeight - GROUND_HEIGHT;

          if (
            playerRight > obstacleLeft + hitboxMargin &&
            currentPlayerLeft < obstacleRight - hitboxMargin &&
            playerBottomPos > obstacleTop + hitboxMargin &&
            playerTop < obstacleBottom - hitboxMargin
          ) {
            // FIX BUG #3: Prevent race condition
            if (!gameEnded) {
              playSound.hit(); // Play hit sound
              setTimeout(() => playSound.gameOver(), 100); // Play game over sound
              setGameEnded(true);
              onGameOver();
            }
            return currentObstacles;
          }
        }

        return currentObstacles;
      });

      // FIX BUG #3: Check win condition with game ended flag
      if (score >= WIN_SCORE && !gameEnded) {
        playSound.success(); // Play success sound
        setGameEnded(true);
        onFinish();
      }
    };

    gameLoopRef.current = setInterval(gameLoop, 1000 / 60);

    // FIX BUG #4: Proper cleanup
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [playerBottom, playerLeft, gameSpeed, score, jumpTriggered, gameEnded, onGameOver, onFinish, encouragements]);

  // FIX BUG #4 & #7: Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      if (encouragementTimeoutRef.current) {
        clearTimeout(encouragementTimeoutRef.current);
      }
      if (jumpTimeoutRef.current) {
        clearTimeout(jumpTimeoutRef.current);
      }
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, []);

  return (
    <div className="game-container">
      <div className="game-background">
        <div className="building building-1">🏢</div>
        <div className="building building-2">🏛️</div>
        <div className="building building-3">🏢</div>
        <div className="building building-4">🏪</div>
        <div className="building building-5">🏢</div>
        <div className="cloud">☁️</div>
        <div className="cloud cloud-2">☁️</div>
        <div className="cloud cloud-3">☁️</div>
      </div>

      <div className="score">
        <div className="score-text">Perjalanan: {score}/{WIN_SCORE}</div>
        <div className="target">🎁 Hadiah Valentine</div>
      </div>

      {encouragement && <div className="encouragement-bubble">{encouragement}</div>}

      <Player jump={!canJump} playerBottom={playerBottom} playerLeft={playerLeft} />

      {obstacles.map((obstacle) => (
        <Obstacle key={obstacle.id} type={obstacle.type} position={obstacle.position} />
      ))}

      <div className="ground"></div>

      {/* FIX BUG #5: Prevent touch/mouse conflict */}
      <button
        className="jump-btn"
        onTouchStart={(e) => {
          e.preventDefault();
          handleJump(e);
        }}
        onTouchEnd={(e) => e.preventDefault()}
        onMouseDown={(e) => {
          // Only trigger on mouse click if not touch device
          if (!('ontouchstart' in window)) {
            e.preventDefault();
            handleJump(e);
          }
        }}
        style={{ touchAction: 'none', WebkitTapHighlightColor: 'transparent' }}
      >
        JUMP
      </button>
    </div>
  );
}
