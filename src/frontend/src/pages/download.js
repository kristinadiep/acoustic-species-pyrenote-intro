import React from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import SpectrogramPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.spectrogram.min.js';
import Button from '../components/button';
import { useNavigate  } from "react-router-dom";

class Download extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            WaveSurfer: null,
        }
    }

    componentDidMount() {

    }
    
    render() {
        return (
            <div>
                download todo
            </div>
        )
    }


}

export default Download