import React, { Component } from 'react'
import { withRouter} from 'react-router-dom'
export class Test extends Component {

        handler = () => {
          this.props.history.push('/cources');
        };
        
        render() { 
            return <h1>yuguy</h1>
         }
      }
      
      export default withRouter(Test);