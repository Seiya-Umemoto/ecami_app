import React, { Component } from 'react';
import './Classifier.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Alert, Button, Image, Spinner} from 'react-bootstrap';
import axios from 'axios';
import Slider from 'react-input-slider';

class Classifier extends Component {
    state = { 
        sequences: [],
        isLoading: false,
        recentSequence: null,
        gamma: null,
     }

    //  onDrop =(sequences)=>{
    //     this.setState({
    //         sequences:[],
    //         isLoading: true, 
    //         recentSequence: null,
    //         })
    //     this.loadSequence(sequences)
    //  }

     loadSequence=(sequences)=>{
        setTimeout(() => {
            this.setState({
                sequences,
                isLoading: false
            }, () => {
                console.log(this.state.sequences[0].name)
            })
        }, 1000);
     }

     activateSpinner =()=> {
        this.setState({
            sequences:[],
            isLoading:true,
        })
     }

     deactivateSpinner =()=> {
        this.setState({isLoading:false})
     }

     sendSequence =()=>{
         this.activateSpinner()
        //  const sequenceData = {
        //      name: this.state.sequences[0].name
        //  }
         let sequenceData = JSON.stringify({
            sequence: this.state.sequences
          });
        //  let formData = new FormData()
        //  console.log(this.state.sequences[0].name)
        //  formData.append('picture', this.state.sequences[0], this.state.sequences[0].name)
        //  console.log(formData.getAll('picture'))
        console.log(this.state.sequences);
        console.log(sequenceData);
         axios.post('http://127.0.0.1:8000/api/sequences/', sequenceData, {
             headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
             }
         })
         .then(resp=>{
             this.getSequenceClass(resp)
             console.log(resp.data.id)
         })
         .catch(err=>{
             console.log(err)
         })
     }

     getSequenceClass =(obj)=> {
        axios.get(`http://127.0.0.1:8000/api/sequences/${obj.data.id}/`, {
            headers: {
                'accept': 'application/json',
            }
        })
        .then(resp=>{
            this.setState({recentSequence:resp})
            console.log(resp)
        })
        .catch(err=>{
            console.log(err)
        })
        this.deactivateSpinner()
     }

    setRef = (webcam) => {
        this.webcam = webcam;
    }

    dataURLtoBlob = (dataurl) => {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }

    screenShot = () => {
        const imageSrc = this.webcam.getScreenshot();
        const blob = this.dataURLtoBlob(imageSrc);
        var today = new Date(),
            time = today.getHours() + "_" + today.getMinutes() + "_" + today.getSeconds() + ".jpg";
        const myFile = this.blobToFile(blob, time);
        this.setState({sequences:[]})
        this.state.sequences.push(myFile);
        this.sendSequence();
    }

    // blobToFile = (theBlob, fileName) => {
    //     theBlob.lastModifiedDate = new Date();
    //     theBlob.name = fileName;
    //     theBlob.path = fileName;
    //     theBlob.webkitRelativePath = "";
    //     return theBlob;
    // }

    handleChange = (event) => {
        this.setState({sequences : event.target.value});
    }

    handleSubmit = (event) => {
        alert('Enzyme Sequence was inputted: ' + this.state.sequences);
        event.preventDefault();
        this.sendSequence();
    }

    render() { 
        // const sequences = this.state.sequences.map(sequence => (
        //     <li key={sequence.name}>
        //       {sequence.name} - {sequence.size} bytes
        //     </li>
        //   ));
        return ( 
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <div class="input">Input Enzyme Sequence:</div>I
                    <textarea value={this.state.value} onChange={this.handleChange} rows={10} cols={100} />
                    </label>
                    <br></br>
                    {/* <input type="submit" value="Predict" /> */}

                    {this.state.sequences.length > 0 &&
                        <div>
                        <Slider axis="x" x={this.state.gamma} onChange={this.setState} />
                        {/* <Slider axis="gamma" x={this.state.gamma} onChange={({ x }) => this.setState({gamma : x}) /> */}
                        </div>
                    }
            
                    {this.state.sequences.length > 0 &&
                    <Button variant='info' size='lg' className='mt-3' onClick={this.sendSequence}>Predict Sequence</Button>
                    }
                </form>

                    {this.state.isLoading && 
                    <Spinner animation="border" role="status"></Spinner>
                    }

                    {this.state.recentSequence &&
                    <React.Fragment>
                        <Alert variant='primary'>
                            {this.state.recentSequence.data.classified}
                        </Alert>
                        <Image className='justify-content-center' src={this.state.recentSequence.data.picture} height='200' rounded/>
                    </React.Fragment>
                    }
            </div>
         );
    }
}
 
export default Classifier;