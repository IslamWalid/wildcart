module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
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

    await queryInterface.createTable('customer', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: 'user',
          key: 'id'
        },
        onDelete: 'CASCADE'
      }
    });

    await queryInterface.createTable('seller', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: 'user',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      shop_name: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });

    await queryInterface.createTable('product', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      seller_id: {
        type: Sequelize.UUID,
        references: {
          model: 'seller',
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
      image: {
        type: Sequelize.BLOB
      }
    });

    await queryInterface.createTable('category', {
      name: {
        type: Sequelize.STRING,
        primaryKey: true
      }
    });

    await queryInterface.createTable('order', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      customer_id: {
        type: Sequelize.UUID,
        references: {
          model: 'customer',
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      product_id: {
        type: Sequelize.UUID,
        references: {
          model: 'product',
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

    await queryInterface.createTable('review', {
      customer_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: 'customer',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      product_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: 'product',
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

    await queryInterface.createTable('product_category', {
      product_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: 'product',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      category_name: {
        type: Sequelize.STRING,
        primaryKey: true,
        references: {
          model: 'category',
          key: 'name'
        },
        onDelete: 'CASCADE'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user', { cascade: true });
    await queryInterface.dropTable('customer', { cascade: true });
    await queryInterface.dropTable('seller', { cascade: true });
    await queryInterface.dropTable('product', { cascade: true });
    await queryInterface.dropTable('category', { cascade: true });
    await queryInterface.dropTable('order', { cascade: true });
    await queryInterface.dropTable('review', { cascade: true });
    await queryInterface.dropTable('product_category', { cascade: true });
  }
};
