import React from 'react';

const Cartoonizer = (props) => {
  const { setActiveTab, createImageData } = props;

  const redoHandler = () => {
    setActiveTab(0);
  };

  return (
    <>
      <div className="text-center cartoonizer-wrapper">
        <div className="redo-wrapper" onClick={() => redoHandler()}>
          <i className="fas fa-redo"></i>
        </div>

        <img src={props.image} alt="" />

        <div className="preview-tab-details" style={{ marginTop: '10px' }}>
          <div className="text-center">
            <h6>Name : {createImageData.name}</h6>
            <h6>D.O.B : {createImageData.formattedDob}</h6>
            <h6>Gender : {createImageData.gender}</h6>
          </div>
        </div>

        <div className="download-wrapper">
          <button
            className="btn-service sub-btn my-3 d-block"
            onClick={props.mintYourNFT}
            disabled={props.mintButtonContent === 'Loading'}
          >
            {props.mintButtonContent === ''
              ? 'Mint Your NFT'
              : props.mintButtonContent === 'Loading'
              ? 'Loading...'
              : props.mintButtonContent}
          </button>
        </div>
      </div>
    </>
  );
};

export default Cartoonizer;
