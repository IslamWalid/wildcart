const { Roles, InputTypes } = require('../../../src/utils/enums');
const validateInput = require('../../../src/utils/validate-input');

describe('validate register input', () => {
  it('should pass valid input', () => {
    const input = {
      username: 'john_doe',
      firstName: 'John',
      lastName: 'Doe',
      password: 'StrongPassword123!',
      address: 'some address',
      phone: '+201012345678',
      role: Roles.CUSTOMER
    };
    expect(validateInput(input, InputTypes.REGISTER)).toBeNull();
  });

  it('should pass input with missing fields', () => {
    const input = {
      username: 'john_doe',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+201012345678'
    };
    expect(validateInput(input, InputTypes.REGISTER))
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
      role: Roles.CUSTOMER
    };
    expect(validateInput(input, InputTypes.REGISTER))
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
      role: Roles.CUSTOMER
    };
    expect(validateInput(input, InputTypes.REGISTER))
      .toBe('invalid phone number');
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
    expect(validateInput(input, InputTypes.POST_PRODUCT)).toBeNull();
  });

  it('should pass input with missing fields', () => {
    const input = {
      name: 'T-shirt',
      quantity: 20,
      categories: [
        'clothes',
        'menFashion'
      ]
    };
    expect(validateInput(input, InputTypes.POST_PRODUCT))
      .toBe('required fields are missing');
  });
});

describe('validate patch product input', () => {
  it('should pass input with empty input object', () => {
    const input = {};

    expect(validateInput(input, InputTypes.PATCH_PRODUCT))
      .toBe('provide at least one field');
  });
});

describe('validate post review input', () => {
  it('should pass input with missing fields', () => {
    const input = {};

    expect(validateInput(input, InputTypes.POST_REVIEW))
      .toBe('required fields are missing');
  });
});

describe('validate patch review input', () => {
  it('should pass input with empty input object', () => {
    const input = {};

    expect(validateInput(input, InputTypes.PATCH_REVIEW))
      .toBe('provide at least one field');
  });
});

describe('validate post order input', () => {
  it('should pass input with missing fields', () => {
    const input = {};

    expect(validateInput(input, InputTypes.POST_ORDER))
      .toBe('required fields are missing');
  });
});
