import React, { Component, Fragment } from 'react';
import Products from './components/Products/Products'
import Navbar from './components/Navbar/Navbar';
import 'primeicons/primeicons.css'
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/nova-light/theme.css'
import 'primeflex/primeflex.css';
import { BrowserRouter as Router} from 'react-router-dom'
import Cart from './components/pages/Cart.js'
import ProductService from './service/ProductService'


export class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      route: window.location.hash.substr(1),
      token: null,
      cart: null
    }
    this.productService = new ProductService();
  }
  async componentDidMount() {

    this.setState({ isLoading: true})
    await this.productService.getToken().then(token => this.setState({ token: token }));
    await this.productService.getCart(this.state.token).then(cart => this.setState({ cart: cart }));
    console.log(this.state.cart)
    this.setState({ isLoading: false})

    window.addEventListener('hashchange', () => {
      this.setState({
        route: window.location.hash.substr(1),
      })
    })
  }

    async updateCartData() {
      await this.productService.getCart(this.state.token).then(cart => this.setState({ cart: cart }));
    }

   render() {
    let Child

    switch (this.state.route) {
      case '/cart':
        Child = Cart
        break
      default:
        Child = Products
    }

           return (
          <Router>
            <Fragment>
              <Navbar />
              <div className="container">
                <Child token={this.state.token} cart={this.state.cart} updateCartData={this.updateCartData.bind(this)}/>
              </div>
            </Fragment>
          </Router>
        );
    }
}

export default App