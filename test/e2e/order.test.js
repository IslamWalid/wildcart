describe('order endpoints', () => {
  describe('get orders', () => {
    it.todo('should return customer orders with status code 200');
    it.todo('should return seller requested orders with status code 200');
    it.todo('should return status code 401 for not loggedin user');
  });

  describe('patch order', () => {
    it.todo('should make seller change order status with code status 200');
    it.todo('should return status code 401 for unauthorized seller');
    it.todo('should return status code 404 for order non-exist or does not belong to the authorized seller');
  });

  describe('post order', () => {
    it.todo('should create product for customer with status code 201');
    it.todo('should return status code 401 for unauthorized customer');
    it.todo('should return status code 409 for order quantity greater than the available');
  });

  describe('delete order', () => {
    it.todo('should delete order in unpaid or pending status with status code 200');
    it.todo('should return error with status code 401 for unauthorized customer');
    it.todo('should refuse to delete order in pending status with status code 409');
  });
});
