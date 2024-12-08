import React, { useState, useEffect, useRef } from 'react';

export default function PoetryDiary({ selectedCard, handleClose }: { selectedCard: any; handleClose: () => void }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [linesPerPage, setLinesPerPage] = useState(0);
  const pageRef = useRef<HTMLDivElement>(null);

  // Calcolare quante righe possono entrare in una pagina
  useEffect(() => {
    if (pageRef.current) {
      const pageHeight = pageRef.current.offsetHeight;
      const lineHeight = 34; // Imposta la dimensione della linea (puoi modificarla se necessario)
      const linesPerPageCalculated = Math.floor(pageHeight / lineHeight);
      setLinesPerPage(linesPerPageCalculated);
    }
  }, [selectedCard.content]);

  // Dividi il contenuto in pagine dinamiche
  const pages = selectedCard.content.split('\n').reduce((acc: string[][], line: string, index: number) => {
    if (linesPerPage === 0) return acc; // Evita la divisione se linesPerPage è 0
    
    if (index % linesPerPage === 0) acc.push([]); // Inizializza una nuova pagina se è il primo elemento della pagina

    // Aggiungi la riga corrente alla pagina corrente
    acc[acc.length - 1].push(line);

    return acc;
  }, []);

  const handleNextPage = () => {
    if (currentPage < pages.length - 2) setCurrentPage(currentPage + 2); // Avanza di due pagine
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 2); // Torna indietro di due pagine
  };

  return (
    <div
      className="overlay"
      onClick={handleClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
      }}
    >
      <div
        className="page-content"
        onClick={(e) => e.stopPropagation()} // Previene la chiusura quando si clicca dentro
        style={{
          backgroundColor: '#f9f9f9', // Colore carta
          borderRadius: '16px',
          padding: '20px',
          width: '900px', // Larghezza per mostrare due pagine
          height: '500px', // Altezza per il contenuto
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          perspective: '1000px', // Effetto 3D
          overflow: 'hidden',
        }}
      >
        {/* Testata con il titolo, fissata in cima */}
        <div style={{
          position: 'absolute',
          top: '20px',
          width: '100%',
          textAlign: 'center',
          fontSize: '1.8rem',
          color: '#333',
          zIndex: 2, // Assicurati che il titolo stia sopra il contenuto delle pagine
        }}>
          {selectedCard.title}
        </div>

        {/* Wrapper delle pagine con animazione */}
        <div
          className="pages-wrapper"
          style={{
            display: 'flex',
            transition: 'transform 1s ease', // Transizione lenta per il cambio pagina
            width: '200%', // Due pagine devono occupare il 200% della larghezza
            height: '100%',
            marginTop: '50px', // Distanza tra la testata e il contenuto
            overflow: 'hidden', // Previene che il contenuto esca fuori
          }}
        >
          {/* Prima pagina */}
          <div
            className="page"
            ref={pageRef}
            style={{
              width: '50%',
              height: '100%',
              overflowY: 'auto',
              padding: '20px',
              textAlign: 'left',
              backgroundColor: '#fff',
              boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
              transform: 'rotateY(0deg)', // La pagina inizialmente è dritta
              transformOrigin: 'left', // Origine della rotazione sulla parte sinistra
              transition: 'transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55)', // Anima la rotazione
            }}
          >
		  {pages[currentPage] ? (
		    pages[currentPage].map((line: string, index: number) => (
		      <p key={index} style={{ margin: '5px 0', color: '#555', fontSize: '1rem' }}>
     		{line || '\u00A0'} {/* Usa '\u00A0' per forzare la visualizzazione di uno spazio vuoto */}	
			</p>
		    ))
		  ) : (
		    <p>Pagina non disponibile</p>
		  )}

          </div>
          {/* Seconda pagina */}
          <div
            className="page"
            style={{
              width: '50%',
              height: '100%',
              overflowY: 'auto',
              padding: '20px',
			  textAlign: 'left',
              backgroundColor: '#fff',
              boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)',
              transform: 'rotateY(0deg)', // La pagina è girata dietro
              transformOrigin: 'right', // Origine della rotazione sulla parte destra
              transition: 'transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55)', // Anima la rotazione
            }}
          >
		  {pages[currentPage+1] ? (
		      pages[currentPage+1].map((line: string, index: number) => (
				<p key={index} style={{ margin: '5px 0', color: '#555', fontSize: '1rem' }}>
				   		{line || '\u00A0'} {/* Usa '\u00A0' per forzare la visualizzazione di uno spazio vuoto */}	
						</p>
		      ))
		    ) : (
		      <p>Pagina non disponibile</p>
		    )}
          </div>
        </div>

        {/* Controlli di navigazione */}
        <div style={{ position: 'absolute', bottom: '20px', display: 'flex', gap: '10px' }}>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: currentPage === 0 ? '#ccc' : '#007bff',
              color: '#fff',
              cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
            }}
          >
            Indietro
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= pages.length - 2}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: currentPage >= pages.length - 2 ? '#ccc' : '#007bff',
              color: '#fff',
              cursor: currentPage >= pages.length - 2 ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
            }}
          >
            Avanti
          </button>
        </div>
      </div>
    </div>
  );
}
