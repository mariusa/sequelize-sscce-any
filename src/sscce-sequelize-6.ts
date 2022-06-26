import { DataTypes, Model } from 'sequelize';
import { createSequelize6Instance } from '../setup/create-sequelize-instance';
import { expect } from 'chai';
import sinon from 'sinon';

// if your issue is dialect specific, remove the dialects you don't need to test on.
export const testingOnDialects = new Set(['postgres']);

// You can delete this file if you don't want your SSCCE to be tested against Sequelize 6

// Your SSCCE goes inside this function.
export async function run() {
  // This function should be used instead of `new Sequelize()`.
  // It applies the config for your SSCCE to work on CI.
  const sequelize = createSequelize6Instance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      // For less clutter in the SSCCE
      timestamps: false,
    },
  });

  class Foo extends Model {}

  Foo.init({
    name: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Foo',
  });

  // You can use sinon and chai assertions directly in your SSCCE.
  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync({ force: true });
  expect(spy).to.have.been.called;

  console.log(await Foo.create({ name: 'TS foo' }));
  expect(await Foo.count()).to.equal(1);
  
  class Product extends Model {}

  Product.init({
    id: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    vendor: DataTypes.TEXT
  }, {
    sequelize,
    tableName: 'product',
    modelName: 'Product',
  });
  
  
  console.log(await Product.create({ id: (Math.random() * 10000).toString(), vendor: 'IBM' }));
    console.log('count', await Product.count())
    const products = await sequelize.query("SELECT * FROM product WHERE vendor=ANY(?::text[])", 
    {
    replacements: [ ['IBM', 'Apple'] ]
    }
  );
    console.log('products', products);
    


}
