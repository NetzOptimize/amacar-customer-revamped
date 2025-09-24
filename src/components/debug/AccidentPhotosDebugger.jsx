import React from 'react';
import { useSelector } from 'react-redux';

const AccidentPhotosDebugger = () => {
  const { uploadedImages, offer } = useSelector((state) => state?.carDetailsAndQuestions);
  const hasAccident = offer?.isAccident === true;

  const accidentPhotos = (uploadedImages || []).filter(img => img.metaKey?.includes('accident'));
  const regularPhotos = (uploadedImages || []).filter(img => !img.metaKey?.includes('accident'));

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px',
      maxHeight: '400px',
      overflow: 'auto'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#f6851f' }}>🐛 Accident Photos Debug</h4>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Has Accident:</strong> {hasAccident ? '✅ Yes' : '❌ No'}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Total Uploaded Images:</strong> {uploadedImages?.length || 0}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Regular Photos:</strong> {regularPhotos.length}
        <ul style={{ margin: '5px 0', paddingLeft: '15px' }}>
          {regularPhotos.map((img, idx) => (
            <li key={idx} style={{ fontSize: '10px' }}>
              {img.metaKey} (ID: {img.attachmentId})
            </li>
          ))}
        </ul>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Accident Photos:</strong> {accidentPhotos.length}
        <ul style={{ margin: '5px 0', paddingLeft: '15px' }}>
          {accidentPhotos.map((img, idx) => (
            <li key={idx} style={{ fontSize: '10px' }}>
              {img.metaKey} (ID: {img.attachmentId})
            </li>
          ))}
        </ul>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Redux State:</strong>
        <pre style={{ 
          fontSize: '10px', 
          background: 'rgba(255,255,255,0.1)', 
          padding: '5px', 
          borderRadius: '3px',
          margin: '5px 0',
          maxHeight: '100px',
          overflow: 'auto'
        }}>
          {JSON.stringify({ 
            uploadedImages: uploadedImages?.length || 0,
            hasAccident,
            accidentPhotos: accidentPhotos.length,
            regularPhotos: regularPhotos.length
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default AccidentPhotosDebugger;
