import React, { useState, useEffect } from "react";
import CenteredModal from "./CenteredModal";
import axios from "axios";
import { urlPrefix, uploadImage } from "../services/apicollection";
import { PrimaryButton } from "./Form";
import Message from "antd-message";

const UploadGalleryImage = ({ onRequestClose, eventId }) => {
  window.message = Message;
  const [caption, setCaption] = useState("");
  const [formData, setFormData] = useState(new FormData());
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const onFileChange = (event) => {
    if (event.target.files.length > 10) {
      setError("maximum 10 images allowed. Select again!");
      return false;
    }
    setError("");
    if (event.target.files) {
      const { files } = event.target;
      if (files && files.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append("images", files[i]);
        }
        setLoading(true);
        axios
          .post(`${urlPrefix}${"v1.0/multipleFilesUpload"}`, formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              timeStamp: "timestamp",
              accept: "*/*",
              "Content-type": "multipart/form-data; boundary=???",
            },
          })
          .then((res) => {
            if (res.data.response.responseCode === 0) {
              setImages(res.data.response.responseData);
            } else {
              setError("Something went wrong!");
            }
            setLoading(false);
          })
          .catch((err) => {
            setError("Something went wrong!");
            setLoading(false);
          });
      }
    }
  };
  const handleUpload = () => {
    setError("");
    formData.append("images", images);
    formData.append("eventId", eventId);
    formData.append("captionText", caption);
    setFormData(formData);
    axios
      .post(`${urlPrefix}${"v1.0/uploadGalleryImage"}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          timeStamp: "timestamp",
          accept: "*/*",
          "Content-type": "multipart/form-data; boundary=???",
        },
      })
      .then((res) => {
        if (res.data.response.responseCode === 0) {
          message.success("Uploaded!");
          onRequestClose();
        } else {
          setError("Something went wrong!");
        }
      })
      .catch((err) => {
        setError("Something went wrong!");
      });
  };
  return (
    <CenteredModal
      width={"auto"}
      isOpen
      onRequestClose={onRequestClose}
      className="flex flex-col m-4"
    >
      <div className="max-w-xs md:max-w-2xl">
        {error && <p className="text-red-600 mx-[60px] mt-[18px] ">{error}</p>}
        <div className="px-6 py-4 my-8">
          <label id="doc">
            <p className="text-sm text-gray-800">
              Select images to upload (max 10 at once)
            </p>
          </label>

          <input
            id="avatars"
            type="file"
            name="doc"
            accept="image/*"
            multiple
            onChange={(e) => {
              onFileChange(e);
            }}
            style={{ fontSize: 12 }}
          />
        </div>
        {Array.isArray(images) && images.length > 0 && (
          <div className="border border-gray-200 h-[17rem] w-full px-2 py-2 flex gap-2 items-center mb-4 overflow-auto">
            {images.map((image) => (
              <img src={image} key={image} className="object-cover w-48 h-64" />
            ))}
          </div>
        )}

        <div className="mx-6">
          <label id="caption">
            <p className="text-sm text-gray-800">Caption</p>
          </label>
          <input
            value={caption}
            placeholder="Enter caption..."
            onChange={({ target }) => {
              setCaption(target.value);
            }}
            style={{ width: "100%" }}
            className="border border-gray-200 px-4 py-1 text-sm"
          />
        </div>
        <div className="flex space-x-2 my-4 mx-auto w-[max-content]">
          <PrimaryButton
            mini
            onClick={() => {
              handleUpload();
            }}
            disabled={loading || (Array.isArray(images) && images.length === 0)}
          >
            {loading ? "Selecting..." : "Update"}
          </PrimaryButton>
        </div>
      </div>
    </CenteredModal>
  );
};

const ImageBox = ({ i }) => {
  return (
    <div className="mb-2 flex justify-center">
      <img src={i} className="w-[7rem]" />
      {/* <p className="text-red-700 text-xs">remove</p> */}
    </div>
  );
};
export default UploadGalleryImage;
