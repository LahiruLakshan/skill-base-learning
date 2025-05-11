import React, { useEffect, useRef } from 'react';
import { bootstrapCameraKit } from '@snap/camera-kit';

const CameraKitComponent = ({ lens_id }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let session;
    let mediaStream;

    const initializeCameraKit = async () => {
      try {
        // Initialize Camera Kit
        const cameraKit = await bootstrapCameraKit({
          apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzM4MTMyNDkwLCJzdWIiOiIzZTI2MTQzMy0xOGI5LTQ5YzAtOTZkYS03MGY4YzRjNzM3NzZ-U1RBR0lOR34wOTA0M2U5ZC0zY2MyLTQ4NTctOTBkZC00MGY5MzJjYTg0YmUifQ.9njDBSC0F9ysBBRJmDcAwJ2rXnGrtnUXx4pQ1NjzlfA',
        });

        if (!canvasRef.current) return;

        // Create session
        session = await cameraKit.createSession({
          liveRenderTarget: canvasRef.current,
        });

        // Get webcam stream
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        // Set source and play
        await session.setSource(mediaStream);
        await session.play();

        // Load and apply lens
        const lens = await cameraKit.lensRepository.loadLens(
          lens_id, // lens_id
          '31955505-9350-4be2-a3c9-f711d2375f5c'
        );
        await session.applyLens(lens);
      } catch (error) {
        console.error('Error initializing Camera Kit:', error);
      }
    };

    initializeCameraKit();

    // Cleanup function
    return () => {
      if (session) {
        session.destroy();
      }
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [lens_id]); // Re-run effect when `id` changes

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default CameraKitComponent;