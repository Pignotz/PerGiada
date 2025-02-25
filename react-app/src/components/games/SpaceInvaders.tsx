import React, { useState, useEffect, useRef } from 'react';

import './heart.css'; // Import the Heart.css file
// Configurazione globale delle dimensioni e parametri di gioco
const config = {
	gameArea: {
		width: (windowWidth: number) => windowWidth * 0.7,
		    height: (windowHeight: number) => windowHeight * 0.3,
		    backgroundColor: () => 'black',
	},
	player: {
		width: (gameWidth: number) => config.gameArea.width(gameWidth) / 20,
		height: (gameWidth: number) => config.player.width(gameWidth),
		speed: () => 20,
		startX: (gameWidth: number) => config.gameArea.width(gameWidth) / 2 - config.player.width(gameWidth) / 2,
		bottom: () => 30,
		color: () => '#00ff00',
		borderRadius: () => 5,
	},
	invader: {
		rowCount: () => 2,
		colCount: () => 10,
		width: (gameWidth: number) => (config.gameArea.width(gameWidth) / ((config.invader.colCount()*2) + 1)),
		height: (gameWidth: number) => config.invader.width(gameWidth),  // Manteniamo l'altezza uguale alla larghezza
		xSpacing: (gameWidth: number) => config.invader.width(gameWidth),  // Distanza orizzontale tra invaders
		ySpacing: (gameWidth: number) => config.invader.width(gameWidth),  // Distanza verticale tra invaders
		speed: () => 8,
		color: () => 'red',
	},
	bullet: {
		width: () => 5,
		height: () => 15,
		speed: () => 5,
		color: () => 'yellow',
	},
	gameOverLimit: (gameWidth: number) => config.gameArea.height(gameWidth) - 40 - config.player.height(gameWidth),
};

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
	const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

	const [playerPos, setPlayerPos] = useState<number>(() => config.player.startX(windowSize.width)); // Posizione iniziale del giocatore
	const [bullets, setBullets] = useState<Bullet[]>([]); // Array di proiettili
	const [invaders, setInvaders] = useState<Invader[]>([]); // Array di invaders
	const [gameOver, setGameOver] = useState<boolean>(false); // Stato del gioco
	const [score, setScore] = useState<number>(0); // Punteggio
	const [canShoot, setCanShoot] = useState<boolean>(true); // Stato per il controllo dei tiri
	const [paused, setPaused] = useState<boolean>(false); // Stato di pausa
	const gameAreaRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
	    const handleResize = () => {
	      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
	    };

	    window.addEventListener('resize', handleResize);
	    return () => window.removeEventListener('resize', handleResize);
	  }, []);

	
	useEffect(() => {
	  if (gameAreaRef.current) {
	    gameAreaRef.current.focus();
	  }
	}, []);

	useEffect(() => {
	  const handleKeyDown = (e: KeyboardEvent) => {
	    if (!e.repeat) {
	      if (e.key === ' ') {
	        e.preventDefault(); // Evita che la barra spaziatrice attivi pulsanti o scorra la pagina
	      }
	      movePlayer(e);
	    }
	  };

	  if (gameAreaRef.current) {
	    gameAreaRef.current.addEventListener('keydown', handleKeyDown);
	  }

	  return () => {
	    if (gameAreaRef.current) {
	      gameAreaRef.current.removeEventListener('keydown', handleKeyDown);
	    }
	  };
	}, [playerPos, paused]);

	// Inizializza gli invaders
	useEffect(() => {
		const initialInvaders: Invader[] = [];
		for (let row = 0; row < config.invader.rowCount(); row++) {
			for (let col = 0; col < config.invader.colCount(); col++) {
				initialInvaders.push({
					x: col * config.invader.xSpacing(windowSize.width)*2 + config.invader.xSpacing(windowSize.width),
					y: row * config.invader.ySpacing(windowSize.width)*2 + config.invader.ySpacing(windowSize.width),
					alive: true
				});
			}
		}
		setInvaders(initialInvaders);
	}, [windowSize]);

	// Funzione per sparare un proiettile
	const shootBullet = () => {
		if (canShoot && !paused) {
			setBullets(prevBullets => [
				...prevBullets,
				{ 
				                x: playerPos + config.player.width(windowSize.width) / 2 - config.bullet.width() / 2, 
				                y: config.gameArea.height(windowSize.width) - config.player.bottom() - config.player.height(windowSize.width), 
				                hit: false 
				            }
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
						y: bullet.y - config.bullet.speed()
					}))
					.filter(bullet => !bullet.hit); // Filtra i proiettili colpiti

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
									bullet.x < invader.x + config.invader.width(windowSize.width) &&
									bullet.y > invader.y &&
									bullet.y < invader.y + config.invader.height(windowSize.width)
								) {
									updatedInvaders[i] = { ...invader, alive: false }; // L'invader è stato colpito
									bullet.hit = true; // Segna il proiettile come colpito
									setScore(prevScore => prevScore + 100); // Aggiungi punti
									break; // Interrompe il ciclo per impedire ulteriori collisioni
								}
							}
						}
					});

					return updatedInvaders;
				});

				// Rimuove i proiettili colpiti
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
						const newY = invader.y + config.invader.speed();
						if (newY + config.invader.height(windowSize.width) > config.gameOverLimit(windowSize.width)) {
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
			setPlayerPos(prevPos => prevPos - config.player.speed());
		} else if (e.key === 'ArrowRight' && playerPos < config.gameArea.width(windowSize.width) - config.player.width(windowSize.width)) {
			setPlayerPos(prevPos => prevPos + config.player.speed());
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

	
	useEffect(() => {
	    setPlayerPos(config.player.startX(windowSize.width));
	}, [windowSize]);
	
	
	// Funzioni per pausa e reset
	const togglePause = () => setPaused(!paused);

	const resetGame = () => {
		setPlayerPos(config.player.startX(windowSize.width));
		setBullets([]);
		setScore(0);
		setGameOver(false);
		setPaused(false);

		const initialInvaders: Invader[] = [];
		for (let row = 0; row < config.invader.rowCount(); row++) {
			for (let col = 0; col < config.invader.colCount(); col++) {
				initialInvaders.push({
					x: col * config.invader.xSpacing(windowSize.width)*2 + config.invader.xSpacing(windowSize.width),
					y: row * config.invader.ySpacing(windowSize.width)*2 + config.invader.ySpacing(windowSize.width),
					alive: true
				});
			}
		}
		setInvaders(initialInvaders);
	};

	if (gameOver) {
		return (
			<div className="game-container"
			tabIndex={0} // Rende la div focalizzabile
			style={{
				marginTop: 10,
				textAlign: 'center',
			}}
			>
				<h1>Game Over</h1>
				<h3>Final Score: {score}</h3>
				<button onClick={resetGame}>Reset Game</button>
			</div>
		);
	}
	return (
		<div className="game-container"
		style={{
						marginTop: 0,
						textAlign: 'center',
					}}>
			<h1>Hearth Invaders</h1>
			<h3>Score: {score}</h3>
			<div className="controls">
				<button onClick={togglePause}>{paused ? 'Resume' : 'Pause'}</button>
				<button onClick={resetGame}>Reset</button>
			</div>
			<div className="game-area" ref={gameAreaRef}
			tabIndex={0} // Rende la div focalizzabile
				style={{
					position: 'relative',
					width: `${config.gameArea.width(windowSize.width)}px`,  // Funzione che restituisce la larghezza
					height: `${config.gameArea.height(windowSize.width)}px`,  // Funzione che restituisce l'altezza
					backgroundColor: config.gameArea.backgroundColor(),
					margin: '0 auto',
					overflow: 'hidden',
					outline: 'none', // Evita il bordo di focus visibile
				}}
			>
			{/* Linea di game over */}
			                <div style={{
			                    position: 'absolute',
			                    width: '100%',
			                    height: '2px',
			                    backgroundColor: 'red',
			                    top: `${config.gameOverLimit(windowSize.width)}px`,
			                }} />
				{invaders.map((invader, index) => (
					invader.alive &&
					<div key={index}
						className="invader" style={{
							position: 'absolute',
							width: `${config.invader.width(windowSize.width)}px`,
							height: `${config.invader.height(windowSize.width)}px`,
							backgroundColor: config.invader.color(),
							left: invader.x,
							top: invader.y,
							// eslint-disable-next-line no-multi-str, no-template-curly-in-string
							clipPath: `path("\
							  M 0,${config.invader.width(windowSize.width) / 100 * 30}\
							  A ${config.invader.width(windowSize.width) / 100 * 20},${config.invader.width(windowSize.width) / 100 * 20} 0,0,1 ${config.invader.width(windowSize.width) / 100 * 50},${config.invader.width(windowSize.width) / 100 * 30}\
							  A ${config.invader.width(windowSize.width) / 100 * 20},${config.invader.width(windowSize.width) / 100 * 20} 0,0,1 ${config.invader.width(windowSize.width) / 100 * 100},${config.invader.width(windowSize.width) / 100 * 30}\
							  Q ${config.invader.width(windowSize.width) / 100 * 100},${config.invader.width(windowSize.width) / 100 * 60} ${config.invader.width(windowSize.width) / 100 * 50},${config.invader.width(windowSize.width) / 100 * 100}\
							  Q ${config.invader.width(windowSize.width) / 100 * 0},${config.invader.width(windowSize.width) / 100 * 60} 0,${config.invader.width(windowSize.width) / 100 * 30}\
							  Z")`,
						}}
					/>
				))}
				<div
					className="player"
					style={{
						position: 'absolute',
						left: `${playerPos}px`,
						bottom: config.player.bottom(),
						width: `${config.player.width(windowSize.width)}px`,  // Invoca la funzione per ottenere la larghezza
					    height: `${config.player.height(windowSize.width)}px`,  // Invoca la funzione per ottenere l'altezza
					    backgroundColor: config.player.color(),
						borderRadius: config.player.borderRadius(),
					}}
				/>
				{bullets.map((bullet, index) => (
					<div key={index} className="bullet"
						style={{
							position: 'absolute',
							width: config.bullet.width(),
							height: config.bullet.height(),
							backgroundColor: config.bullet.color(),
							left: bullet.x,
							top: bullet.y,
						}}
					/>
				))}
			</div>
		</div>
	);
};

export default SpaceInvaders;
