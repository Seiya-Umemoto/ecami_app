import React, { Component } from 'react';
import './Classifier.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Alert, Button, Image, Spinner} from 'react-bootstrap';
import axios from 'axios';
// import Slider from 'react-input-slider';
import RangeStepInput from 'react-range-step-input';

class Classifier extends Component {
    state = { 
        sequences: [],
        isLoading: false,
        recentSequence: null,
        gamma: 1.0,
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
        let sequenceData = JSON.stringify({
            sequence: this.state.sequences
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

    handleChange = (event) => {
        this.setState({sequences : event.target.value});
    }

    onChange(e) {
        const newVal = e.target.value;
        this.setState({gamma: newVal})
    }

    render() { 
        // const [state, setState] = useState({gamma : 1.0})

        return ( 
            <div>
                <form>

                    <label>
                        <div className="input">Input Enzyme Sequence:</div>
                    <textarea value={this.state.value} onChange={this.handleChange} rows={10} cols={100} />
                    </label>
                    <br></br>

                    {this.state.sequences.length > 0 &&
                        <div>
                            <p>Input gamma value:</p>
                            <RangeStepInput>
                                min={0} max={100}
                                value={this.state.gamma} step={1}
                                onChange={this.onChange.bind(this)}
                            </RangeStepInput>
                        </div>
                    }
                    <br></br>
            
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