import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MyDrawer from './MyDrawer';


interface Props {
    onSelectDrawerItem: (item: string) => void
}

export default function MyAppBar({ onSelectDrawerItem } : Props) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
              <Toolbar>
                  <MyDrawer onSelectDrawerItem={onSelectDrawerItem} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Per Giada
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
