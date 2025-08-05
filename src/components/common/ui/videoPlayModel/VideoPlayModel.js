import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import VideoPlayer from "../video/VideoPlayer";
import "./videoPlayModel.scss";

const VideoPlayModel = ({ onClickCancel,link }) => {
  const [show, setShow] = useState(true);
  const closeModal = () => {
    setShow(false);
  };
  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      className="video_play__model"
      onHide={() => closeModal()}
      backdrop="static"
    >
      <Modal.Header
        onClick={() => {
          onClickCancel();
        }}
        className="p-0 mb-3 close_button"
      >
        x
      </Modal.Header>
      <Modal.Body className="rounded-0 p-0">
        <VideoPlayer
          videoUrl={link}
          width={"100%"}
          height={400}
          autoPlay={true}
        />
      </Modal.Body>
    </Modal>
  );
};

export default VideoPlayModel;
