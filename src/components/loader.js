import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 75; // Duration in seconds
    const interval = 100; // Interval in milliseconds (0.1 second)
    const totalSteps = (duration * 1000) / interval; // Total number of steps

    let step = 0;
    const timer = setInterval(() => {
      step += 1;
      const percentage = Math.min((step / totalSteps) * 100, 100);
      setProgress(percentage);

      if (step >= totalSteps) {
        clearInterval(timer);
      }
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="relative"
      width="100px"
      height="100px"
    >
      <CircularProgress
        variant="determinate"
        value={progress}
        size={100}
        thickness={4}
        sx={{ color: '#6d6d6d' }} // Updated color
      />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
        >{`${Math.round(progress)}%`}</Typography>
      </Box>
    </Box>
  );
};

export default Loader;
