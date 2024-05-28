import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import download from '../../../assets/download.svg';
import { showNotification } from '../../../utils/error';

const colors = {
  white: '#f8f9fa',
  lightGray: '#f8f8f8',
  gray: '#e9ecef',
  mediumGray: '#dee2e6',
  midDarkGray: '#ced4da',
  darkGray: '#adb5bd',
  darkerGray: '#6c757d',
  darkestGray: '#495057',
  black: '#212529',
};

const Step4 = ({
  activeStep,
  finalVideoData,
  setActiveStep,
  setProgress,
  setKeywords,
  setVolume,
  setVideoFile,
  setIsUploaded,
  setIsUploading,
  setResponseData,
  setIsContinueDisabled,
  setFinalVideoData,
  setIsLoader,
  setProcessKeywordsData,
}) => {
  const resetStates = () => {
    setActiveStep(0);
    setProgress(0);
    setKeywords([]);
    setVolume(50);
    setVideoFile(null);
    setIsUploaded(false);
    setIsUploading(false);
    setResponseData({});
    setIsContinueDisabled(false);
    setFinalVideoData({});
    setIsLoader(false);
    setProcessKeywordsData({});
  };

  return (
    <>
      {activeStep === 3 && (
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
            We're almost there. Use our specialized volume rocker to adjust the
            volume according to your liking.
          </Typography>
          {finalVideoData?.final_video_url && (
            <Box mb={4}>
              <video width="100%" height="270px" controls>
                <source
                  src={finalVideoData?.final_video_url}
                  type="video/mp4"
                />
              </video>
            </Box>
          )}
          <Box pb="20px" gap="10px" justifyContent="center" alignItems="center" display="flex">
            <Button
              pt="2px"
              pb="2px"
              sx={{
                bgcolor: colors.gray, // Updated button background color
                color: colors.black, // Updated button text color
                fontWeight: '600',
                fontSize: '18px',
                lineHeight: '20px',
                textTransform: 'unset',
                '&:hover': {
                  bgcolor: colors.midDarkGray, // Updated button hover background color
                  color: colors.white, // Updated button hover text color
                },
              }}
              variant="contained"
              onClick={() => {
                const url =
                  'http://119.155.152.128:8000/media/finalvideo/final_output.mp4' ||
                  finalVideoData?.final_video_url;

                fetch(url)
                  .then(response => {
                    if (!response.ok) {
                      showNotification('error', 'Network response was not ok');
                    }
                    return response.blob();
                  })
                  .then(blob => {
                    const fileUrl = window.URL.createObjectURL(new Blob([blob]));
                    const link = document.createElement('a');
                    link.href = fileUrl;
                    link.setAttribute('download', 'finalOutput.mp4'); // Adjust filename if needed
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode.removeChild(link);
                  })
                  .catch(error => {
                    showNotification('error', `Error downloading file: ${error}`);
                  });
              }}
            >
              <img src={download} alt="" style={{ paddingRight: '9px' }} />
              Download
            </Button>

            <Button
              sx={{
                bgcolor: colors.gray, // Updated button background color
                color: colors.black, // Updated button text color
                fontWeight: '600',
                fontSize: '18px',
                lineHeight: '20px',
                textTransform: 'unset',
                padding: "8px",
                '&:hover': {
                  bgcolor: colors.midDarkGray, // Updated button hover background color
                  color: colors.white, // Updated button hover text color
                },
              }}
              onClick={() => {
                resetStates();
              }}
            >
              Upload Another Video
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Step4;
