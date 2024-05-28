import { Box, Slider, Typography } from '@mui/material';
import React, { useRef, useEffect } from 'react';

const colors = {
  white: '#f8f9fa',
  lightGray: '#f8f8f8', // Updated light gray
  gray: '#e9ecef',
  mediumGray: '#dee2e6',
  midDarkGray: '#ced4da',
  darkGray: '#adb5bd',
  darkerGray: '#6c757d',
  darkestGray: '#495057',
  black: '#212529',
};

const Step3 = ({
  activeStep,
  handleVolumeChange,
  volume,
  processKeywordsData,
}) => {
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  const handleVolumeSliderChange = (_, value) => {
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }
    handleVolumeChange(value);
  };

  const syncMediaElements = () => {
    const audio = audioRef.current;
    const video = videoRef.current;

    if (audio && video) {
      // Play and pause synchronization
      const handlePlay = (element) => {
        if (element === audio && video.paused) {
          video.play();
        } else if (element === video && audio.paused) {
          audio.play();
        }
      };
      const handlePause = (element) => {
        if (element === audio && !video.paused) {
          video.pause();
        } else if (element === video && !audio.paused) {
          audio.pause();
        }
      };

      audio.addEventListener('play', () => handlePlay(audio));
      audio.addEventListener('pause', () => handlePause(audio));

      video.addEventListener('play', () => handlePlay(video));
      video.addEventListener('pause', () => handlePause(video));

      // Seek synchronization
      const handleSeek = () => {
        if (Math.abs(audio.currentTime - video.currentTime) > 0.1) {
          video.currentTime = audio.currentTime;
        }
      };
      audio.addEventListener('timeupdate', handleSeek);
      video.addEventListener('timeupdate', handleSeek);

      return () => {
        audio.removeEventListener('play', () => handlePlay(audio));
        audio.removeEventListener('pause', () => handlePause(audio));
        video.removeEventListener('play', () => handlePlay(video));
        video.removeEventListener('pause', () => handlePause(video));
        audio.removeEventListener('timeupdate', handleSeek);
        video.removeEventListener('timeupdate', handleSeek);
      };
    }
  };

  useEffect(() => {
    const cleanup = syncMediaElements();
    return cleanup;
  }, [processKeywordsData]);

  return (
    <>
      {activeStep === 2 && (
        <Box
          textAlign="center"
          p={4}
          border={2}
          borderRadius="24px"
          bgcolor={colors.lightGray} // Updated background color
          borderColor={colors.darkerGray} // Updated border color
          color={colors.black} // Updated text color
          height="auto"
        >
          <Typography mb={4} color={colors.black}>
            Use our specialized volume rocker to adjust the volume according to
            your liking.
          </Typography>
          <Slider
            value={volume}
            onChange={(_, value) => {
              handleVolumeSliderChange(_, value);
            }}
            min={0}
            max={100}
            sx={{
              '& .MuiSlider-thumb': {
                color: colors.black, // Updated thumb color
              },
              '& .MuiSlider-rail': {
                color: colors.gray, // Updated rail color
              },
              '& .MuiSlider-track': {
                color: colors.black, // Updated track color
              },
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            {processKeywordsData?.video_file && (
              <Box>
                <Typography mb={1} color={colors.black}>Video</Typography>
                <video
                  width="100%"
                  height="200px"
                  autoPlay
                  ref={videoRef}
                  src={processKeywordsData?.video_file}
                />
              </Box>
            )}
            {processKeywordsData?.music_file && (
              <Box>
                <Typography mb={1} color={colors.black}>Audio</Typography>
                <audio
                  width="100%"
                  controls
                  ref={audioRef}
                  src={processKeywordsData?.music_file}
                />
              </Box>
            )}
          </div>
        </Box>
      )}
    </>
  );
};

export default Step3;
