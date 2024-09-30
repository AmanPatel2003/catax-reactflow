import React, { useState } from "react";
import { TbCloudUpload } from "react-icons/tb";
import { BsFiletypeCsv, BsFiletypeXlsx } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";

const CataxComp = ({
  handleFileChange,
  dataFields,
  files,
  handleFileDelete,
  uploadFiles,
  uploadProgress,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState({});

  const handleFileChangeInternal = (e, exchangeKey, index) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFiles((prev) => ({
        ...prev,
        [exchangeKey]: {
          ...prev[exchangeKey],
          [index]: { name: file.name, type: file.type },
        },
      }));
    }
    handleFileChange(e, exchangeKey, index);
  };

  const handleFileDeleteInternal = (exchangeKey, index) => {
    setUploadedFiles((prev) => {
      const updatedFiles = { ...prev };
      delete updatedFiles[exchangeKey][index];
      return updatedFiles;
    });
    handleFileDelete(exchangeKey, index);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        {Object.keys(files).map((exchangeKey, exchangeIndex) => (
          <div className="mb-8" key={exchangeKey}>
            <h1 className="text-2xl font-bold mb-4 capitalize">
              {dataFields[exchangeIndex].exchange_name}
            </h1>
            <div className="grid grid-cols-3 gap-6">
              {files[exchangeKey].map((file, index) => (
                <FileInput
                  key={index}
                  label={`Supported file: ${dataFields[exchangeIndex].files_detail[index].file_type}`}
                  txn_type={`Txn type: ${dataFields[exchangeIndex].files_detail[index].txn_type}`}
                  accept={`.${dataFields[exchangeIndex].files_detail[index].file_type}`}
                  uploadedFile={uploadedFiles[exchangeKey]?.[index]}
                  onChange={(e) =>
                    handleFileChangeInternal(e, exchangeKey, index)
                  }
                  onDelete={() => handleFileDeleteInternal(exchangeKey, index)}
                />
              ))}
            </div>
          </div>
        ))}

        <div className="text-center">
          {uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className="bg-blue-600 h-4 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          <button
            onClick={uploadFiles}
            className={`${
              uploadProgress > 0 ? "bg-blue-600" : "bg-[#D1D5DB]"
            } w-full text-white font-medium px-6 py-2 rounded-[4px] shadow-md bg-[#A64D79]`}
            disabled={uploadProgress > 0} // Disable button while uploading
          >
            {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

const FileInput = ({
  label,
  onChange,
  accept,
  uploadedFile,
  onDelete,
  txn_type,
}) => (
  <div className="flex items-center justify-center w-52 h-44 border rounded-md bg-white p-4">
    {uploadedFile ? (
      <div className="flex flex-col items-center justify-center">
        <div className="flex  items-center justify-center mb-2">
          {uploadedFile.type === "text/csv" ? (
            <BsFiletypeCsv size={40} className="text-green-500" />
          ) : (
            <BsFiletypeXlsx size={40} className="text-green-500" />
          )}
        </div>
        <p className="font-semibold text-gray-500 mb-4 text-center text-sm">
          {uploadedFile.name}
        </p>
        <button onClick={onDelete}>
          <RiDeleteBin6Line size={20} className="text-red-400" />
        </button>
      </div>
    ) : (
      <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
        <TbCloudUpload size={40} className="text-gray-400 mb-4" />
        <span className="bg-[#D1D5DB] text-[#252525] px-4 py-2 text-sm font-semibold mb-2">
          Browse File
        </span>
        <input
          type="file"
          className="hidden"
          accept={accept}
          onChange={onChange}
        />
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-sm text-gray-400">{txn_type}</p>
      </label>
    )}
  </div>
);

export default CataxComp;
