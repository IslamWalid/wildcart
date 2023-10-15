describe('review endpoints', () => {
  describe('get product reviews', () => {
    it.todo('should get all reviews on product by product id with status code 200');
    it.todo('should return status code 404 for non-existing product');
  });

  describe('post review', () => {
    it.todo('should create review and return status code 201');
    it.todo('should reject with status code 401 for not logged in customer');
    it.todo('should reject with status code 409 if customer has already reviewed the product');
  });

  describe('patch review', () => {
    it.todo('should update review and return status code 200');
    it.todo('should return status code 401 for not logged in customer');
    it.todo('should return status code 404 for non-existing product');
  });

  describe('delete review', () => {
    it.todo('should delete review with status code 200');
    it.todo('should return status code 401 for not logged in customer');
    it.todo('should return status code 404 for non-existing product');
  });
});
