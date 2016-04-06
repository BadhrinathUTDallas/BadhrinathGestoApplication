angular.module('foodService', [])

// super simple service
// each function returns a promise object
.factory('Foods', ['$http', function($http) {
	return {
		get: function() {
			return $http.get('/api/food');
		},
		create: function(foodData) {
			return $http.post('/api/food', foodData);
		},
		delete: function(food_id) {
			return $http.delete('/api/food/' + food_id);
		},
		total: function() {
			return $http.get('/api/total');
		},
		getFood: function(food_id) {
			return $http.get('/api/food/' + food_id);
		}
	}
}])

.factory('Orders', ['$http', function($http) {
	return {
		get: function() {
			return $http.get('/api/orders');
		},
		create: function(foodData) {
			return $http.post('/api/orders', foodData);
		},
		getOrder: function(id) {
			return $http.get('/api/order/' + id);
		}
	}
}]);
