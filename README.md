# Membuat Mini ecommerce dengan ExpressJS dan EJS

## Deskripsi

Kita akan membuat sebuat mini e-commerce dengan nodejs, express, ejs, sequelize, dan postgresql. Adapun halaman yang akan kita buat adalah halaman home yang akan menampilkan seluruh produk dengan button buy, dan halaman admin untuk menambahkan prduk baru. Jika user klik buy, maka stok akan berkurang, jika stok habis, maka produk tidak akan muncul di halaman home.

## Entity Relationship Diagram

- **Categories**

  - name

- **Products**
  - name
  - price
  - stock
  - image
  - CategoryId [References to Categories]

Relasi antara Categories dan Products adalah one to many, dimana satu kategori bisa memiliki banyak produk.

## Yang harus di install

- Text Editor (VSCode, WebStorm, Sublime Text, Atom, dll)
- Database (PostgreSQL, MySQL, dll)
- Browser (Chrome, Firefox, dll)
- NodeJS
- Node Package Manager (NPM)
- Database GUI (DBeaver, pgAdmin, Postico, Workbench, dll)
- Git Bash (Untuk pengguna Windows)

## Langkah-langkah

### Setup Project dan Install ExpressJS

Kita akan menggunakan express untuk membuat server, untuk itu kita perlu menginstall express. Sebelum itu pastikan kalian sudah install nodejs dan npm di komputer kalian. Jika belum, silahkan download dan install di [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

Anda bisa mengecek apakah nodejs dan npm sudah terinstall dengan mengetikkan perintah berikut di terminal

```bash
node -v
npm -v
```

Selanjutnya, kita akan membuat folder project dan menginstall express, berikut langkah-langkahnya :

1. Buat folder baru dengan nama `mini-ecommerce` dan masuk ke dalam folder tersebut

2. Di terminal, jalankan perintah `npm init -y` untuk membuat file `package.json`

3. Install express :

```bash
npm install express
```

4. Buat file `index.js` dan buat server dengan express

```javascript
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Ecommerce app running at http://localhost:${port}`);
});
```

5. Jalankan server dengan perintah `node index.js` dan buka di browser dengan url `http://localhost:3000`

![Hello World](/assets/hello-world.png)

6. Install nodemon agar server restart otomatis ketika ada perubahan di file `index.js`

```bash
npm install nodemon --save-dev
```

atau bisa menginstalnya secara global dengan perintah

```bash
npm install -g nodemon
```

7. Tambahkan script di `package.json` untuk menjalankan server dengan perintah `npm run dev`

```json
"scripts": {
    "dev": "nodemon index.js"
  },
```

8. Jalankan server dengan perintah `npm run dev`

### Install Sequelize dan Postgress

Untuk membuat database, kita akan menggunakan sequelize-cli dan postgresql. Sebelumnya, pastikan postgresql sudah terinstall di komputer kita. Jika belum, silahkan download dan install di [https://www.postgresql.org/download/](https://www.postgresql.org/download/)

Pastikan Anda menginstall postgresql dengan user `postgres` dan password `postgres`. Jika tidak, silahkan sesuaikan dengan user dan password yang Anda gunakan.

Berikut langkah-langkahnya :

1. Install sequelize-cli secara global

```bash
npm install -g sequelize-cli
```

2. Install sequelize dan postgres

```bash
npm install sequelize pg
```

3. Generate file konfigurasi sequelize dengan perintah

```bash
sequelize init
```

> Didalam folder project anda seharunya sudah terbuat folder baru dengan nama `config`, `models`, `migrations`, dan `seeders`.

4. Masuk ke folder `config` dan buka file `config.json`. Sesuaikan konfigurasi database dengan database yang akan Anda gunakan. Jika Anda menggunakan postgresql, maka konfigurasinya seperti berikut :

```json
    "development": {
        "username": "postgres",
        "password": "postgres",
        "database": "ecommerce_db",
        "host": "127.0.0.1",
        "dialect": "postgres"
    }
```

### Membuat Model dan Migration

Selanjutnya kita akan membuat model dan migration untuk tabel `Categories` dan `Products`. Berikut langkah-langkahnya :

1. Buat model dan migration untuk tabel `Categories`

```bash
sequelize model:generate --name Category --attributes name:string
```

2. Buat model dan migration untuk tabel `Products`

```bash
sequelize model:generate --name Product --attributes name:string,price:integer,stock:integer,image:string,CategoryId:integer
```

> Seharusnya di folder `models` sudah terbuat file `categories.js` dan `products.js`, dan di folder `migrations` sudah terbuat file `xxxx-create-categories.js` dan `xxxx-create-products.js`. Kita membuat contrain dan validation, serta akan mendefinisikan relasi antara kedua tabel tersebut di file `xxxx-create-products.js`.

3. Masuk ke folder `migrations` dan buka file `xxxx-create-categories.js`. Sesuaikan kode di file tersebut dengan kode berikut :

```javascript
    name: {
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
    },
```

> `unique:true` digunakan untuk memastikan tidak ada nama kategori yang sama. sementara allowNull:false digunakan untuk memastikan nama kategori tidak boleh kosong.

4. Masuk ke folder `migrations` dan buka file `xxxx-create-products.js`. Sesuaikan kode di file tersebut dengan kode berikut :

```javascript
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    price: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    image: {
        type: Sequelize.STRING,
    },
    CategoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
```

> `allowNull: false` digunakan untuk memastikan tidak ada data yang kosong. `references` digunakan untuk mendefinisikan relasi antara tabel `Products` dan `Categories`. `onUpdate: "CASCADE"` dan `onDelete: "CASCADE"` digunakan untuk menghapus data di tabel `Products` jika data di tabel `Categories` dihapus.

> Selanjutkan kita akan membuat relasi antara tabel `Categories` dan `Products` di file `category.js` dan `product.js` dalam folder `models`. Sesuaikan kode di file tersebut dengan kode berikut :

5. Buka file `category.js`. Sesuaikan kode di file tersebut dengan kode berikut :

```javascript
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Product, {
        foreignKey: "CategoryId",
      });
    }
  }
  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Category already exists",
        },
        validate: {
          notNull: {
            args: true,
            msg: "Category name is required",
          },
          notEmpty: {
            args: true,
            msg: "Category name is required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Category",
    }
  );
  return Category;
};
```

6. Buka file `product.js`. Sesuaikan kode di file tersebut dengan kode berikut :

```javascript
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category, {
        foreignKey: "CategoryId",
      });
    }
  }
  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Product name is required",
          },
          notEmpty: {
            args: true,
            msg: "Product name is required",
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Product price is required",
          },
          notEmpty: {
            args: true,
            msg: "Product price is required",
          },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Product stock is required",
          },
          notEmpty: {
            args: true,
            msg: "Product stock is required",
          },
          customValidator(value) {
            if (value < 0) {
              throw new Error("Product stock must be greater than 0");
            }
          },
        },
      },
      image: DataTypes.STRING,
      CategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Category is required",
          },
          notEmpty: {
            args: true,
            msg: "Category is required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
```

> Pada file `product.js` kita membuat custom validator untuk memastikan stock produk tidak boleh kurang dari 0.

7. Selanjutnya kita akan membuat database. Jalankan perintah berikut :

```bash
sequelize db:create
sequelize db:migrate
```

> Jika berhasil, maka akan muncul tampilan seperti berikut :

![db-create](/assets/db-create.png)

> ada beberapa kemungkinan error saat creat database dan migrate tabel. Jika terjadi error, coba cek kembali konfigurasi database di file `config/config.json` dan pastikan database sudah dibuat di postgresql.

8. Melakukan migrasi table `Categories` dan `Products`. Jalankan perintah berikut :

```bash
sequelize db:migrate
```

> Jika berhasil, maka akan muncul tampilan seperti berikut :

![db-migrate](/assets/db-migrate.png)

> Anda bisa mengecek di postgresql apakah tabel `Categories` dan `Products` sudah terbuat atau belum.

![db-migrate](/assets/erd.png)

### Menginstall EJS

Selanjutnya kita kana menginstall **EJS**. **EJS** adalah salah satu template engine yang digunakan untuk membuat tampilan website. Untuk menginstall **EJS**, jalankan perintah berikut :

```bash
npm install ejs
```

Untuk memudahkan proses editing file **EJS**, kita akan menginstall ekstensi **EJS Language Support** di VSCode.

1. Menggunakan **EJS** di file `index.js`. Sesuaikan kode di file tersebut dengan kode berikut :

```javascript
app.set("view engine", "ejs");
```

2. Membuat folder `views` di root project. Folder `views` digunakan untuk menyimpan file **EJS**. Anda bisa menggunakan perintah terminal `mkdir` untuk membuat folder, dan `touch` untuk membuat file. Jalankan perintah berikut :

```bash
mkdir views
touch views/index.ejs
```

3. Membuat halaman index. Sesuaikan kode di file `index.ejs` dengan kode berikut :

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Simple E-Commerce</title>
  </head>
  <body>
    <h1>Simple E-Commerce</h1>
  </body>
</html>
```

4. Menampilkan halaman index. Sesuaikan kode di file `index.js` dengan kode berikut :

```javascript
app.get("/", (req, res) => {
  res.render("index");
});
```

> jika ada error karena directory, Anda bisa menambahkan `__dirname` di file `index.js` seperti berikut :

```javascript
const path = require("path");

app.set("views", path.join(__dirname, "views"));
```

> jika sekarang anda menjalankan server, maka akan muncul tampilan seperti berikut :

![ejs](/assets/ejs-index-origin.png)

Selamat anda sudah berhasil membuat halaman index menggunakan **EJS**.

> Sekarang kita akan mengirim data ke halaman index. Kita akan mengirim data berupa list kategori dan list produk. Kita akan buat data secara manual terlebih dahulu.

5. Membuat data produk. Sesuaikan kode di file `index.js` dengan kode berikut :

```javascript

const products : [
    {
        id: 1,
        name: "Sepatu Warrior Hitam Putih",
        price: 100000,
        stock: 10,
        image: "https://img.ws.mms.shopee.co.id/5ab199972773599fc35bff4d039302b9",
        CategoryId: 1,
        Category: {
            id: 1,
            name: "Fashion"
        }
    },
    {
        id: 2,
        name: "iPhone 12 Pro Max",
        price: 20000000,
        stock: 5,
        image: "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-12-pro-max-1.jpg",
        CategoryId: 2,
        Category: {
            id: 2,
            name: "Electronics"
        }
    },
    {
        id: 3,
        name: "Buku Harry Potter",
        price: 100000,
        stock: 10,
        image: "https://images-na.ssl-images-amazon.com/images/I/51UoqRAxwEL._SX331_BO1,204,203,200_.jpg",
        CategoryId: 3,
        Category: {
            id: 3,
            name: "Books"
        }
    }
]

```

> Lalu rubahlah fungsi `app.get("/")` menjadi seperti berikut :

```javascript
app.get("/", (req, res) => {
  res.render("index", { title: "Home", products });
});
```

7. Menampilkan data produk di halaman index. Sesuaikan kode di file `index.ejs` dengan kode berikut :

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Simple E-Commerce</title>
  </head>

  <body>
    <h1>Simple E-Commerce</h1>
    <h2>Products</h2>
    <ul>
      <% products.forEach(product=> { %>
      <li>
        <img
          src="<%= product.image %>"
          alt="<%= product.name %>"
          width="100px"
        />
        <h3><%= product.name %></h3>
        <p><%= product.price %></p>
        <p><%= product.stock %></p>
        <p><%= product.Category.name %></p>
      </li>
      <% }) %>
    </ul>
  </body>
</html>
```

> Jika sekarang anda menjalankan server, maka akan muncul tampilan seperti berikut :

![ejs](/assets/index-with-dummy-unstyle.png)

### Merapikan struktur folder

Dalam pemorgraman, arsitektur folder sangatlah penting. Dengan arsitektur folder yang baik, kita bisa memudahkan dalam mengelola file dan folder. Selain itu, dengan arsitektur folder yang baik, kita bisa memudahkan dalam melakukan debugging.

Adapun arsitektur yang akan kita gunakan adalah **MVC**. **MVC** adalah singkatan dari **Model View Controller**. **MVC** adalah salah satu arsitektur yang paling banyak digunakan dalam pengembangan aplikasi. **MVC** membagi aplikasi menjadi 3 bagian, yaitu **Model**, **View**, dan **Controller**.

- **Model** adalah bagian yang berfungsi untuk mengatur data. **Model** berfungsi untuk mengatur data yang akan ditampilkan di **View**. **Model** juga berfungsi untuk mengatur data yang akan dikirim ke **Controller**.

- **View** adalah bagian yang berfungsi untuk menampilkan data. **View** berfungsi untuk menampilkan data yang dikirim dari **Model**. **View** juga berfungsi untuk mengirim data ke **Controller**.

- **Controller** adalah bagian yang berfungsi untuk mengatur **Model** dan **View**. **Controller** berfungsi untuk mengatur data yang dikirim dari **Model** ke **View**. **Controller** juga berfungsi untuk mengatur data yang dikirim dari **View** ke **Model**.

Kita sudah memiliki folder `views` dan folder `models`. Sekarang kita akan membuat folder `controllers`. Folder `controllers` digunakan untuk menyimpan file **Controller**. Anda bisa menggunakan perintah terminal `mkdir` untuk membuat folder, dan `touch` untuk membuat file. Jalankan perintah berikut :

```bash
mkdir controllers
touch controllers/index.js
```

Agar lebih rapi lagi, kita juga akan membuat folder routes. Folder `routes` digunakan untuk menyimpan file **Route**. Anda bisa menggunakan perintah terminal `mkdir` untuk membuat folder, dan `touch` untuk membuat file. Jalankan perintah berikut :

```bash
mkdir routes
touch routes/index.js
```

1. Membaut class **Controller**. Sesuaikan kode di file `controllers/index.js` dengan kode berikut :

```javascript
class Controller {
  static index(req, res) {
    res.render("index", { title: "Home", products });
  }
}

module.exports = Controller;
```

> Pindahkan juga const products dari file `index.js` ke file `controllers/index.js`.

2. Membuat **Route**. Sesuaikan kode di file `routes/index.js` dengan kode berikut :

```javascript
const express = require("express");
const router = express.Router();
const Controller = require("../controllers/index");

router.get("/", Controller.index);

module.exports = router;
```

Sesuaikan juga kode di file `index.js` dengan kode berikut :

```javascript
const express = require("express");
const port = 3000;
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

const route = require("./routes/index");

app.use("/", route);

app.listen(port, () => {
  console.log(`Ecommerce app listening at http://localhost:${port}`);
});
```

> Kita menambhakan `app.use("/", route);` untuk mengarahkan route ke file `routes/index.js`. `app.use(express.urlencoded({ extended: true }));` digunakan untuk mengatur data yang dikirim dari **View** ke **Controller**.

> Anda bisa menghapus kode `const products = [...]` di file `index.js`.

> Saat dijalankan, maka tampilan view index masih akan sama seperti sebelumya, namun secara kode, file dan folder kita lebih tertata rapi.

### Mempercantik tampilan halaman dengan Bootstrap

**Bootstrap** adalah salah satu framework CSS yang paling banyak digunakan. **Bootstrap** menyediakan banyak komponen yang bisa kita gunakan untuk mempercantik tampilan aplikasi. Anda bisa mengunjungi [https://getbootstrap.com/](https://getbootstrap.com/) untuk melihat dokumentasi **Bootstrap**. Anda bisa menggunakan **Bootstrap** dengan 2 cara, yaitu dengan menggunakan CDN, atau dengan menginstall **Bootstrap** di aplikasi kita.

Dalam project ini kita akan menggunakan **Bootstrap** dengan menggunakan CDN. Kita akan menjadikan views lebih modular, dengan memisahkan setiap komponen ke file yang berbeda, sehingga kode kita bisa lebih DRY. Buat file `views/partials/header.ejs`,`views/partials/navbar.ejs` dan `views/partials/footer.ejs`. Sesuaikan kode di file `views/index.ejs` dengan kode berikut :

Isi file `views/partials/header.ejs` dengan kode berikut :

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Ecommerce</title>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9"
      crossorigin="anonymous"
    />
  </head>
  <body></body>
</html>
```

Isi file `views/partials/navbar.ejs` dengan kode berikut :

```html
<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">E-Commerce</a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Homepage</a>
        </li>
      </ul>
      <form class="d-flex">
        <button class="btn btn-outline-success">Add New Product</button>
      </form>
    </div>
  </div>
</nav>
```

Isi file `views/partials/footer.ejs` dengan kode berikut :

```html
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm"
      crossorigin="anonymous"
    ></script>
  </body>
</html>
```

Isi file `views/index.ejs` dengan kode berikut :

```html
<%- include('./partials/header') %> <%- include('./partials/navbar') %>
<div class="container mt-4 mb-4">
  <div class="row col-md-6 mx-auto">
    <table class="table">
      <thead>
        <th>Image</th>
        <th>Product Detail</th>
        <th>Action</th>
      </thead>
      <tbody>
        <% products.forEach(instance=> { %>
        <tr>
          <td>
            <img
              src="<%= instance.image %>"
              alt=""
              width="100px"
              height="100px"
            />
          </td>
          <td>
            <%= instance.name %>
            <br />
            Rp. <%= instance.price.toLocaleString("id-ID") %>
            <br />
            <%= instance.Category.name %>
            <br />
            <%= instance.stock %>
          </td>
          <td>
            <a class="btn btn-danger" href="/"
              ><i class="bi bi-trash"></i> Buy
            </a>
          </td>
        </tr>
        <% }) %>
      </tbody>
    </table>
  </div>
</div>
<%- include('./partials/footer') %>
```

Kita juga akan membuat formulir untuk menambahkan data produk. Buat file `views/add-product.ejs` dan isi dengan kode berikut :

```html
<%- include('./partials/header') %> <%- include('./partials/navbar') %>
<div class="container mt-4 mb-4">
  <div class="row">
    <div class="col-md-6 mx-auto">
      <form action="/add-product" method="post">
        <div class="mb-3">
          <label class="form-label">Name Product :</label>
          <input
            name="name"
            type="text"
            class="form-control"
            placeholder="input Name Product here"
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Product Category:</label>
          <input
            name="category"
            type="text"
            class="form-control"
            placeholder="input Name Category here"
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Price :</label>
          <input
            name="price"
            type="number"
            class="form-control"
            placeholder="input Price here"
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Stock :</label>
          <input
            name="stock"
            type="number"
            class="form-control"
            placeholder="input Stock here"
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Image URL :</label>
          <input
            name="image"
            type="text"
            class="form-control"
            placeholder="input Image URL here"
          />
        </div>
        <div class="mt-3">
          <button class="btn btn-success col-sm-12" type="submit">
            Create New Product
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
<%- include('./partials/footer') %>
```

### Membuat Controller Untuk Add Product

Masuklah kedalam folder `controller`, lalu editlah file `index.js` sebagai berikut :

1. Mengimport model `Product` dan `Category` dari folder `models`

```js
const { Category, Product } = require("../models");
```

2. Membuat static baru untuk menampilkan halaman add product

```js
    static add(req, res) {
        res.render("add");
    }
```

3. Membuat route baru untuk menampilkan halaman formulir add

```js
router.get("/add-product", Controller.add);
```

4. Membuat static baru untuk menambahkan data product

```js
    static async addProduct(req, res) {
    try {
      const { name, price, stock, image, category } = req.body;

      if (stock <= 0) {
        throw new Error("Stock must be greater than 0");
      }

      if (stock > 100) {
        throw new Error("Stock must be less than 100");
      }

      if (price <= 100) {
        throw new Error("Price must be greater than 100");
      }

      const [CategoryProduct] = await Category.findOrCreate({
        where: {
          name: category,
        },
      });

      await Product.create({
        name,
        price,
        stock,
        image,
        CategoryId: CategoryProduct.id,
      });

      res.redirect("/?success=Product has been added");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((err) => err.message);
        res.redirect("/add-product?errors=" + errors.join(", "));
      } else {
        res.redirect("/add-product?errors=" + error.message);
      }
    }
  }
```

> kita menambahkan findOrCreate untuk mencari data category yang sudah ada, jika tidak ada maka akan dibuatkan category baru.

> kita juga menambahkan validasi untuk stock dan price

> jika sudah selesai akan di redirect ke halaman utama dengan menambahkan query string `?success=Product has been added` untuk menampilkan pesan sukses

5. Membuat route baru untuk menambahkan data product

```js
router.post("/add-product", Controller.addProduct);
```

6. Membuat static untuk proses pembelian dan pengurangan stock

```js
  static async edit(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);

      if (!product) {
        throw new Error("Product not found");
      }

      if (product.stock <= 0) {
        throw new Error("Product is out of stock");
      }

      const newStock = product.stock - 1;

      await Product.update({ stock: newStock }, { where: { id } });

      res.redirect("/?success=Product has been bought");
    } catch (error) {
      res.redirect("/?errors=" + error.message);
    }
  }
```

> kita mengurangi stock dengan cara mengupdate data product dengan stock yang baru

> Validasi kalaupun stock sudah habis

7. Membuat route baru untuk proses pembelian dan pengurangan stock

```js
router.get("/buy/:id", Controller.edit);
```

8. Sekarang kita akan merubah sedikit controller untuk index, kita akan langsung menggunakan async await

> const products = [....] sebelumnya bisa kita hapus

```js
  static async index(req, res) {
    try {
      const products = await Product.findAll({
        include: Category,
        where: {
          stock: {
            [Op.gt]: 0,
          },
        },
        order: [["id", "ASC"]],
      });
      res.render("index", { products });
    } catch (error) {
      res.redirect("/?errors=" + error.message);
    }
  }
```

> kita menggunakan findAll untuk mengambil semua data product

> Include digunakan untuk mengambil data category yang terhubung dengan product

> where digunakan untuk mengambil data product yang stocknya lebih dari 0

> order digunakan untuk mengurutkan data product berdasarkan id secara ascending

### Membuat EJS dan handle data yang dikirim dari controller

Untuk alert kita bisa menggunakan komponen di bootstrap, kita akan membuat file `partials/alert.ejs` sebagai berikut :

```html
<div class="alert alert-<%= type %> alert-dismissible fade show" role="alert">
  <strong><%= title %></strong> <%= message %>
  <button
    type="button"
    class="btn-close"
    data-bs-dismiss="alert"
    aria-label="Close"
  ></button>
</div>
```

di file controller, kita juga akan menambahkan req.query sehingga **EJS** bisa membaca query string yang dikirim dari controller, isi file controller seharusnya saat ini adalah sebagai berikut :

```js
const { Op } = require("sequelize");
const { Category, Product } = require("../models");

class Controller {
  static async index(req, res) {
    try {
      const { errors, success } = req.query;
      const products = await Product.findAll({
        include: Category,
        where: {
          stock: {
            [Op.gt]: 0,
          },
        },
        order: [["id", "ASC"]],
      });
      res.render("index", { products, errors, success });
    } catch (error) {
      res.redirect("/?errors=" + error.message);
    }
  }

  static add(req, res) {
    try {
      const { errors } = req.query;
      res.render("add", { errors });
    } catch (error) {
      res.render("add");
    }
  }

  static async addProduct(req, res) {
    try {
      const { name, price, stock, image, category } = req.body;

      if (stock <= 0) {
        throw new Error("Stock must be greater than 0");
      }

      if (stock > 100) {
        throw new Error("Stock must be less than 100");
      }

      if (price <= 100) {
        throw new Error("Price must be greater than 100");
      }

      const [CategoryProduct] = await Category.findOrCreate({
        where: {
          name: category,
        },
      });

      await Product.create({
        name,
        price,
        stock,
        image,
        CategoryId: CategoryProduct.id,
      });

      res.redirect("/?success=Product has been added");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((err) => err.message);
        res.redirect("/add-product?errors=" + errors.join(", "));
      } else {
        res.redirect("/add-product?errors=" + error.message);
      }
    }
  }

  static async edit(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);

      if (!product) {
        throw new Error("Product not found");
      }

      if (product.stock <= 0) {
        throw new Error("Product is out of stock");
      }

      const newStock = product.stock - 1;

      await Product.update({ stock: newStock }, { where: { id } });

      res.redirect("/?success=Product has been bought");
    } catch (error) {
      res.redirect("/?errors=" + error.message);
    }
  }
}

module.exports = Controller;
```

Lalu di file route juga akan ada route sebagai berikut

```js
const express = require("express");
const router = express.Router();
const Controller = require("../controllers/index");

router.get("/", Controller.index);
router.get("/add-product", Controller.add);
router.post("/add-product", Controller.addProduct);
router.get("/buy/:id", Controller.edit);

module.exports = router;
```

Di index.ejs sebagai berikut

```html
<%- include('./partials/header') %> <%- include('./partials/navbar') %>

<div class="container mt-4 mb-4">
  <div class="row col-md-6 mx-auto">
    <% if (typeof errors !== 'undefined' && errors) { %> <%
    errors.split(',').forEach(error => { %> <%- include('./partials/alert', {
    type: 'danger', title: 'Error!', message: error }) %> <% }) %> <% } %> <% if
    (typeof success !== 'undefined' && success) { %> <%-
    include('./partials/alert', { type: 'success', title: 'Success!', message:
    success }) %> <% } %>

    <table class="table">
      <thead>
        <th>Image</th>
        <th>Product Detail</th>
        <th>Action</th>
      </thead>
      <tbody>
        <% products.forEach(item=> { %>
        <tr>
          <td>
            <img src="<%= item.image %>" alt="" width="100px" height="100px" />
          </td>
          <td>
            <table>
              <tr>
                <td>Product Name</td>
                <td>: <%= item.name %></td>
              </tr>
              <tr>
                <td>Price</td>
                <td>: Rp. <%= item.price.toLocaleString("id-ID") %></td>
              </tr>
              <tr>
                <td>Category</td>
                <td>: <%= item.Category.name %></td>
              </tr>
              <tr>
                <td>Stock</td>
                <td>: <%= item.stock %></td>
              </tr>
            </table>
          </td>
          <td>
            <a class="btn btn-danger" href="/buy/<%= item.id %>"
              ><i class="bi bi-trash"></i> Buy Product
            </a>
          </td>
        </tr>
        <% }) %>
      </tbody>
    </table>
  </div>
</div>
<%- include('./partials/footer') %>
```

di Add.ejs sebagai berikut

```html
<%- include('./partials/header') %> <%- include('./partials/navbar') %>
<div class="container mt-4 mb-4">
  <div class="row">
    <div class="col-md-6 mx-auto">
      <% if (typeof errors !== 'undefined' && errors) { %> <%
      errors.split(',').forEach(error => { %> <%- include('./partials/alert', {
      type: 'danger', title: 'Error!', message: error }) %> <% }) %> <% } %>

      <form action="/add-product" method="post">
        <div class="mb-3">
          <label class="form-label">Name Product :</label>
          <input
            name="name"
            type="text"
            class="form-control"
            placeholder="input Name Product here"
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Product Category:</label>
          <input
            name="category"
            type="text"
            class="form-control"
            placeholder="input Name Category here"
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Price :</label>
          <input
            name="price"
            type="number"
            class="form-control"
            placeholder="input Price here"
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Stock :</label>
          <input
            name="stock"
            type="number"
            class="form-control"
            placeholder="input Stock here"
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Image URL :</label>
          <input
            name="image"
            type="text"
            class="form-control"
            placeholder="input Image URL here"
          />
        </div>
        <div class="mt-3">
          <button class="btn btn-success col-sm-12" type="submit">
            Create New Product
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
<%- include('./partials/footer') %>
```

Sedang index.js sebagai berikut

```js
const express = require("express");
const port = 3000;
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

const route = require("./routes/index");

app.use("/", route);

app.listen(port, () => {
  console.log(`Ecommerce app listening at http://localhost:${port}`);
});
```

## Penutup

Selamat, Anda sudah berhasil membuat aplikasi ecommerce sederhana dengan menggunakan express dan sequelize. Selamat mencoba.
