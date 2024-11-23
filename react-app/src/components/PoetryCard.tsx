import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardActionArea from '@mui/material/CardActionArea'
import { useState } from 'react'


interface Props {
    title: string
    subtitle: string
    img: string
    onSelectCard: (cardTitle : string) => void
}

export default function PoetryCard({ title, subtitle, img, onSelectCard} : Props) {

  
    return (
        <>
            <Card sx={{ maxWidth: 345 }} onClick={() => { onSelectCard(title) }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={img}
                    alt="immagine poesia"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {subtitle}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    </>
    )
}