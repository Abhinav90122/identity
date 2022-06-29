import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import EmptyFooter from '../Layouts/EmptyFooter';
import EmptyHeader from '../Layouts/EmptyHeader';
import Cartoonizer from './Cartoonizer';
import GetDetailsTab from './GetDetailsTab';
import PreviewTab from './PreviewTab';
import NFTArt from '../../abis/NFTArt.json';
import { authContext } from '../../components/authprovider/AuthProvider';
import Web3 from 'web3';
import { createNotification } from 'react-redux-notify';
import { getSuccessNotificationMessage } from '../helper/ToastNotification';
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ipfsClient = require('ipfs-http-client');

const ipfs = ipfsClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
});

const ipfsJson = require('nano-ipfs-store').at('https://ipfs.infura.io:5001');

const LandingPageIndex = () => {
  const dispatch = useDispatch();
  const { auth } = useContext(authContext);
  const [createImageData, setCreateImageData] = useState({
    name: '',
    dob: '',
    gender: '',
    formattedDob: null,
  });
  const [image, setImage] = useState({
    file: '',
    preview_image: '',
  });
  const [activeTab, setActiveTab] = useState(0);
  const [myContract, setMyContract] = useState(null);
  const [mintButtonContent, setMintButtonContent] = useState('');

  console.log(myContract);
  useEffect(() => {
    if (auth.authStatus && !auth.loading) {
      getContract();
    }
  }, [auth.loading, auth.accounts, auth.authStatus]);

  const getContract = async () => {
    const web3 = new Web3(window.ethereum);

    try {
      const networkId = await web3.eth.net.getId();
      const networkData = NFTArt.networks[networkId];

      if (networkData) {
        const contract = new web3.eth.Contract(NFTArt.abi, networkData.address);
        setMyContract(contract);
      } else {
        window.alert('Contract not deployed to detected network.');
      }
    } catch (error) {
      console.log('error', error);
      window.alert('Error occuried, Refresh the page');
    }
  };

  const convertDataURIToBinaryFF = (dataURI) => {
    var BASE64_MARKER = ';base64,';
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var raw = window.atob(dataURI.substring(base64Index));
    return Uint8Array.from(
      Array.prototype.map.call(raw, function (x) {
        return x.charCodeAt(0);
      })
    );
  };

  // Generate metadata json file.
  const generateJson = async (data) => {
    const metadata = JSON.stringify({
      description: data.description,
      external_url: 'https://nft-art.vercel.app',
      image: 'https://ipfs.infura.io/ipfs/' + data.imageHash,
      name: data.name,
      text: data.allWords,
      attributes: [
        data.name != ''
          ? {
              trait_type: 'Name',
              value: data.name,
            }
          : '',
        {
          trait_type: 'DOB',
          value: data.dob,
        },
        {
          trait_type: 'Gender',
          value: data.gender,
        },
      ],
    });
    console.log('Json', metadata);
    return metadata;
  };

  const mintYourNFT = async (event) => {
    event.preventDefault();
    console.log(myContract);

    setMintButtonContent('Loading');
    try {
      setMintButtonContent((prevState) => 'Connecting to Blockchain');

      let imageData = await convertDataURIToBinaryFF(image.preview_image);

      imageData = Buffer(imageData);

      let allWords =
        createImageData.name +
        ' ' +
        createImageData.gender +
        ' ' +
        createImageData.dob;

      //adding file to the IPFS

      ipfs.add(imageData, async (error, result) => {
        console.log('Ipfs result', result);
        if (error) {
          console.error('IPFS Error', error);
          return;
        }

        generateJson({
          name: createImageData.name,
          description: createImageData.description,
          imageHash: result[0].hash,
          dob: createImageData.formattedDob,
          gender: createImageData.gender,
          allWords: allWords,
        }).then(async (val) => {
          try {
            const cid = await ipfsJson.add(val);
            myContract.methods
              .publicMinting(
                auth.accounts,
                'https://ipfs.infura.io/ipfs/' + cid,
                allWords
              )
              .send({
                from: auth.accounts,
                value: window.web3.utils.toWei('0.001', 'Ether'),
              })
              .on('error', (error) => {
                setMintButtonContent('');
              })
              .once('receipt', (receipt) => {
                console.log(receipt);
                const notificationMessage = getSuccessNotificationMessage(
                  'NFT minted successfully'
                );
                dispatch(createNotification(notificationMessage));
                setActiveTab(0);
                setMintButtonContent('');
              });
          } catch (error) {
            console.log('Error', error);
            setMintButtonContent('');
          }
        });
      });
    } catch (error) {
      console.error('Error1', error);
      setMintButtonContent('');
    }
  };

  const handleActiveTab = (value) => {
    switch (value) {
      case 0:
        return (
          <GetDetailsTab
            image={image}
            createImageData={createImageData}
            setCreateImageData={setCreateImageData}
            setImage={setImage}
            setActiveTab={setActiveTab}
          />
        );

      case 1:
        return (
          <PreviewTab
            createImageData={createImageData}
            image={image}
            setActiveTab={setActiveTab}
          />
        );

      case 2:
        return (
          <Cartoonizer
            createImageData={createImageData}
            image={image.preview_image}
            setActiveTab={setActiveTab}
            mintYourNFT={mintYourNFT}
            mintButtonContent={mintButtonContent}
          />
        );

      default:
        return (
          <GetDetailsTab
            image={image}
            createImageData={createImageData}
            setCreateImageData={setCreateImageData}
            setImage={setImage}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  return (
    <>
      <EmptyHeader />
      <div className="banner-sec">
        <div className="banner-content text-center">
          <h2>Web3 Login with NFT</h2>
          <p>
            An efficient platform that transforms your photograph into an
            animated avatar quickly and effortlessly. Use Web3 Login's Avatars
            to login to your social networking handles and other platforms
            instead of worrying about long passwords anymore. Create your NFT
            immediately with no cost.
          </p>
        </div>
      </div>
      <div className="service-sec">
        <Container>
          <Row className="g-0 align-items-center">
            <Col md={6} className="mx-auto">
              <div className="service-details custom-border">
                {handleActiveTab(activeTab)}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="generate-sec" id="howitworks">
        <Container>
          <div className="generate-heading text-center">
            <h2>
              You can test out free NFT Avatars through Web3 Login. Discover how
              to create your own NFT avatar right now.
            </h2>
          </div>
          <div className="generate-image">
            <img src={'/assets/images/GIF-for-NFT.gif'} alt="GIF" />
          </div>
        </Container>
      </div>
      <EmptyFooter />
      <ToastContainer />
    </>
  );
};

export default LandingPageIndex;
