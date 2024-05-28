import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Box, Input, LinearProgress, Typography } from '@mui/material';
import upload from './../../../assets/upload-cloud-02.png';
import mp4File from './../../../assets/mp4file.svg';
import deleteIcon from './../../../assets/deleteIcon.svg';
import { showNotification } from './../../../utils/error';

const colors = {
  white: '#f8f9fa',
  lightGray: '#F8F8F8',
  gray: '#e9ecef',
  mediumGray: '#dee2e6',
  midDarkGray: '#ced4da',
  darkGray: '#adb5bd',
  darkerGray: '#6c757d',
  darkestGray: '#495057',
  black: '#212529',
};

const Step1 = ({
  activeStep,
  videoFile,
  handleFileUpload,
  handleFileUploading,
  isUploading,
  isUploaded,
}) => {
  function bytesToMB(bytes) {
    return (bytes / (1024 * 1024)).toFixed(2);
  }

  const dropAreaRef = useRef(null);
  const handleFiles = useCallback(
    (files) => {
      if (files[0]) {
        if (files[0].name.includes('mp4')) {
          handleFileUpload(files);
        } else {
          showNotification('error', 'Only mp4 files allowed!');
          return;
        }
      }
    },
    [handleFileUpload]
  );

  useEffect(() => {
    const dropArea = dropAreaRef.current;
    if (!dropArea) {
      return; // Return early if the element is not available
    }
    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const highlight = () => {
      const ele = document.querySelector('.upload-label');
      if (ele) {
        ele.style.border = `2px dotted ${colors.darkGray}`; // Updated border color
      }
    };

    const unHighlight = () => {
      const ele = document.querySelector('.upload-label');
      if (ele) {
        ele.style.border = 'unset';
      }
    };

    const handleDrop = (e) => {
      const dt = e.dataTransfer;
      const { files } = dt;
      handleFiles(files);
    };

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach((eventName) => {
      dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach((eventName) => {
      dropArea.addEventListener(eventName, unHighlight, false);
    });

    dropArea.addEventListener('drop', handleDrop, false);

    return () => {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
        dropArea.removeEventListener(eventName, preventDefaults, false);
      });

      ['dragenter', 'dragover'].forEach((eventName) => {
        dropArea.removeEventListener(eventName, highlight, false);
      });

      ['dragleave', 'drop'].forEach((eventName) => {
        dropArea.removeEventListener(eventName, unHighlight, false);
      });

      dropArea.removeEventListener('drop', handleDrop, false);
    };
  }, [videoFile, handleFiles]);

  return (
    <>
      {activeStep === 0 && (
        <>
          {videoFile && isUploading ? (
            <Box
              p={4}
              border={2}
              borderRadius="24px"
              borderColor={colors.darkGray} // Updated border color
              mx="auto"
              bgcolor={colors.lightGray} // Updated background color
              color={colors.darkGray} // Updated text color
              height="304px"
            >
              <div
                style={{
                  display: 'flex',
                  gap: '24px',
                  alignItems: 'center',
                  marginTop: '100px',
                }}
              >
                <div>
                  <img src={mp4File} alt="" />
                </div>

                <div style={{ width: '100%', display: 'flex' }}>
                  <div style={{ width: '100%' }}>
                    <Typography>{videoFile?.name}</Typography>
                    <Typography>{bytesToMB(videoFile?.size)} mb</Typography>

                    <LinearProgress
                      sx={{
                        backgroundColor: colors.white,
                        height: '8px',
                        borderRadius: '4px',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: colors.darkGray, // Updated progress bar color
                        },
                      }}
                    />
                  </div>
                  <img
                    src={deleteIcon}
                    alt=""
                    className="c-pointer"
                    onClick={handleFileUploading}
                  />
                </div>
              </div>
            </Box>
          ) : videoFile && isUploaded ? (
            <Box
              p={4}
              border={2}
              borderRadius="24px"
              borderColor={colors.darkGray} // Updated border color
              mx="auto"
              bgcolor={colors.lightGray} // Updated background color
              color={colors.darkGray} // Updated text color
              height="304px"
            >
              <div
                style={{
                  display: 'flex',
                  gap: '24px',
                  alignItems: 'center',
                  marginTop: '100px',
                }}
              >
                <div>
                  <img src={mp4File} alt="" />
                </div>

                <div style={{ width: '100%', display: 'flex' }}>
                  <div style={{ width: '100%' }}>
                    <Typography>{videoFile?.name}</Typography>
                    <Typography>{bytesToMB(videoFile?.size)} mb</Typography>
                    <Typography>
                      Uploaded Successfully, Please continue your process!
                    </Typography>
                  </div>
                </div>
              </div>
            </Box>
          ) : (
            <Box
              textAlign="center"
              p={4}
              border={2}
              borderRadius="24px"
              borderColor={colors.darkGray} // Updated border color
              mx="auto"
              bgcolor={colors.lightGray} // Updated background color
              color={colors.darkestGray} // Updated text color
              height="304px"
            >
              <Typography variant="h4" mb={2} color={colors.black}> {/* Updated text color */}
                Video2Music
              </Typography>
              <Typography variant="subtitle1" mb={2}> {/* Updated text color */}
                Personalized Soundtracks, Made Just for Your Videos
              </Typography>
              <Box
                p={2}
                mb={2}
                display="flex"
                flexDirection="column"
                alignItems="center"
                id="drop-area"
                ref={dropAreaRef}
                
              >
                <label className="upload-label" htmlFor="fileElem">
                  <Box
                    component="img"
                    src={upload}
                    alt="upload img"
                    sx={{
                      border: `2px solid ${colors.darkGray}`, // Updated border color
                      borderRadius: '8px',
                      display: 'block',
                      p: '10px',
                      mx: 'auto',
                      width: 'auto',
                      cursor: 'pointer',
                    }}
                  />
                  <Typography variant="body1" mt={2}> {/* Updated text color */}
                    <span style={{ color: colors.black }} className="c-pointer"> {/* Updated text color */}
                      Click to upload
                    </span>{' '}
                    or drag and drop
                  </Typography>
                </label>
                <Input
                  type="file"
                  id="fileElem"
                  onChange={(e) => {
                    handleFiles(e.target.files);
                  }}
                  sx={{ display: 'none' }}
                />
                <Typography variant="caption"> {/* Updated text color */}
                  Max file size <span style={{ color: colors.darkestGray }}>1GB</span> {/* Updated text color */}
                </Typography>
              </Box>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default Step1;
