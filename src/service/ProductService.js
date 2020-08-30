import axios from 'axios';
export default class ProductService {

    async getProducts() {
		  return axios.get('http://faceprog.ru/reactcourseapi/products/all.php').then(res => res.data);
    }

    getToken() {
      return axios.get('http://faceprog.ru/reactcourseapi/cart/load.php').then(res => res.data.token);
   }

    getCart(token) {
      return axios.get(`http://faceprog.ru/reactcourseapi/cart/load.php?token=${token}`).then(res => res.data);
   }
   
   addProduct(token,id) {
      return axios.get(`http://faceprog.ru/reactcourseapi/cart/add.php?token=${token}&id=${id}`);
   }

   updateCart(token,id,cnt) {
      return axios.get(`http://faceprog.ru/reactcourseapi/cart/change.php?token=${token}&id=${id}&cnt=${cnt}`);
   }

   removeItem(token,id) {
      return axios.get(`http://faceprog.ru/reactcourseapi/cart/remove.php?token=${token}&id=${id}`);
   }

   removeCart(token) {
      return axios.get(`http://faceprog.ru/reactcourseapi/cart/clean.php?token=${token}`);
   }
}

