import Grid from '@mui/material/Grid';
import * as React from 'react';
import { useState } from 'react';
import PoetryCard from '../../components/PoetryCard';
import PoetryDiary from '../../components/PoetryDiary';
import { TutteLePoesie } from '../../data/Poems';

export default function PoetryPage() {
  const [selectedCard, setSelectedCard] = useState<{
    title: string;
    subtitle: string;
    content: string;
    img: string;
  } | null>(null);

  const handleClose = () => {
    setSelectedCard(null);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>PoetryPage</h1>
      {!selectedCard && (
        <Grid container spacing={4} justifyContent="left">
          {TutteLePoesie.map((poem, index: number) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <PoetryCard
                title={poem.title}
                subtitle={poem.subtitle}
                content={poem.content}
                img={poem.img}
                onSelectCard={setSelectedCard}
              />
            </Grid>
          ))}
        </Grid>
      )}
      {selectedCard && (
        <PoetryDiary selectedCard={selectedCard} handleClose={handleClose} />
      )}
    </div>
  );
}
