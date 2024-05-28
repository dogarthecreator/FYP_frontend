import React from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import Video2Music from './container/video2music/Video2Music';
import './css/App.css';
// import Video2Music from './Video2Music';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    // <ChakraProvider theme={theme}>
    // <Video2Music />
    // <Video2MusicComponent />
    <>
      <Video2Music />
      <ToastContainer position="top-right" />
    </>

    // </ChakraProvider>
  );
}

export default App;
