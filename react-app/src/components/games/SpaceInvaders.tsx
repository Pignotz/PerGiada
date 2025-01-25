import React, { useState, useEffect, useRef } from 'react';
import './SpaceInvaders.css';

interface Bullet {
  x: number;
  y: number;
  hit: boolean; // Nuova proprietà per indicare se il proiettile ha colpito
}

interface Invader {
  x: number;
  y: number;
  alive: boolean;
}

const SpaceInvaders: React.FC = () => {
  const [playerPos, setPlayerPos] = useState<number>(250); // Posizione iniziale del giocatore
  const [bullets, setBullets] = useState<Bullet[]>([]); // Array di proiettili
  const [invaders, setInvaders] = useState<Invader[]>([]); // Array di invaders
  const [gameOver, setGameOver] = useState<boolean>(false); // Stato del gioco
  const [score, setScore] = useState<number>(0); // Punteggio
  const [canShoot, setCanShoot] = useState<boolean>(true); // Stato per il controllo dei tiri
  const [paused, setPaused] = useState<boolean>(false); // Stato di pausa
  const invaderRowCount = 5;
  const invaderColumnCount = 11;
  const bulletSpeed = 5;
  const invaderSpeed = 8;
  const gameOverLimit = 700; // Limite oltre il quale il gioco termina

  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Inizializza gli invaders
  useEffect(() => {
    const initialInvaders: Invader[] = [];
    for (let row = 0; row < invaderRowCount; row++) {
      for (let col = 0; col < invaderColumnCount; col++) {
        initialInvaders.push({
          x: col * 50 + 30,
          y: row * 50 + 30,
          alive: true
        });
      }
    }
    setInvaders(initialInvaders);
  }, []);

  // Funzione per sparare un proiettile
  const shootBullet = () => {
    if (canShoot && !paused) {
      setBullets(prevBullets => [
        ...prevBullets,
        { x: playerPos + 17, y: 600, hit: false }
      ]);
      setCanShoot(false); // Disabilita il tiro per un breve periodo
    }
  };

  // Aggiorna la posizione dei proiettili
  useEffect(() => {
    if (paused) return;

    const bulletMovementInterval = setInterval(() => {
      setBullets(prevBullets => {
        const newBullets = prevBullets
          .map(bullet => ({
            ...bullet,
            y: bullet.y - bulletSpeed
          }))
          .filter(bullet => bullet.y > 0 && !bullet.hit); // Rimuove i proiettili colpiti o fuori dallo schermo

        // Gestisce la collisione tra proiettili e invaders
        setInvaders(prevInvaders => {
          const updatedInvaders = [...prevInvaders];

          newBullets.forEach(bullet => {
            if (!bullet.hit) {
              for (let i = 0; i < updatedInvaders.length; i++) {
                const invader = updatedInvaders[i];
                if (
                  invader.alive &&
                  bullet.x > invader.x &&
                  bullet.x < invader.x + 20 &&
                  bullet.y > invader.y &&
                  bullet.y < invader.y + 20
                ) {
                  updatedInvaders[i] = { ...invader, alive: false }; // L'invader è stato colpito
                  bullet.hit = true; // Segna il proiettile come usato
                  setScore(prevScore => prevScore + 100); // Aggiungi punti
                  break; // Interrompe il ciclo per impedire ulteriori collisioni
                }
              }
            }
          });

          return updatedInvaders;
        });

        return newBullets;
      });
    }, 50);

    return () => clearInterval(bulletMovementInterval);
  }, [paused]);

  // Gestisce il movimento degli invaders
  useEffect(() => {
    if (paused) return;

    const invaderMovementInterval = setInterval(() => {
      setInvaders(prevInvaders => {
        const allDead = prevInvaders.every(invader => !invader.alive);
        if (allDead) {
          setGameOver(true);
          clearInterval(invaderMovementInterval);
          return prevInvaders;
        }

        return prevInvaders.map(invader => {
          if (invader.alive) {
            const newY = invader.y + invaderSpeed;
            if (newY > gameOverLimit) {
              setGameOver(true); // Termina il gioco se un invader supera il limite
            }
            return { ...invader, y: newY };
          }
          return invader;
        });
      });
    }, 1000);

    return () => clearInterval(invaderMovementInterval);
  }, [paused]);

  // Gestisce i movimenti del giocatore
  const movePlayer = (e: KeyboardEvent) => {
    if (paused) return;

    if (e.key === 'ArrowLeft' && playerPos > 0) {
      setPlayerPos(prevPos => prevPos - 10);
    } else if (e.key === 'ArrowRight' && playerPos < 560) {
      setPlayerPos(prevPos => prevPos + 10);
    } else if (e.key === ' ') {
      shootBullet();
    }
  };

  // Ascolta i tasti per il movimento e il tiro
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.repeat) movePlayer(e);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [playerPos, paused]);

  // Rende di nuovo possibile sparare dopo un breve ritardo
  useEffect(() => {
    if (!canShoot) {
      const shootTimeout = setTimeout(() => {
        setCanShoot(true);
      }, 300);
      return () => clearTimeout(shootTimeout);
    }
  }, [canShoot]);

  // Funzioni per pausa e reset
  const togglePause = () => setPaused(!paused);

  const resetGame = () => {
    setPlayerPos(250);
    setBullets([]);
    setScore(0);
    setGameOver(false);
    setPaused(false);

    const initialInvaders: Invader[] = [];
    for (let row = 0; row < invaderRowCount; row++) {
      for (let col = 0; col < invaderColumnCount; col++) {
        initialInvaders.push({
          x: col * 50 + 30,
          y: row * 50 + 30,
          alive: true
        });
      }
    }
    setInvaders(initialInvaders);
  };

  if (gameOver) {
    return (
      <div className="game-container">
        <h1>Game Over</h1>
        <h3>Final Score: {score}</h3>
        <button onClick={resetGame}>Reset Game</button>
      </div>
    );
  }

  return (
    <div className="game-container">
      <h1>Space Invaders</h1>
      <h3>Score: {score}</h3>
      <div className="controls">
        <button onClick={togglePause}>{paused ? 'Resume' : 'Pause'}</button>
        <button onClick={resetGame}>Reset</button>
      </div>
      <div className="game-area" ref={gameAreaRef}>
        {invaders.map((invader, index) => (
          invader.alive && <div key={index} className="invader" style={{ left: invader.x, top: invader.y }} />
        ))}
        <div
          className="player"
          style={{
            left: `${playerPos}px`,
            bottom: '30px',
          }}
        />
        {bullets.map((bullet, index) => (
          <div key={index} className="bullet" style={{ left: bullet.x, top: bullet.y }} />
        ))}
      </div>
    </div>
  );
};

export default SpaceInvaders;
