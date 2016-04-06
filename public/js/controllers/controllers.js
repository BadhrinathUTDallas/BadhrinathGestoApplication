angular.module('foodController', [])

// inject the Food service factory into our controller
.controller('mainController', ['$scope', '$http', '$location', 'Foods', 'Orders', 'alertify',
	function($scope, $http, $location, Foods, Orders, alertify) {
	$scope.formData = {};
	$scope.loading = true;
	$scope.total = 0;
	$scope.orderData = {};
	$scope.foods = [];
	$scope.isActive = function (viewLocation) {
    return viewLocation === $location.path();
	};

	// GET =====================================================================
	// when landing on the page, get all foods and show them
	// use the service to get all the foods
	function updateTotal() {

		$scope.total = 0;

		for(var i = 0; i < $scope.foods.length; i++) {
			$scope.total += $scope.foods[i].price;
		}

		$scope.total = $scope.total * 1.075;
	};

	// CREATE ==================================================================
	// when submitting the add form, send the text to the node API
	$scope.createFood = function() {

		// validate the formData to make sure that something is there
		// if form is empty, nothing will happen
		if ($scope.formData.name != undefined) {
			if ($scope.formData.price == undefined)
				$scope.formData.price = 1;

			$scope.loading = true;

			// call the create function from our service (returns a promise object)
			Foods.create($scope.formData)
			// if successful creation, call our get function to get all the new foods
			.success(function(data, status) {
				var newFood = data;
				alertify.success('Added new item');
				$scope.formData = {}; // clear the form so our user is ready to enter another
				$scope.foods.push(newFood); // assign our new list of foods
				updateTotal();
			})
			.error(function(err, status) {
				alertify.error(err.message);
			});

		}
	};

	// DELETE ==================================================================
	// delete a food after checking it
	$scope.deleteFood = function(id) {
		$scope.loading = true;
		alertify.confirm('Delete item?', function () {
			Foods.delete(id)
				// if successful creation, call our get function to get all the new foods
				.success(function(data) {
					var _removed = data;
					for(var i = 0; i < $scope.foods.length; i++) {
						if($scope.foods[i]._id == id) {
							$scope.foods.splice(i, 1);
							alertify.error('Successfully removed item');
							updateTotal();
						}
					}
				})
				.error(function(err, status) {
					alertify.error(err.message);
				});
		});
	};

	$scope.toggle = function(id) {

	};

	$scope.checkout = function() {
		// create order here
		$scope.orderData.foods = [];
		$scope.orderData.total_cost = $scope.total;

		for(var i = 0; i < $scope.foods.length; i++ ) {
			$scope.orderData.foods.push($scope.foods[i]._id);
		}

		Orders.create($scope.orderData)
		// if successful creation, call our get function to get all the new foods
		.success(function(data) {
			$scope.orderData = {}; // clear the form so our user is ready to enter another
			$scope.foods = []; // assign our new list of foods
			alertify.success('Created your order');
			$location.url('orders');
		})
		.error(function(err, status) {
			alertify.error(err.message);
		});
	}

}]);


angular.module('foodController')
.controller('ordersController', ['$scope', '$http', '$location', 'Orders', 'alertify', function($scope, $http, $location, Orders, alertify) {
	$scope.orders = [];
	$scope.isActive = function (viewLocation) {
    return viewLocation === $location.path();
	};

	Orders.get()
		.success(function(data) {
			$scope.orders = data;
		})
		.error(function(err, status) {
			alertify.error(err.message);
		});
}]);

angular.module('foodController')
.controller('orderController', ['$scope', '$http', '$routeParams', 'Foods', 'Orders', 'alertify', function($scope, $http, $routeParams, Foods,
	Orders, alertify) {
	$scope.order = {};
	$scope.foods = [];

	Orders.getOrder($routeParams.order_id)
		.success(function(data) {
			$scope.order = data;
			$scope.foods = $scope.order[0].foods;
		})
		.error(function(err, status) {
			alertify.error(err.message);
		});
}]);
