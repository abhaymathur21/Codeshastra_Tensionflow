import { useState,useRef } from 'react'
import React from 'react'
import NavDash from '../../components/NavDash'
import { Box, Grid,Button,Typography } from '@mui/material'
import './Dashboard.css'
import { cva } from "class-variance-authority";
import TextField from '@mui/material/TextField';
// import { Button } from 'flowbite-react'
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import FileUploadIcon from '@mui/icons-material/FileUpload';

import Modal from '@mui/material/Modal';
import { MuiFileInput } from 'mui-file-input'
import { createTheme, ThemeProvider } from '@mui/material/styles';


import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios'


const theme = createTheme({
    components: {
      MuiInputBase: {
        styleOverrides: {
          input: {
            '&::placeholder': {
              color: 'white', // Change the color here
            },
          },
        },
      },
    },
  });
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius:'5px',
  boxShadow: 24,
  p: 4,
}


const Dashboard = () => {
    const [messages, setMessages] = useState([
        { user: "agent", message: "Hi there! How can I help you today?" },
        
      ]);

      const [open, setOpen] = React.useState(false);
      const handleOpen = () => setOpen(true);
      const handleClose = () => setOpen(false);
      const [input, setInput] = useState("");

    
    const domainFileRef = useRef(null);


    const chatVariant = cva("p-2 text-pretty flex", {
        variants: {
            variant: {
                user: "bg-white text-primary rounded-br-none ml-[100] ",
                agent: "bg-purple-500 text-white rounded-bl-none mr-auto",
            },
        },
    });
  

    const handleSubmit = () =>
    {
        console.log('started submitting')
        if(domainFileRef !== null)
        {
            console.log(domainFileRef?.current?.files?.[0]);
       
      axios.post(
          "http://localhost:5000/upload_file",
          {
              file: domainFileRef?.current?.files?.[0]
          },
          {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          }
      )
          .then((res) => {
              console.log("response File", res.data);
             setMessages(prevMessages => [...prevMessages, { user: 'agent', message: res.data }]);
          })
          .catch((err) => {
              console.log(err);
              
          })
        }

        if (input != '')
        {
            console.log("sending message")
            axios.post(
                "http://localhost:5000/upload_text",
                {
                    message:input
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
                .then((res) => {
                    console.log("response Text", res.data);
                   setMessages(prevMessages => [...prevMessages, { user: 'agent', message: res.data }]);
                })
                .catch((err) => {
                    console.log(err);
                })

        }

        

    }

    const handleInput = (event) =>
    {
        setInput(event.target.value)
        console.log(input)
    }
    



  return (
    <>
    <Box sx={{backgroundColor:'black', minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
    <NavDash/>
    <Box sx={{flex: '1 0 auto', overflowY: 'auto'}}> 
        <Box className='scrollable-div' > 

        {messages.map((message, index) => (
            <>
            
          <Typography
            key={index}
            sx={{ 
                width: '30vw',
                marginLeft: message.user === 'user' ? 'auto' : 'initial',
                borderRadius:'10px',
                marginBottom:'10px'
                
            }}
            className={chatVariant({ variant: message.user })}
          >
            {message.message}
          </Typography>
          </>
        ))}
        </Box>
    </Box>
    <Box className='footer' sx={{flexShrink: 0}}>
        <Grid container>
            <Grid item xs={1}/>
            <Grid item xs={3}>
            <input type="file" name="file" id="file" ref={domainFileRef} />

            </Grid>
            <Grid item xs={4}>
            <ThemeProvider theme={theme}>
            <TextField
            id="chat"
            placeholder='Ask a Question ...'
            name='chat'
            value={input}
            onChange = {handleInput}
            className='search'
            fullWidth
            InputProps={{ style: { color: 'white' } }}
            
            />
            </ThemeProvider>
            
            </Grid>

            <Grid item xs={1}>
                <Button className='dash-button'><KeyboardVoiceIcon color='white' fontSize='large'/></Button>
            </Grid>
            <Grid item xs={2}>
                <Button fullWidth className='dash-button' onClick={handleSubmit}>Submit</Button>
            </Grid>
        </Grid>
        
        
        
    </Box>
</Box>

    </>
    
  )
}

export default Dashboard
