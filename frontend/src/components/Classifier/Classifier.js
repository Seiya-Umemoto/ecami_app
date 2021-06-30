import React, { Component } from 'react';
import './Classifier.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Alert, Button, Image, Spinner} from 'react-bootstrap';
import axios from 'axios';
import Slider from 'react-input-slider';
import HorizontalBarChart from './HorizontalBar';

class Classifier extends Component {
    modelName = ["bi-LSTM", "ProtCNN", "k-mer"];

    state = { 
        sequences: [],
        isLoading: false,
        recentSequence: null,
        gamma: 1.0,
        modelSelection: [false, false, false]
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
            classified: ['unknown', 'unknown', 'unknown'],
            // rank5_classified: [["unknown"],["unknown"],["unknown"]],
            // rank5_probability: [[0.0],[0.0],[0.0]],
            // rank5_classified: ["unknown"],
            // rank5_probability: [0.0],
            modelSelection: this.state.modelSelection
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
            console.log("failed")
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

    checkboxHandleChange = (event) => {
        let items = this.state.modelSelection;
        let item = event.target.checked;
        if (event.target.name === "bi-LSTM") {
            items[0] = item;
        } else if (event.target.name === "ProtCNN") {
            items[1] = item;
        } else {
            items[2] = item;
        }
        this.setState({items});
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
                            <>
                            <label>
                                Bi-directional LSTM:
                                <input
                                    id={this.modelName[0]}
                                    name={this.modelName[0]}
                                    type="checkbox"
                                    checked={this.state.modelSelection[0]}
                                    onChange={this.checkboxHandleChange}    
                                />
                            </label>
                            </>
                            <>
                            <label>
                                ProtCNN:
                                <input
                                    id={this.modelName[1]}
                                    name={this.modelName[1]}
                                    type="checkbox"
                                    checked={this.state.modelSelection[1]}
                                    onChange={this.checkboxHandleChange}
                                />
                            </label>
                            </>
                            <>
                            <label>
                                k-mer clustering:
                                <input
                                    id={this.modelName[2]}
                                    name={this.modelName[2]}
                                    type="checkbox"
                                    checked={this.state.modelSelection[2]}
                                    onChange={this.checkboxHandleChange}
                                />
                            </label>
                            </>
                            {this.state.modelSelection[2] === true &&
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
                    
                    {this.state.sequences.length > 0 && this.state.modelSelection.some(item => item === true) &&
                    <Button variant='info' size='lg' className='mt-3' onClick={this.sendSequence}>Predict the function of the Sequence</Button>
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