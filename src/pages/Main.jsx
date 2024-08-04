import { Box, Drawer, Toolbar } from '@mui/material'
import React from 'react'
import Header from '../components/Header'
import ChannelMenu from '../components/menu/ChannelMenu'
import Chat from '../components/chat/Chat'
import ThemeMenu from '../components/menu/ThemeMenu'
import { useSelector } from 'react-redux'


function Main() {

    const {theme} = useSelector(state=>state);

    return(
        //TODO backgroundColor 테마 적용
        <Box sx={{display:"flex",backgroundColor:theme.subTheme}}>
            <Header/>
            <Drawer variant="permanent" sx={{width:300}} className='no-scroll'>
                <Toolbar/>
                <Box sx={{display:"flex",minHeight:"calc(100vh-64px)"}}>
                    <ThemeMenu />
                    <ChannelMenu/>
                </Box>
            </Drawer>
            <Box component="main" sx={{flexGrow:1,p:3}}>
                <Chat/>
            </Box>
        </Box>
    )
}

export default Main