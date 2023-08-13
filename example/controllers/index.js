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
