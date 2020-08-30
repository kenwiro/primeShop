import React, { Component } from 'react'
import ProductService from '../../service/ProductService'
import { ProgressSpinner } from 'primereact/progressspinner';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';



export class Cart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cart: null,
            isLoading: false,
            products: null,
            productDialog: false,
            deleteProductDialog: false,
            deleteProductsDialog: false,
            product: this.emptyProduct,
            selectedProducts: null,
            submitted: false,
            globalFilter: null
        }
        this.productService = new ProductService();
    }


    async componentDidMount() {
        // this.setState({ isLoading: true})     
        // this.setState({ isLoading: false})
        this.props.updateCartData()
        // console.log(this.props.cart)
      }

      render() {
          if (this.state.isLoading) {
              return <ProgressSpinner />
          } else {
            return (
                <div>
                    <h1>token: {this.props.token}</h1>
                    <h2>cart token: {this.props.cart.token}</h2>
                    <span>in cart: {JSON.stringify(this.props.cart.cart)}</span>
                </div>
        )
          }
    }
}

export default Cart;
