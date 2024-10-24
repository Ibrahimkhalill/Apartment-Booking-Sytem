/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, Modal } from "antd";

const MapModal = ({ mapModalVisible, setMapModalVisible }) => {
    console.log(mapModalVisible);
    
  return (
    <>
      <Modal
       title="Basundara Apartment"
        centered
        open={mapModalVisible}
        onOk={() => setMapModalVisible(false)}
        onCancel={() => setMapModalVisible(false)}
        width={1000}
        footer
      >
        <div className="w-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d912.4601703305208!2d90.4387781695695!3d23.824263725491527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7879873a351%3A0xeaa6e9866d86574c!2sH-Block%207%20No.%20Road%2C%20House%20no%20455!5e0!3m2!1sen!2sbd!4v1726997871799!5m2!1sen!2sbd"
            width="100%"
            height="450"
            style={{border:0}}
            allowfullscreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </Modal>
    </>
  );
};
export default MapModal;
