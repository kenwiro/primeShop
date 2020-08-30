import React, { Component } from 'react'
import { TabMenu } from 'primereact/tabmenu';
import '../../styles/Navbar.scss';
export class Navbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [
                {label: 'Home', icon: 'pi pi-fw pi-home', command: (event) => {
                    window.location.hash = "";
                    
                }},
                {label: 'Cart', icon: 'pi pi-shopping-cart', command: (event) => {
                    window.location.hash = "/cart";
                }},
            ],
            activeItem: null
        };
    }
    

    render() {
        return (
            <TabMenu model={this.state.items} activeItem={this.state.activeItem} onTabChange={(e) => this.setState({activeItem: e.value})} />
        );
    }
}

export default Navbar
