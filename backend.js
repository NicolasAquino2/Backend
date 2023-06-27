class ProductManager{
  constructor() {
    this.product = []
  }

  addProduct(data) {
    if (!data.title
      || !data.description
      || !data.price
      || !data.thumbanail
      || !data.code
      || !data.stock){
      return "Error: campos incorrectos" 
      }

      const productExists = this.product.findIndex((product) =>  product.code === data.code)
        if (productExists !== -1){
          console.log("Error: El codigo del producto ya esta en uso" )
          return "Error: El codigo del producto ya esta en uso"
      }
    
      const product = {
        id: this.product.length + 1,
        title: data.title,
        description: data.description,
        price: data.price,
        thumbanail: data.thumbanail,
        code: data.code,
        stock: data.stock
      }
      this.product.push(product)
   return product
      
    }

   
    getProducts(){
       return this.product
    }
 
    getProductById(id){
      const productExists = this.product.find((product) =>  product.id === id)
     if (!productExists){
      const error = "Not found"
      console.log(error)
     }
   return productExists
   
    } 
  
     

}

const manager = new ProductManager ()
console.log(manager.getProducts())

const body = {
 
  "title": "producto 1",
    "description": "desc prod1", 
    "price": 10.2,
    "thumbanail": "www.imagen.com",
    "code": "qwerty",
    "stock": 100

}

manager.addProduct(body)


const body2 = {
 
  "title": "producto 2",
    "description": "desc prod2", 
    "price": 10.2,
    "thumbanail": "www.imagen.com",
    "code": "qwerty",
    "stock": 100

}
console.log(body2)

 manager.addProduct(body2)
 console.log(manager.getProductById())


 const product1 = manager.getProductById(1)
 const product2 = manager.getProductById(2)
 const product3 = manager.getProductById(3)
 console.log(product1)
 console.log(product2)
 console.log(product3)