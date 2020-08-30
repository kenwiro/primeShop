import React, { Component } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import ProductService from '../../service/ProductService';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import '../../styles/Products.scss';

export class Products extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            products: null,
            layout: 'grid',
            sortKey: null,
            sortOrder: null,
            sortField: null
        };

        this.sortOptions = [
            {label: 'Price High to Low', value: '!price'},
            {label: 'Price Low to High', value: 'price'},
        ];
        
        this.productService = new ProductService();
        this.itemTemplate = this.itemTemplate.bind(this);
        this.onSortChange = this.onSortChange.bind(this);
    }

    async componentDidMount() {
      this.setState({ isLoading: true})
      await this.productService.getProducts().then(data => this.setState({ products: data }));
      this.setState({ isLoading: false})
    }

    onSortChange(event) {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            this.setState({
                sortOrder: -1,
                sortField: value.substring(1, value.length),
                sortKey: value
            });
        }
        else {
            this.setState({
                sortOrder: 1,
                sortField: value,
                sortKey: value
            });
        }
    }

    async addToCart(data) {
        if (this.props.cart.cart.find(item => item.id === data.id) === undefined)  {
            await this.productService.addProduct(this.props.token, data.id);
            this.props.updateCartData()
        } else {
            let itemsCount = this.props.cart.cart.find(item => item.id === data.id);
            await this.productService.updateCart(this.props.token,data.id,itemsCount.cnt + 1);
            this.props.updateCartData()
            console.log(data.id)
        }
        this.toast.show({ severity: 'success', detail: 'Product added', life: 3000 });
    }

    renderListItem(data) {
        return (
            <div className="p-col-12">
                <div className="product-list-item">
                    <img src='https://images-na.ssl-images-amazon.com/images/I/61sAKMokIUL.__AC_SY300_QL70_ML2_.jpg' alt='dog' />
                    <div className="product-list-detail">
                        <div className="product-name">{data.title}</div>
                        <div className="product-description">Description</div>
                        <Rating value={4} readonly cancel={false}></Rating>
                        <i className="pi pi-tag product-category-icon"></i><span className="product-category">{data.title}</span>
                    </div>
                    <div className="product-list-action">
                        <span className="product-price">${data.price}</span>
                        <Button icon="pi pi-shopping-cart" label="Add to Cart" onClick={ () => this.addToCart(data) }></Button>
                        <span className={`product-badge status-instock`}>INSTOCK</span>
                    </div>
                </div>
            </div>
        );
    }

    renderGridItem(data) {
        return (
            <div className="p-col-12 p-md-4">
                <div className="product-grid-item card">
                    <div className="product-grid-item-top">
                        <div>
                            <i className="pi pi-tag product-category-icon"></i>
                            <span className="product-category">{data.title}</span>
                        </div>        
                        <span className={`product-badge status-instock`}>INSTOCK</span>                
                    </div>
                    <div className="product-grid-item-content">
                    <img src='https://images-na.ssl-images-amazon.com/images/I/61sAKMokIUL.__AC_SY300_QL70_ML2_.jpg' alt={data.title} />
                        <div className="product-name">{data.title}</div>
                        <div className="product-description">Description</div>
                        <Rating value={4} readonly cancel={false}></Rating>
                    </div>
                    <div className="product-grid-item-bottom">
                        <span className="product-price">${data.price}</span>
                        <Button icon="pi pi-shopping-cart" label="Add to Cart" onClick={ () => this.addToCart(data) }></Button>
                    </div>
                </div>
            </div>
        );
    }

    itemTemplate(value, layout) {
      if (layout === 'list') {
          return this.renderListItem(value);
      }
  
      if (layout === 'grid') {
          return this.renderGridItem(value);
      }
  }

    renderHeader() {
        return (
            <div className="p-grid p-nogutter">
                <div className="p-col-6" style={{textAlign: 'left'}}>
                    <Dropdown options={this.sortOptions} value={this.state.sortKey} optionLabel="label" placeholder="Sort By Price" onChange={this.onSortChange}/>
                </div>
                <div className="p-col-6" style={{textAlign: 'right'}}>
                    <DataViewLayoutOptions layout={this.state.layout} onChange={(e) => this.setState({ layout: e.value })} />
                </div>
            </div>
        );
    }

    render() {
        
        const header = this.renderHeader();
        return (
            <div className="dataview-demo">
                <Toast ref={(el) => this.toast = el} />
                <div className="card">
                    <DataView value={this.state.products} layout={this.state.layout} header={header}
                            itemTemplate={this.itemTemplate} paginator rows={4}
                            sortOrder={this.state.sortOrder} sortField={this.state.sortField} />
                </div>
            </div>
        );
    }
}

export default Products