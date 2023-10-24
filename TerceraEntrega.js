const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;

app.use(bodyParser.json());

app.post('/agregar', (req, res) => {
    const { Titulo, Descripcion, Precio, Miniatura, Codigo, Cantidad } = req.body;
    peticion.agregarProducto(Titulo, Descripcion, Precio, Miniatura, Codigo, Cantidad);
    res.send('Producto agregado correctamente');
});


// Obtener Productos con o sin límite
app.get('/producto', async (req, res) => {
  try {
      const productos = await peticion.ObtenerProductos();
      
      const limit = parseInt(req.query.limit);
      if (!isNaN(limit) && limit > 0) {
          const productosLimitados = productos.slice(0, limit);
          res.json(productosLimitados);
      } else {
          res.json(productos);
      }
  } catch (error) {
      res.status(500).send('Error al obtener los productos');
  }
});

// Obtener un producto por ID
app.get('/producto/:id', async (req, res) => {
  try {
      const ID = req.params.id;
      const producto = await peticion.obtenerProductoPorID(parseInt(ID));
      if (producto) {
          res.json(producto);
      } else {
          res.status(404).send('Producto no encontrado');
      }
  } catch (error) {
      res.status(500).send('Error al obtener los productos');
  }
});



app.listen(port, () => {
    console.log(`Servidor Express funcionando en ${port}`);
  });


// Crea la clase product manager
class ProductManager {
    constructor() {
      this.Productos = [];
      this.UltimoID = 0;
      this.CodigosGuardados = new Set();
    }
    
    //Verifica que el codigo ne se repita
    agregarProducto(Titulo, Descripcion, Precio, Miniatura, Codigo, Cantidad) {
      if (this.CodigosGuardados.has(Codigo)) {
        console.error(`El código ${Codigo} ya está en uso.`);
        return;
      }
      
      //Aumenta en 1 el ID
      const ID = this.UltimoID + 1;
      this.UltimoID = ID;
      

      const producto = new AgregarProductos(
        ID,
        Titulo,
        Descripcion,
        Precio,
        Miniatura,
        Codigo,
        Cantidad
      );
      
      //Inserta los productos y el codigo productmanager
      this.Productos.push(producto);
      this.CodigosGuardados.add(Codigo);
    }
    
    //Devuelve los productos
    ObtenerProductos() {
      return this.Productos;
    }
    //Devuelve el ID
    obtenerProductoPorID(ID) {
      return this.Productos.find(producto => producto.ID === ID);
    }

    //Actualiza un producto mediante el ingreso de su ID, campo y su nuevo valor
    actualizarProducto(ID, campo, valor) {
        const producto = this.obtenerProductoPorID(ID);
        if (producto) {
          producto[campo] = valor;
        } else {
          console.error(`Producto con ID ${ID} no encontrado.`);
        }
    }

    //Borra un producto mediante su ID si se ingresa un ID que no existe este devolvera un error
    borrarProducto(ID) {
        const productoIndex = this.Productos.findIndex(producto => producto.ID === ID);
        if (productoIndex !== -1) {
          const productoBorrado = this.Productos.splice(productoIndex, 1)[0];
          this.CodigosGuardados.delete(productoBorrado.Codigo);
          console.log(`Producto con ID ${ID} ha sido eliminado.`);
        } else {
          console.error(`Producto con ID ${ID} no encontrado.`);
        }
    }
}
  
  class AgregarProductos {
    constructor(ID, Titulo, Descripcion, Precio, Miniatura, Codigo, Cantidad) {
      this.ID = ID;
      this.Titulo = Titulo;
      this.Descripcion = Descripcion;
      this.Precio = Precio;
      this.Miniatura = Miniatura;
      this.Codigo = Codigo;
      this.Cantidad = Cantidad;
    }
}
  
// Uso del código
const peticion = new ProductManager();

//Utiliza agregar productos para insertar caracteristicas del producto, ¡cambiar el codigo a uno usado para verificar que no se rrepita!
peticion.agregarProducto("Zapatilla", "Zapatilla Marca Nike", 10000, "Imagen.jpg", "1", 10);
peticion.agregarProducto("Pantalon", "Pantalon Marca Levi`s", 3000, "Imagen.jpg", "2", 20);
peticion.agregarProducto("Remera", "Remera Marca Vans", 4000, "Imagen.jpg", "3", 15);
peticion.agregarProducto("Camisa", "Camisa Marca Lacoste", 10000, "Imagen.jpg", "4", 10);
peticion.agregarProducto("Zapatillas", "Zapatillas Marca Fila", 20000, "Imagen.jpg", "5", 20);
peticion.agregarProducto("Remera", "Remera Marca Cucci", 15000, "Imagen.jpg", "6", 5);
peticion.agregarProducto("Pantalon", "Pantalon Marca Furor", 13000, "Imagen.jpg", "7", 15);
peticion.agregarProducto("Corbata", "Corbata Marca Hermès", 10000, "Imagen.jpg", "8", 8);
peticion.agregarProducto("Vestido", "Vestido Marca Ted Baker", 30000, "Imagen.jpg", "9", 6);
peticion.agregarProducto("Falda", "Falda Marca GANNI", 9000, "Imagen.jpg", "10", 7);

//Muestra la lista de productos completa
console.log("Lista de Productos:");
console.log(peticion.ObtenerProductos());

//Buscar producto por ID, si no hay devuelve "Producto no encontrado."
const productoPorID = peticion.obtenerProductoPorID(1);
if (productoPorID) {
  console.log(`Producto con ID ${productoPorID.ID}:`);
  console.log(productoPorID);
} else {
  console.log("Producto no encontrado");
}

//Mostrar Producto actualizado
peticion.actualizarProducto(2, 'Precio', 3500);

console.log("Lista de Productos actualizada:");
console.log(peticion.ObtenerProductos());

//Mostrar lista con producto eliminado
peticion.borrarProducto(1);

console.log("Lista de Productos actualizada:");
console.log(peticion.ObtenerProductos());

//Obtener mediante el servidor(Ejecutar antes: TerceraEntrega.js)

//Todos los productos: http://localhost:8080/producto/
//El producto por ID: http://localhost:8080/producto/2
//Obtener los productos con un limite: http://localhost:8080/producto?limit=5
