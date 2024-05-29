import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Stack, Stepper, Step, StepLabel, StepConnector } from '@mui/material';
import { styled } from '@mui/system';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import logo from './../../assets/logoimg.png';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';
import axiosInstance from '../../utils/axiosInstance';
import { showNotification } from '../../utils/error';

const steps = [
  'Video Upload',
  'Keyword Customization',
  'Audio Customization',
  'Video Download',
];

// Color palette
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

// Custom styling for the StepConnector component
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  '&.MuiStepConnector-root': {
    top: 10, // Adjust the position
    left: 'calc(-50% + 16px)', // Adjust the position
    right: 'calc(50% + 16px)', // Adjust the position
  },
  '& .MuiStepConnector-line': {
    borderColor: colors.mediumGray, // Change the color of the connector line
    borderTopWidth: 2, // Change the width of the connector line
  },
}));

// Custom styling for the StepIcon component
const CustomStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  color: ownerState.active ? colors.black : colors.mediumGray, // Change the color based on the active state
  display: 'flex', // Flex display to align items
  height: 22, // Set height
  alignItems: 'center', // Center align items
  ...(ownerState.completed && {
    color: colors.black, // Change color if step is completed
  }),
}));

// Custom StepIcon component
function CustomStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <CustomStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {completed ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
    </CustomStepIconRoot>
  );
}

const Video2Music = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [keywords, setKeywords] = useState([]);
  const [volume, setVolume] = useState(50);
  const [videoFile, setVideoFile] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [responseData, setResponseData] = useState({});
  const [isContinueDisabled, setIsContinueDisabled] = useState(false);
  const [finalVideoData, setFinalVideoData] = useState({});
  const [isLoader, setIsLoader] = useState(false);
  const [processKeywordsData, setProcessKeywordsData] = useState({});

  const handleContinue = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
    setIsContinueDisabled(false);
  };

  const handleFileUpload = files => {
    console.log(files[0]);
    setVideoFile(files[0]);
    if (files[0]) {
      uploadFile(files[0]);
    }
    setProgress(0); // reset progress
  };

  const addKeyword = keyword => {
    setKeywords([...keywords, keyword]);
  };

  const removeKeyword = (keywordToRemove, ind) => {
    setKeywords(keywords.filter((_, index) => index !== ind));
  };

  const handleVolumeChange = value => {
    setVolume(value);
  };

  const handleFileUploading = () => {
    setVideoFile(null);
    setIsUploading(false);
  };

  const uploadFile = async file => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted); // update progress
        },
      };

      const response = await axiosInstance.post('/myapp/upload/', formData, config);
      if (response?.data?.success) {
        const key = response?.data?.keywords?.split(',').map(str => str.trim());
        setKeywords(key);
        setResponseData(response?.data);
        setIsUploaded(true);
        setIsUploading(false);
        showNotification('success', response?.data?.message);
      }
    } catch (error) {
      setIsUploaded(false);
      showNotification('error', error?.response?.data?.error || error.message);
    }
  };

  const processKeywords = async () => {
    try {
      setIsContinueDisabled(true);
      showNotification("success",'Audio is being generated');
      setIsLoader(true);
      const formData = new FormData();
      formData.append('music_prompt', responseData?.music_prompt);
      formData.append('keywords', JSON.stringify(keywords));

      const response = await axiosInstance.post(
        `/myapp/handle_keywords/${responseData?.video_id}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response?.data?.success) {
        setProcessKeywordsData(response?.data);
        setIsLoader(false);
        handleContinue();
        showNotification('success', response?.data?.message);
        setIsContinueDisabled(false);
      }
    } catch (error) {
      setIsLoader(false);
      setIsUploaded(false);
      showNotification('error', error?.response?.data?.error || error.message);
      setIsContinueDisabled(false);
    }
  };

  const generateFinalVideo = async () => {
    try {
      setIsContinueDisabled(true);
      const formData = new FormData();
      formData.append('video_id', responseData?.video_id);
      formData.append('slider_value', volume);

      const response = await axiosInstance.post(
        `/myapp/generate_final_video/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response?.data?.success) {
        setFinalVideoData(response?.data);
        showNotification('success', response?.data?.message);
        handleContinue();
        setIsContinueDisabled(false);
      }
    } catch (error) {
      setIsContinueDisabled(false);
      showNotification('error', error?.response?.data?.error || error.message);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = event => {
      if (videoFile) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [videoFile]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor={colors.white} // Set background color of the container
      color="white"
      overflow="hidden"
    >
      <Box
        width="100%"
        maxWidth="1000px"
        height="100vh"
        bgcolor={colors.white} // Set background color of the inner box
        color={colors.black} // Set text color of the inner box
        borderRadius="24px" // Set border radius of the inner box
        p={4} // Set padding of the inner box
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)" // Set box shadow of the inner box
      >
        <Box mb={4} mt={5} display="flex" justifyContent="center" bgcolor={colors.white}>
          <img src={logo} alt="Video2Music" style={{ width: '200px', height: 'auto',  }} />
        </Box>
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<CustomConnector />}
        >
          {steps.map((label, index) => (
            <Step
              key={label}
              completed={index <= activeStep} // Ensure step is checked
              onClick={() => {
                if (!isUploaded) {
                  return;
                }
                setActiveStep(index);
              }}
            >
              <StepLabel StepIconComponent={CustomStepIcon}>
                <Typography
                  variant="caption"
                  color={index === activeStep ? colors.darkestGray : colors.darkerGray} // Change color based on active step
                >
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Stack spacing={8} mt={7}>
          <Step1
            videoFile={videoFile}
            isUploaded={isUploaded}
            isUploading={isUploading}
            activeStep={activeStep}
            handleFileUpload={handleFileUpload}
            handleFileUploading={handleFileUploading}
            progress={progress} // Pass the progress state
          />

          <Step2
            activeStep={activeStep}
            addKeyword={addKeyword}
            responseData={responseData}
            keywords={keywords}
            removeKeyword={removeKeyword}
            isLoader={isLoader}
          />

          <Step3
            activeStep={activeStep}
            handleVolumeChange={handleVolumeChange}
            volume={volume}
            processKeywordsData={processKeywordsData}
          />

          <Step4
            activeStep={activeStep}
            videoFile={videoFile}
            finalVideoData={finalVideoData}
            setActiveStep={setActiveStep}
            setProgress={setProgress}
            setKeywords={setKeywords}
            setVolume={setVolume}
            setVideoFile={setVideoFile}
            setIsUploaded={setIsUploaded}
            setIsUploading={setIsUploading}
            setResponseData={setResponseData}
            setIsContinueDisabled={setIsContinueDisabled}
            setFinalVideoData={setFinalVideoData}
            setIsLoader={setIsLoader}
            setProcessKeywordsData={setProcessKeywordsData}
          />
        </Stack>

        <Box textAlign="end" mt={5} mb={5}>
          {activeStep < steps.length - 1 && (
            <Button
              style={{ color: colors.white, backgroundColor: colors.darkestGray }} // Set button text and background color
              variant="contained"
              disabled={isUploading || isContinueDisabled}
              sx={{
                bgcolor: colors.darkestGray, // Set button background color
                color: colors.white, // Set button text color
                fontWeight: '600', // Set button text font weight
                fontSize: '18px', // Set button text font size
                lineHeight: '20px', // Set button text line height
                textTransform: 'unset', // Prevent text transformation
                padding: "8px", // Set button padding
                '&:hover': {
                  bgcolor: colors.darkerGray, // Set button background color on hover
                  color: colors.darkestGray, // Set button text color on hover
                },
                '&.Mui-disabled': {
                  backgroundColor: colors.gray + ' !important', // Change disabled button color to gray
                },
              }}
              onClick={() => {
                if (activeStep === 1) {
                  if (Object.keys(processKeywordsData).length === 0) {
                    processKeywords();
                  } else {
                    handleContinue();
                  }
                  return;
                }
                if (activeStep === 2) {
                  if (Object.keys(finalVideoData).length === 0) {
                    generateFinalVideo();
                  } else {
                    handleContinue();
                  }
                  return;
                }
                if (Object.keys(responseData).length !== 0) {
                  handleContinue();
                }
              }}
            >
              Continue
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Video2Music;
