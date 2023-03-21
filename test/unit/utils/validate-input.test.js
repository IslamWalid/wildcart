const { validateInput, inputTypes } = require('../../../src/utils/validate-input');

describe('validate register input', () => {
  it('should pass valid input', () => {
    const input = {
      username: 'john_doe',
      firstName: 'John',
      lastName: 'Doe',
      password: 'StrongPassword123!',
      address: 'some address',
      phone: '+201012345678',
      userType: 'customer'
    };
    expect(validateInput(input, inputTypes.REGISTER)).toBeNull();
  });

  it('should pass input with missing fields', () => {
    const input = {
      username: 'john_doe',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+201012345678'
    };
    expect(validateInput(input, inputTypes.REGISTER))
      .toBe('required fields are missing');
  });

  it('should pass input with weak password', () => {
    const input = {
      username: 'john_doe',
      firstName: 'John',
      lastName: 'Doe',
      password: '123',
      address: 'some address',
      phone: '+201012345678',
      userType: 'customer'
    };
    expect(validateInput(input, inputTypes.REGISTER))
      .toBe('weak password');
  });

  it('should pass input with invalid phone number', () => {
    const input = {
      username: 'john_doe',
      firstName: 'John',
      lastName: 'Doe',
      password: 'StrongPassword123!',
      address: 'some address',
      phone: '123',
      userType: 'customer'
    };
    expect(validateInput(input, inputTypes.REGISTER))
      .toBe('invalid phone number');
  });
});

describe('validate login input', () => {
  it('should pass input with missing fields', () => {
    const input = {
      username: 'john_doe'
    };
    expect(validateInput(input, inputTypes.REGISTER))
      .toBe('required fields are missing');
  });
});

describe('validate create product input', () => {
  it('should pass valid input', async () => {
    const input = {
      name: 'T-shirt',
      brand: 'POLO',
      quantity: 20,
      price: 100,
      categories: [
        'clothes',
        'menFashion'
      ]
    };
    expect(validateInput(input, inputTypes.POST_PRODUCT)).toBeNull();
  });

  it('should pass input with missing fields', async () => {
    const input = {
      name: 'T-shirt',
      quantity: 20,
      categories: [
        'clothes',
        'menFashion'
      ]
    };
    expect(validateInput(input, inputTypes.POST_PRODUCT))
      .toBe('required fields are missing');
  });
});
