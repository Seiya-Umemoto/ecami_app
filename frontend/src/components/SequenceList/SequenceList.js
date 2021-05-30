import React, { Component } from 'react';
import axios from 'axios'
import Sequence from './Sequence';
import { Button, Spinner } from 'react-bootstrap';

class SequenceList extends Component {
    state = { 
        sequences: [],
        visible: 4,
        isLoading: true,
        newLoaded: false,
        status: false,
    }
    
    componentDidMount() {
        setTimeout(this.getSequences, 1500)
    }

    getSequences = () =>{
       axios.get('http://127.0.0.1:8000/api/sequences/', {
           headers: {
               'accept': 'application/json'
           }
       }).then(resp=>{
           this.setState({
               sequences: resp.data,
               status: true,
            })
           console.log(resp)
           console.log(resp.data)
       })
       this.setState({isLoading:false})
   }

   handleVisible =()=>{
       const visible = this.state.visible
       const new_visibile = visible + 2
       this.setState({newLoaded:true})
       setTimeout(() => {
        this.setState({
            visible:new_visibile,
            newLoaded:false,
        })
       }, 300);
   }

    render() { 
        const sequences = this.state.sequences.slice(0, this.state.visible).map(sequence=>{
            return <Sequence key={sequence.id} sequence={sequence.sequence} name={sequence.classified}/>
        })
        return ( 
            <div>
                {this.state.isLoading ?
                <Spinner animation="border" role="status"></Spinner>
                : 
                    <React.Fragment>
                        {((this.state.sequences.length === 0) && (this.state.status)) &&
                        <h3>No sequences classified</h3>
                        }
                        {sequences}
                        {this.state.newLoaded &&
                        <Spinner animation="border" role="status"></Spinner>
                        }
                        <br />
                        {((this.state.sequences.length > this.state.visible) && (this.state.sequences.length > 2)) &&
                        <Button className="mb-3" variant='primary' size='lg' onClick={this.handleVisible}>Load more</Button>
                        }
                        {((this.state.sequences.length <= this.state.visible) && (this.state.sequences.length > 0)) &&
                        <h3 className="mb-3">no more sequences to load</h3>
                        }
                    </React.Fragment>
                }
            </div>
         );
    }
}
 
export default SequenceList;