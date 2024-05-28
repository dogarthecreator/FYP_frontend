import React, { useCallback, useEffect, useRef } from "react";
import { showNotification } from "../../utils/error";

const UploadComponent = ({ setFile, file }) => {
  const dropAreaRef = useRef(null);
  const handleFiles = useCallback(
    (files) => {
      if (files[0]) {
        if (files[0].name.includes("doc") || files[0].name.includes("docx")) {
          setFile(files[0]);
        } else {
          showNotification("error", "Only doc or docx files allowed!");
          return;
        }
      }
    },
    [setFile]
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
      const ele = document.querySelector(".upload-label");
      if (ele) {
        ele.style.backgroundColor = "#e9e9e9";
        ele.style.border = "2px dotted #999";
      }
    };

    const unHighlight = () => {
      const ele = document.querySelector(".upload-label");
      if (ele) {
        ele.style.backgroundColor = "#f6f6f6";
        ele.style.border = "unset";
      }
    };

    const handleDrop = (e) => {
      const dt = e.dataTransfer;
      const { files } = dt;
      handleFiles(files);
    };

    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropArea?.addEventListener(eventName, preventDefaults, false);
    });

    ["dragenter", "dragover"].forEach((eventName) => {
      dropArea?.addEventListener(eventName, highlight, false);
    });

    ["dragleave", "drop"].forEach((eventName) => {
      dropArea?.addEventListener(eventName, unHighlight, false);
    });

    dropArea?.addEventListener("drop", handleDrop, false);

    return () => {
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        dropArea?.removeEventListener(eventName, preventDefaults, false);
      });

      ["dragenter", "dragover"].forEach((eventName) => {
        dropArea.removeEventListener(eventName, highlight, false);
      });

      ["dragleave", "drop"].forEach((eventName) => {
        dropArea?.removeEventListener(eventName, unHighlight, false);
      });

      dropArea?.removeEventListener("drop", handleDrop, false);
    };
  }, [file, handleFiles]);

  return (
    <div
      id="drop-area"
      ref={dropAreaRef}
      className="w-full  min-h-[190px]  rounded-2xl border border-emerald-900  justify-center items-center inline-flex border-dashed	">
      <input
        type="file"
        id="fileElem"
        // accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
        }}
      />
      <label className="upload-label" htmlFor="fileElem">
        <div className="upload-text">
          {" "}
          <div className="self-stretch flex-col justify-start items-center gap-2 inline-flex">
            <div className="text-center">
              <span className="text-[#FF2A00] text-lg cursor-pointer font-bold  leading-normal">
                Click to add &nbsp;
              </span>
              <span className="text-[#00403E] cursor-pointer text-lg font-semibold  leading-normal">
                or drop file here.
              </span>
            </div>
            <div className="opacity-90 text-greenish text-sm font-medium  leading-[18px]">
              word and docs file supported{" "}
            </div>
          </div>
        </div>
      </label>
    </div>
  );
};

export default UploadComponent;