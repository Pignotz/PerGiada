import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

interface Props {
  title: string;
  subtitle: string;
  content: string;
  img: string;
  onSelectCard: (cardData: { title: string; subtitle: string; content: string; img: string }) => void;
}

export default function PoetryCard({ title, subtitle, content, img, onSelectCard }: Props) {
  const handleClick = () => {
    onSelectCard({ title, subtitle, content, img });
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        m: 2, // margin
        p: 2, // padding
        boxShadow: 3,
        '&:hover': { boxShadow: 6, transform: 'scale(1.05)' },
        transition: 'all 0.3s ease-in-out',
      }}
      onClick={handleClick}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          height="200"
          image={img}
          alt="immagine poesia"
          sx={{
            borderRadius: '8px',
            objectFit: 'cover',
          }}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ textAlign: 'center', fontWeight: 'bold' }}
          >
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            {subtitle}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
