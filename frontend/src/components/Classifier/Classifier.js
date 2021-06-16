import React, { Component } from 'react';
import './Classifier.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Alert, Button, Image, Spinner} from 'react-bootstrap';
import axios from 'axios';
import Slider from 'react-input-slider';
import HorizontalBarChart from './HorizontalBar';

class Classifier extends Component {
    state = { 
        sequences: [],
        isLoading: false,
        recentSequence: null,
        gamma: 1.0,
        dropdown: "0"
    }


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
        this.setState({recentSequence:null})
        let sequenceData = JSON.stringify({
            sequence: this.state.sequences,
            gamma: this.state.gamma,
            rank5_classified: ["unknown"],
            rank5_probability: [0.0]
        });
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
            console.log("aa")
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

    textAreahandleChange = (event) => {
        this.setState({sequences : event.target.value});
    }

    dropDownHandleChange = (event) => {
        this.setState({dropdown: event.target.value})
    }

    render() { 

        return ( 
            <div>
                <form>

                    <label>
                        <p className="input">Input Enzyme Sequence:</p>
                    <textarea value={this.state.value} onChange={this.textAreahandleChange} rows={10} cols={100} />
                    </label>
                    <br></br>

                    {this.state.sequences.length > 0 &&
                        <div>
                            <p>Select Classifying Model:</p>
                            <select value={this.state.dropdown} onChange={this.dropDownHandleChange}>
                                <option value="0">Bi-directional LSTM</option>
                                <option value="1">ProtCNN</option>
                                <option value="2">k-mer clustering</option>
                            </select>
                            {this.state.dropdown == "2" &&
                                <>
                                <p>Input gamma value:</p>
                                    <div>{'gamma: ' + this.state.gamma}</div>
                                    <Slider
                                        axis="x"
                                        xstep={0.5}
                                        xmin={0}
                                        xmax={5}
                                        x={this.state.gamma}
                                        onChange={({ x }) => this.setState({ gamma: x })}
                                    />
                                </>
                            }
                        </div>
                    }
                    <br></br>
            
                    {this.state.sequences.length > 0 &&
                    <Button variant='info' size='lg' className='mt-3' onClick={this.sendSequence}>Predict the effect of the Sequence</Button>
                    }
                </form>

                    {this.state.isLoading && 
                    <Spinner animation="border" role="status"></Spinner>
                    }

                    {this.state.recentSequence &&
                    <React.Fragment>
                        <Alert variant='primary'>
                            
                            <HorizontalBarChart classified={this.state.recentSequence.data.classified} gamma={this.state.gamma} rank5_classified={this.state.recentSequence.data.rank5_classified} rank5_probability={this.state.recentSequence.data.rank5_probability}></HorizontalBarChart>
                        </Alert>
                        <Image className='justify-content-center' src={this.state.recentSequence.data.picture} height='200' rounded/>
                    </React.Fragment>
                    }
            </div>
         );
    }
}
 
export default Classifier;