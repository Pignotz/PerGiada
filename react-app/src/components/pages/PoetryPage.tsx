import Grid from '@mui/material/Grid2'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import * as React from 'react'
import { useState } from 'react'
import PoetryCard from '../../components/PoetryCard'
import { ViaggioInMare } from '../../data/Poems'


export default function PoetryPage() {
    const [selectedCard, setSelectedCard] = useState("");

    const handleClose = () => {
        setSelectedCard("");
    }

    return (
        <>
            <h1>PoetryPage</h1>
            {selectedCard === "" &&  (
                <Grid container spacing={2}>
                    <Grid size={4}>
                        <PoetryCard title="TITOLO" subtitle="Sotto" img="https://www.mille-animali.com/wp/wp-content/uploads/2016/02/razza-1.jpg" onSelectCard={setSelectedCard} />
                    </Grid>
                    <Grid size={4}>
                        <PoetryCard title="TITOLO" subtitle="Sotto" img="https://www.mille-animali.com/wp/wp-content/uploads/2016/02/razza-1.jpg" onSelectCard={setSelectedCard} />
                    </Grid>
                    <Grid size={4}>
                        <PoetryCard title="TITOLO" subtitle="Sotto" img="https://www.mille-animali.com/wp/wp-content/uploads/2016/02/razza-1.jpg" onSelectCard={setSelectedCard} />
                    </Grid>
                    <Grid size={4}>
                        <PoetryCard title="TITOLO" subtitle="Sotto" img="https://www.mille-animali.com/wp/wp-content/uploads/2016/02/razza-1.jpg" onSelectCard={setSelectedCard} />
                    </Grid>
                </Grid>
                )
            }
            {selectedCard !== "" && (
                <div className="overlay" onClick={handleClose}>
          <div className="page-content">
                        <h2>{ViaggioInMare.title}</h2>
                        <p>{ViaggioInMare.content.split('\n').map((line : string, index: React.Key | null | undefined) => (
                            <p key={index}>{line}</p>
                        ))}</p>
          </div>
        </div>
               

            )
            }

        </>
    )
}