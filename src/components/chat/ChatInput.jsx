import { Grid, IconButton, InputAdornment, LinearProgress, TextField } from '@mui/material'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import React, { useCallback, useState } from 'react'
import ImageIcon from '@mui/icons-material/Image'
import SendIcon from '@mui/icons-material/Send'
import "../../firebase"
import { getDatabase, push, ref, serverTimestamp, set } from "firebase/database"
import { useSelector } from 'react-redux'
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import ImageModal from '../Modal/ImageModal'


function ChatInput() {

    const {channel} = useSelector(state => state);
    const {user} = useSelector((state) => state);
    const [message,setMessage] = useState("")
    const [loading,setLoading] = useState(false)
    const [showEmoji,setShowEmoji] = useState(false)
    const[ImageModalOpen,setImageModalOpen] = useState(false);
    const [uploading,setUploading] = useState(false);
    const [percent,setPercent] = useState(0);

    const handleClickOpen = useCallback(() => setImageModalOpen(true),[]);
    const handleClickClose = useCallback(() => setImageModalOpen(false),[]);

    const handleTogglePicker = useCallback(() => setShowEmoji((show) => !show))

    const createMessage = useCallback(() => ({
        timestamp: serverTimestamp(), 
        user: {
            id:user.currentUser.uid,
            name: user.currentUser.displayName,
            avatar: user.currentUser.photoURL,
        },
        content:message 
    }),[message,user.currentUser.uid,user.currentUser.displayName,user.currentUser.photoURL]);

    const handleChange = useCallback((e) => setMessage(e.target.value),[]);

    const clickSendMessage = useCallback(async () => {
        if(!message) return;
        setLoading(true)
        try {
            await set(
                push(ref(getDatabase(),"messages/"+channel.currentChannel.id)),
                createMessage()
            );
            setLoading(false);
            setMessage("");
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    },[message,channel.currentChannel?.id,createMessage]);

    const handleSelectEmoji = useCallback((e) => {
        const sym = e.unified.split("-");
        const codeArray = [];
        sym.forEach(el => codeArray.push("0x"+el));
        const emoji = String.fromCodePoint(...codeArray);
        setMessage((messageValue) => messageValue+emoji);
    },[])


    return (
        <Grid container sx={{P:"20px"}}>
            <Grid item xs={12} sx={{position: "relative"}}>
                {showEmoji && (
                    <Picker 
                        set='google' 
                        className="emojipicker" 
                        title="이모지를 선택하세요."
                        onSelect={handleSelectEmoji} 
                        emoji='point_up' 
                        style={{position: "absolute", bottom: "80px"}} />
                )}
                <TextField InputProps={{
                    startAdornment:(
                        <InputAdornment position='start'>
                            <IconButton onClick={handleTogglePicker}>
                                <InsertEmoticonIcon/>
                            </IconButton>
                            <IconButton onClick={handleClickOpen}>
                                <ImageIcon/>
                            </IconButton>
                        </InputAdornment>
                    ),
                    endAdornment:(
                        <InputAdornment position='start'>
                            <IconButton disabled={loading} onClick={clickSendMessage}>
                                <SendIcon/>
                            </IconButton>
                        </InputAdornment>
                    )
                }}
                label="메세지 입력"
                fullWidth
                autoComplete='off'
                value = {message}
                onChange={handleChange}
                />
                {uploading ?
                    <Grid item xs={12} sx={{m:"10px"}}>
                        <LinearProgress variant='determinate' value={percent}/>
                    </Grid>
                : null}
                <ImageModal open={ImageModalOpen} handleClose={handleClickClose} setPercent={setPercent} setUploading={setUploading}/>
            </Grid>
        </Grid>
    )
}

export default ChatInput