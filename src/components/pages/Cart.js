import React, { Component } from 'react'
import ProductService from '../../service/ProductService'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import '../../styles/Cart.scss'
 


export class Cart extends Component {

    emptyProduct = {
        id: null,
        name: '',
        image: null,
        description: '',
        category: null,
        price: 0,
        quantity: 0,
        rating: 0,
        inventoryStatus: 'INSTOCK'
    };

    constructor(props) {
        super(props);

        this.state = {
            products: null,
            productDialog: false,
            deleteProductDialog: false,
            deleteProductsDialog: false,
            product: this.emptyProduct,
            selectedProducts: null,
            submitted: false,
            globalFilter: null
        };

        this.productService = new ProductService();
        this.leftToolbarTemplate = this.leftToolbarTemplate.bind(this);
        this.rightToolbarTemplate = this.rightToolbarTemplate.bind(this);
        this.imageBodyTemplate = this.imageBodyTemplate.bind(this);
        this.priceBodyTemplate = this.priceBodyTemplate.bind(this);
        this.ratingBodyTemplate = this.ratingBodyTemplate.bind(this);
        this.statusBodyTemplate = this.statusBodyTemplate.bind(this);
        this.actionBodyTemplate = this.actionBodyTemplate.bind(this);


        this.hideDialog = this.hideDialog.bind(this);
        this.confirmDeleteProduct = this.confirmDeleteProduct.bind(this);
        this.exportCSV = this.exportCSV.bind(this);
        this.confirmDeleteSelected = this.confirmDeleteSelected.bind(this);
        this.deleteSelectedProducts = this.deleteSelectedProducts.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onInputNumberChange = this.onInputNumberChange.bind(this);
        this.hideDeleteProductsDialog = this.hideDeleteProductsDialog.bind(this);
    }

    async componentDidMount() {
        let idsInCart = this.props.cart.cart.map(elem => elem.id);
        if (idsInCart) {
            let sortedIds = this.props.cart.cart.sort((a, b) => a.id > b.id ? 1 : -1);
            await this.productService.getProducts().then(data => data.filter(item => idsInCart.includes(item.id))).then(data => data.filter(item => sortedIds.find(el => item.id === el.id ? item.cnt = el.cnt : false))).then(data => this.setState({ products: data }));
        }
        this.props.updateCartData()
    }

    async setCntValue(cnt, id) {
        await this.productService.updateCart(this.props.token,id,cnt);
        this.props.updateCartData()

    }

    formatCurrency(value) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    hideDialog() {
        this.setState({
            submitted: false,
            productDialog: false
        });
    }

    hideDeleteProductDialog() {
        this.setState({ deleteProductDialog: false });
    }

    hideDeleteProductsDialog() {
        this.setState({ deleteProductsDialog: false });
    }

    confirmDeleteProduct(product) {
        this.setState({
            product,
            deleteProductDialog: true
        });
    }

    findIndexById(id) {
        let index = -1;
        for (let i = 0; i < this.state.products.length; i++) {
            if (this.state.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    exportCSV() {
        this.dt.exportCSV();
    }

    confirmDeleteSelected() {
        this.setState({ deleteProductsDialog: true });
    }

    async deleteSelectedProducts() {
        let products = this.state.products.filter(val => !this.state.selectedProducts.includes(val));
        console.log(this.state.selectedProducts)
        await this.state.selectedProducts.forEach(el => this.productService.removeItem(this.props.token,el.id))
            this.setState({
                products,
                deleteProductsDialog: false,
                selectedProducts: null
            });
            this.props.updateCartData()
        this.toast.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    }


    onCategoryChange(e) {
        let product = {...this.state.product};
        product['category'] = e.value;
        this.setState({ product });
    }

    onInputChange(e, name) {
        const val = (e.target && e.target.value) || '';
        let product = {...this.state.product};
        product[`${name}`] = val;

        this.setState({ product });
    }

    onInputNumberChange(e, name) {
        const val = e.value || 0;
        let product = {...this.state.product};
        product[`${name}`] = val;

        this.setState({ product });
    }

    leftToolbarTemplate() {
        return (
            <>
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={this.confirmDeleteSelected} disabled={!this.state.selectedProducts || !this.state.selectedProducts.length} />
            </>
        )
    }

    rightToolbarTemplate() {
        return (
            <>
               <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={this.exportCSV} />
            </>
        )
    }

    idTemplate(rowData) {
        return rowData.id
    }

    titleTemplate(rowData) {
        return rowData.title
    }

    categoryTemplate() {
        return <span>Phone</span>
    }

    imageBodyTemplate(rowData) {
        return <img src={'https://images-na.ssl-images-amazon.com/images/I/61sAKMokIUL.__AC_SY300_QL70_ML2_.jpg'} alt={rowData.title} className="product-image" />
    }

    priceBodyTemplate(rowData) {
        return this.formatCurrency(rowData.price);
    }

    ratingBodyTemplate() {
        return <Rating value={4} readonly cancel={false} />;
    }

    statusBodyTemplate() {
        return <span className={'product-badge status-instock'}>INSTOCK</span>;
    }

    actionBodyTemplate(rowData) {
        return (
            <>
                <InputNumber id="vertical" value={rowData.cnt} onValueChange={(e) => this.setCntValue(e.value, rowData.id)} mode="decimal" showButtons buttonLayout="vertical" style={{width: '4rem'}}
                decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
            </>
        );
    }

    render() {
        const header = (
            <div className="table-header">
                <h5 className="p-m-0">Manage Products</h5>
                <span className="p-input-icon-left">                    
                    <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Search..." />
                </span>
            </div>
        );

        const deleteProductDialogFooter = (
            <>
                <Button label="No" icon="pi pi-times" className="p-button-text" onClick={this.hideDeleteProductDialog} />
                <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={this.deleteProduct} />
            </>
        );
        const deleteProductsDialogFooter = (
            <>
                <Button label="No" icon="pi pi-times" className="p-button-text" onClick={this.hideDeleteProductsDialog} />
                <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={this.deleteSelectedProducts} />
            </>
        );

        return (
            <div className="datatable-crud-demo">
                <Toast ref={(el) => this.toast = el} />

                <div className="card">
                    <Toolbar className="p-mb-4" left={this.leftToolbarTemplate} right={this.rightToolbarTemplate}></Toolbar>

                    <DataTable ref={(el) => this.dt = el} value={this.state.products} selection={this.state.selectedProducts} onSelectionChange={(e) => this.setState({ selectedProducts: e.value })}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        globalFilter={this.state.globalFilter}
                        header={header}>

                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                        <Column field="ID" header="ID" body={this.idTemplate}></Column>
                        <Column field="name" header="Name" body={this.titleTemplate}></Column>
                        <Column header="Image" body={this.imageBodyTemplate}></Column>
                        <Column field="price" header="Price" body={this.priceBodyTemplate} sortable></Column>
                        <Column field="category" header="Category" body={this.categoryTemplate} sortable></Column>
                        <Column field="rating" header="Reviews" body={this.ratingBodyTemplate} sortable></Column>
                        <Column field="inventoryStatus" header="Status" body={this.statusBodyTemplate}></Column>
                        <Column field="Count" header="Count" body={this.actionBodyTemplate}></Column>
                    </DataTable>
                </div>

                <Dialog visible={this.state.deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={this.hideDeleteProductDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                        {this.state.product && <span>Are you sure you want to delete <b>{this.state.product.name}</b>?</span>}
                    </div>
                </Dialog>

                <Dialog visible={this.state.deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={this.hideDeleteProductsDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                        {this.state.product && <span>Are you sure you want to delete the selected products?</span>}
                    </div>
                </Dialog>
            </div>
        );
    }
}

export default Cart;
