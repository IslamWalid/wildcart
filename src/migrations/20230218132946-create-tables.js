module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM,
        values: ['customer', 'seller'],
        defaultValue: 'customer'
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });

    await queryInterface.createTable('customers', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      }
    });

    await queryInterface.createTable('sellers', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      shop_name: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });

    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      seller_id: {
        type: Sequelize.UUID,
        references: {
          model: 'sellers',
          key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      brand: {
        type: Sequelize.STRING,
        allowNull: false
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      image_url: {
        type: Sequelize.STRING
      }
    });

    await queryInterface.createTable('categories', {
      name: {
        type: Sequelize.STRING,
        primaryKey: true
      }
    });

    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      customer_id: {
        type: Sequelize.UUID,
        references: {
          model: 'customers',
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      product_id: {
        type: Sequelize.UUID,
        references: {
          model: 'products',
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM,
        values: ['pending', 'shipped', 'arrived'],
        defaultValue: 'pending'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      unit_price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      total_price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      order_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      arrival_date: {
        type: Sequelize.DATE
      }
    });

    await queryInterface.createTable('reviews', {
      customer_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: 'customers',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      product_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: 'products',
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      rate: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
      },
      comment: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.createTable('products_categories', {
      product_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: 'products',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      category_name: {
        type: Sequelize.STRING,
        primaryKey: true,
        references: {
          model: 'categories',
          key: 'name'
        },
        onDelete: 'CASCADE'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users', { cascade: true });
    await queryInterface.dropTable('customers', { cascade: true });
    await queryInterface.dropTable('sellers', { cascade: true });
    await queryInterface.dropTable('products', { cascade: true });
    await queryInterface.dropTable('categories', { cascade: true });
    await queryInterface.dropTable('orders', { cascade: true });
    await queryInterface.dropTable('reviews', { cascade: true });
    await queryInterface.dropTable('products_categories', { cascade: true });
  }
};
