import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import HomeIcon from '@mui/icons-material/Home';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';


interface Props {
    onSelectDrawerItem: (item: string) => void
}

export default function MyDrawer({ onSelectDrawerItem } : Props) {
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const DrawerListIcons = [<HomeIcon />, <AutoStoriesIcon />, <VideogameAssetIcon/>];

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <List>
                {['Home', 'Poesie', 'Giochi'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton
                            onClick={() => {
                                onSelectDrawerItem(text);
                            }
                            }
                        >
                            <ListItemIcon>
                                {DrawerListIcons[index]}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <div>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleDrawer(true)}
            >
                <MenuIcon />
            </IconButton>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
}
