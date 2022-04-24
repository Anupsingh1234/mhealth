import React, { useState } from "react";
import ScrollableList from "./ScrollableList";
import EventImageCard from "./EventImageCard";
import { PrimaryButton } from "./Form";
import UploadGalleryImage from "./UploadGalleryImage";

const EventGallery = ({ eventGalleryData, fetchEventGallery, eventId }) => {
  const [showGalleryUploadModal, setShowGalleryUploadModal] = useState(false);
  return (
    <div className="EventGallery">
      <div className="flex justify-between mb-2">
        <div className="challenges-heading">Event Gallery</div>
        <div>
          <PrimaryButton mini onClick={() => setShowGalleryUploadModal(true)}>
            Upload Image
          </PrimaryButton>
        </div>
      </div>

      <div className="event-image-list-wrapper">
        {eventGalleryData.loading ? (
          <ScrollableList>
            <div className="event-image-card"></div>
            <div className="event-image-card"></div>
            <div className="event-image-card"></div>
            <div className="event-image-card"></div>
          </ScrollableList>
        ) : eventGalleryData.data.length > 0 ? (
          <ScrollableList scrollSource="event-gallery">
            {eventGalleryData.data.map((item, index) => {
              return (
                <EventImageCard
                  data={item}
                  key={index}
                  fetchEventGallery={fetchEventGallery}
                />
              );
            })}
          </ScrollableList>
        ) : (
          <p
            style={{ textAlign: "center", margin: "100px 0", color: "#8e8e8e" }}
          >
            {eventGalleryData.message === "SUCCESS"
              ? "Data is not present"
              : eventGalleryData.message}
          </p>
        )}
      </div>
      {showGalleryUploadModal && (
        <UploadGalleryImage
          onRequestClose={() => {
            fetchEventGallery();
            setShowGalleryUploadModal(false);
          }}
          eventId={eventId}
        />
      )}
    </div>
  );
};

export default EventGallery;
