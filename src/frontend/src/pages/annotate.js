import React from 'react';
import WaveSurfer from '../wavesurfer.js/src/wavesurfer.js';
import RegionsPlugin from '../wavesurfer.js/src/plugin/regions/index.js';
import SpectrogramPlugin from '../wavesurfer.js/src/plugin/spectrogram/index.js';
import {Button} from '../components/button';
import { useNavigate  } from "react-router-dom";
import axios from 'axios';
import { IconButton } from '../components/button';
import {
    faBackward,
    faForward,
    faPlayCircle,
    faPauseCircle
  } from '@fortawesome/free-solid-svg-icons';


const colormap = require('colormap');

class Annotate extends React.Component {
    constructor(props) {
        super(props)
        this.props = props
        this.state = {
            wavesurfer: null,
            isSecureContext: false,
        }
    }

    componentDidMount() {
        const spectrogramColorMap = colormap({
            colormap: 'hot',
            nshades: 256,
            format: 'float'
          });
        axios({
            method: 'get',
            url: `/api/get_data`
          })
            .then(response => {
                
                const filename = response.data.data
                const fftSamples = 512;

                var wavesurfer = WaveSurfer.create({
                    container: '#waveform',
                    scrollParent: true,
                    fillParent : true,
                    height: 256,
                    plugins: [
                        RegionsPlugin.create({ dragSelection: {
                            slop: 5
                        }}),
                        SpectrogramPlugin.create({
                            fftSamples,
                            position: 'relative',
                            container: '#wavegraph',
                            labelContainer: '#waveform-labels',
                            labels: true,
                            scrollParent: true,
                            colorMap: spectrogramColorMap,
                            checkCallback: () => {
                              return window.location.href.includes('annotate');
                            }
                          }),
                    ]
        
                });
                wavesurfer.on('ready', () => {
                    const screenSize = window.screen.width;
                    if (screenSize > wavesurfer.getDuration() * wavesurfer.params.minPxPerSec) {
                      wavesurfer.zoom(screenSize / wavesurfer.getDuration());
                      wavesurfer.spectrogram._onUpdate(screenSize);
                    }
                    this.state.isRendering = false;
                    this.setState({ isRendering: false });
                    wavesurfer.enableDragSelection({ color: 'rgba(0, 102, 255, 0.3)' });
                  });
                  wavesurfer.on('region-updated', region => {
                    this.handlePause();
                    this.styleRegionColor(region, 'rgba(0, 102, 255, 0.3)');
                    //unsavedButton.addUnsaved(region);
                    region._onUnSave();
                  });
              
                  wavesurfer.on('region-created', region => {
                    //region.data.annotations = ;
                    this.handlePause();
                    /*const { storedAnnotations, applyPreviousAnnotations } = this.state;
                    if (applyPreviousAnnotations) {
                      region.data.annotations = storedAnnotations;
                    }
                    */
                    this.setState({
                      selectedSegment: region
                    });
                    //unsavedButton.addUnsaved(region, !region.saved);
                  });
              
                  wavesurfer.on('spectrogram_created', spectrogram => {
                    this.setState({ spectrogram });
                  });
              
                  wavesurfer.on('click', () => {
                    this.handlePause();
                  });
              
                  wavesurfer.on('region-click', (r, e) => {
                    e.stopPropagation();
                    this.setState({
                      isPlaying: true,
                      selectedSegment: r
                    });
                    r.play();
                  });
                  wavesurfer.on('pause', () => {
                    this.setState({ isPlaying: false });
                  });
                  wavesurfer.on('play', () => {
                    this.setState({ isPlaying: true });
                  });
              
        
                wavesurfer.load(`/audios/${filename}`);
                this.setState({wavesurfer, filename})
            })
            .catch(error => {
                console.error(error);
            })
    }

    handlePlay() {
        const { wavesurfer } = this.state;
        this.setState({ isPlaying: true });
        wavesurfer.play();
      }
    
      handlePause() {
        const { wavesurfer } = this.state;
        this.setState({ isPlaying: false });
        wavesurfer.pause();
      }
    
      handleForward() {
        const { wavesurfer } = this.state;
        wavesurfer.skipForward(5);
      }
    
      handleBackward() {
        const { wavesurfer } = this.state;
        wavesurfer.skipBackward(5);
      }
    
      handleZoom(e) {
        const { wavesurfer } = this.state;
        const zoom = Number(e.target.value);
        wavesurfer.zoom(zoom);
        this.setState({ zoom });
      }
    
      styleRegionColor(region, color) {
        region.style(region.element, {
          backgroundColor: color
        });
      }

      handleSave() {
        const { wavesurfer, filename } = this.state;
        console.log(wavesurfer.regions.list)
        for (var region in wavesurfer.regions.list) {
          var anntoation = wavesurfer.regions.list[region]
          console.log(anntoation) //Could the data in here help you...?
          anntoation._onSave()
            axios({
                method: 'INSERT METHOD', //TODO: What method is needed here: post, delete, patch, or get? 
                url: `/api/INSERT_URL`, //TODO: What URL did you define in the backend?
                data: {
                    data: "example data to upload - from frontend"
                    //TODO: What data to we need to add here for each 
                    //HINT: Check console output
                }
              })
                .then(response => {
                    console.log(response)
                    
                })
                .catch(error => {
                    console.error(error)
                })
              }
      }

      handleDEBUG() {
        const { wavesurfer, filename } = this.state;
        console.log(wavesurfer.regions.list)
        axios({
            method: 'get',
            url: `/api/get_labels`,
            headers: {
                data: filename
            }
          })
            .then(response => {
                console.log(response)
                
            })
            .catch(error => {
                console.error(error)
            })
      }
    
    render() {
        const {isPlaying} = this.state
        let isRendering = false
        return (
            <div>
                <div
                    className="row justify-content-md-center my-4 mx-3"
                    style={{ display: isRendering ? 'none' : '' }}
                >
                <div id="waveform-labels" style={{ float: 'left' }} />
                <div id="wavegraph" style={{ float: 'left' }} />
                <div id="waveform" style={{ float: 'left' }} />
                <div id="timeline" />
                </div>
                <div className="row justify-content-center my-4">
        <div className="col-md-1 col-2">
          <IconButton
            icon={faBackward}
            size="2x"
            title="Skip Backward"
            onClick={() => {
              this.handleBackward();
            }}
          />
        </div>
        <div className="col-md-1 col-2">
          {!isPlaying ? (
            <IconButton
              icon={faPlayCircle}
              size="2x"
              title="Play"
              onClick={() => {
                this.handlePlay();
              }}
            />
          ) : null}
          {isPlaying ? (
            <IconButton
              icon={faPauseCircle}
              size="2x"
              title="Pause"
              onClick={() => {
                this.handlePause();
              }}
            />
          ) : null}
        </div>
        <div className="col-md-1 col-2">
          <IconButton
            icon={faForward}
            size="2x"
            title="Skip Forward"
            onClick={() => {
              this.handleForward();
            }}
          />
        </div>
      </div>
      <div className="col-md-1 col-2">
      <Button
          size="lg"
          type="primary"
          
          onClick={() => this.handleSave()}
          text="Save All"
        />
         <Button
          size="lg"
          type="primary"
          
          onClick={() => this.props.history.go(0)}
          text="next"
        />
        <Button
          size="lg"
          type="primary"
          
          onClick={() => this.handleDEBUG()}
          text="DEBUG"
        />
        </div>
            </div>
            
        )
    }


}

export default Annotate