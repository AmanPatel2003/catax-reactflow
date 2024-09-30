"use client";

import CataxComp from "@/components/CataxComp";
import DonutChartCrypto from "@/components/DonutChartCrypto";
import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";

const options = [
  { value: "giottus", label: "Giottus" },
  { value: "koinbx", label: "Koinbx" },
  { value: "BITBNS", label: "Bitbns" },
  { value: "Buyucoin", label: "Buyucoin" },
  { value: "CoinSwitch", label: "Coinswitch" },
  { value: "CoinSwitch Pro", label: "Coinswitch Pro" },
  { value: "Kraken", label: "Kraken" },
  { value: "Unocoin", label: "Unocoin" },
  { value: "zebpay", label: "Zebpay" },
];

const accountsData = {
  giottus: [
    {
      label: "SC",
      value: 0.43859639999999445,
    },
    {
      label: "BTC",
      value: 13.972045761120057,
    },
    {
      label: "MATIC",
      value: 792.3299999999999,
    },
    {
      label: "ENJ",
      value: 2.489939999999997,
    },
    {
      label: "USDT",
      value: 8.309999999999945,
    },
    {
      label: "CELO",
      value: 32.018,
    },
    {
      label: "ADA",
      value: 16.33194679999997,
    },
  ],
  koinbx: [
    {
      label: "SC",
      value: 0.43859639999999445,
    },
    {
      label: "BTC",
      value: 13.972045761120057,
    },
    {
      label: "MATIC",
      value: 792.3299999999999,
    },
    {
      label: "ENJ",
      value: 2.489939999999997,
    },
    {
      label: "USDT",
      value: 8.309999999999945,
    },
    {
      label: "CELO",
      value: 32.018,
    },
    {
      label: "ADA",
      value: 16.33194679999997,
    },
  ],
};
const calculateTotalCrypto = (accountsData) => {
  const totals = {};
  Object.values(accountsData).forEach((account) => {
    account.forEach((crypto) => {
      totals[crypto.label] = (totals[crypto.label] || 0) + crypto.value;
    });
  });
  return Object.entries(totals).map(([label, value]) => ({ label, value }));
};

const Page = () => {
  const [files, setFiles] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [userId, setUserId] = useState("");
  const [dataFields, setDataFields] = useState([]);
  const [uploadedFilesData, setUploadedFilesData] = useState([]);
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeAccount, setActiveAccount] = useState("account1");

  useEffect(() => {
    console.log(files);
  }, [files]);

  const initializeFilesState = (data) => {
    const initialState = data.reduce((acc, exchange) => {
      acc[exchange.exchange_name] = new Array(
        exchange.files_detail.length
      ).fill("");
      return acc;
    }, {});
    setFiles(initialState);
  };

  const handleFileChange = (e, exchange, index) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prevFiles) => {
        const newFiles = { ...prevFiles };
        newFiles[exchange][index] = e.target.files[0];
        return newFiles;
      });
    }
  };

  const handleFileDelete = (exchange, index) => {
    setFiles((prevFiles) => {
      const newFiles = { ...prevFiles };
      newFiles[exchange][index] = null;
      return newFiles;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("user_id", userId);

    Object.keys(files).forEach((exchange) => {
      files[exchange].forEach((file, idx) => {
        if (file) formData.append(`files[${exchange}][${idx}]`, file);
      });
    });

    try {
      const response = await axios.post(
        "https://taxation-engine.onrender.com/uploadfiles",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const postData = async () => {
    if (!selectedOptions.length) {
      alert("Please select at least one exchange");
      return;
    }

    const selectedValues = selectedOptions.map((option) => option.value);

    try {
      const response = await axios.post(
        "https://taxation-engine.onrender.com/exchanges",
        selectedValues,
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response:", response.data);
      const transformedData = response.data.flatMap((exchange) =>
        exchange.files_detail.map((file) => ({
          exchange: exchange.exchange_name,
          file_type: file.file_type,
          txn_type: file.txn_type,
        }))
      );

      console.log("Transformed Data:", transformedData);
      setUploadedFilesData(transformedData);
      setDataFields(response.data);
      initializeFilesState(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  const uploadFiles = async () => {
    console.log("api called upload files");
    const formData = new FormData();

    // Append the form fields
    formData.append("user_id", userId);
    formData.append("upload_file_data", JSON.stringify(uploadedFilesData));

    // Append the files
    Object.keys(files).forEach((exchange) => {
      files[exchange].forEach((file) => {
        if (file) {
          formData.append("files", file, file.name);
        }
      });
    });

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/uploadfiles",
        formData,
        {
          headers: {
            accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      console.log("Response:", response.data);
      setShowModal(false);
      // setUserId("")
      initializeFilesState([]);
      setFiles({});
      setDataFields([]);
      setSelectedOptions([]);
      setUploadedFilesData([]);
      setShowDownloadButton(true);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const downloadPLS = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/download_pls/${userId}`,
        {},
        {
          headers: {
            accept: "application/json",
          },
          responseType: "blob",
        }
      );
      console.log(response);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "downloaded_report.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setShowDownloadButton(false);
      setUserId("");
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  const customColors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#ffffff"];
  const totalCryptoData = calculateTotalCrypto(accountsData);

  return (
    <>
      <div className="w-full h-20 bg-gray-300 p-4 flex items-center justify-between ">
        <div className="flex items-center  space-x-4  ">
          <Select
            value={selectedOptions}
            onChange={setSelectedOptions}
            options={options}
            isMulti
            className="min-w-52"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 text-sm font-semibold"
            onClick={postData}
          >
            Submit
          </button>
        </div>
        <input
          value={userId}
          type="text"
          className="p-2 w-52"
          placeholder="Enter your id"
          onChange={(e) => setUserId(e.target.value)}
        />
        <div className="">
          {showDownloadButton && (
            <button
              onClick={downloadPLS}
              className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg shadow-md hover:bg-blue-700"
            >
              Download PDF
            </button>
          )}
        </div>
      </div>
      {showModal && (
        <CataxComp
          handleFileChange={handleFileChange}
          dataFields={dataFields}
          files={files}
          handleSubmit={handleSubmit}
          handleFileDelete={handleFileDelete}
          uploadFiles={uploadFiles}
          uploadProgress={uploadProgress}
        />
      )}
      <div className="flex gap-10 m-5 ml-[25rem]">
        {Object.keys(accountsData).map((account) => (
          <button
            key={account}
            className={`border border-black p-1 rounded-xl ${
              activeAccount === account ? "bg-blue-200" : ""
            }`}
            onClick={() => handleAccountClick(account)}
          >
            {account}
          </button>
        ))}
      </div>
      <DonutChartCrypto
        data={totalCryptoData}
        colors={customColors}
        id="total-crypto-chart"
      />
    </>
  );
};

export default Page;
