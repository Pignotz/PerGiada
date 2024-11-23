import * as React from 'react';
import { useState } from 'react';
import GamePage from './pages/GamesPage'
import HomePage from './pages/HomePage'
import MyAppBar from './MyAppBar';
import PoetryPage from './pages/PoetryPage';



export default function Blog() {

    const [selectedPage, setSelectedPage] = useState("Home");


    return (
        <>
            <MyAppBar onSelectDrawerItem={setSelectedPage} />
            {selectedPage === "Home" && <HomePage />}
            {selectedPage === "Poesie" && <PoetryPage/>}
            {selectedPage === "Giochi" && <GamePage/>}
        </>
    );
}