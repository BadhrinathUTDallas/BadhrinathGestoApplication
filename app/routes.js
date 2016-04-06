var Food = require('./models/food');
var Order = require('./models/order');

function getFoods(res) {
  Food.find(function(err, foods) {

    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) {
      res.status(422).send(err).sendStatus(422);
    }

    res.json(foods); // return all foods in JSON format
  });
};

function getFood(food_id, res) {
  Food.find({ _id: food_id }).exec(function(err, food) {
    if(err) {
      res.status(422).send(err);
    }

    res.json(food);

  })
};

function getTotal(res) {
  Food.find(function(err, foods) {

    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) {
      res.status(422).send(err);
    }

    var total = 0;
    foods.forEach(function(food) {
      total += food.price;
    });

    total = total * 1.075;

    res.json(total);
  });
};

function getOrders(res) {

  Order.find({}).populate('foods').exec(function(err, orders) {
    if(err) {
      res.status(422).send(err);
    }

    res.json(orders);

  });
};

function getOrder(order_id, res) {
  Order.find({ _id: order_id }).populate('foods').exec(function(err, order) {
    if(err) {
      res.status(422).send(err);
    }

    res.json(order);
  });
};

function createOrder(req, res) {
  Order.create({
    total_cost: req.body.total_cost,
    foods: req.body.foods
  }, function(err, order) {
    if(err) {
      res.status(422).send(err);
    }
    console.log(order);
    res.sendStatus(200);

  });
};

module.exports = function(app) {

  // api ---------------------------------------------------------------------
  // get all foods
  app.get('/api/food', function(req, res) {
    // use mongoose to get all foods in the database
    getFoods(res);
  });

  app.get('/api/total', function(req, res) {
    getTotal(res);
  });

  // create food and send back all foods after creation
  app.post('/api/food', function(req, res) {

    // create a food, information comes from AJAX request from Angular
    Food.create({
      name: req.body.name,
      price: req.body.price,
      done: false
    }, function(err, food) {
      if (err)
        res.status(422).send(err);

      // get and return all the foods after you create another
      res.send(food);
    });

  });

  // delete a food
  app.delete('/api/food/:food_id', function(req, res) {
    Food.remove({
      _id: req.params.food_id
    }, function(err, food) {
      if (err) {
        res.status(422).send(err);
      }
      res.sendStatus(200);
    });
  });

  app.get('/api/orders', function(req, res) {
    getOrders(res);
  });

  app.get('/api/order/:order_id', function(req, res) {
    getOrder(req.params.order_id, res);
  });

  app.post('/api/orders', function(req, res) {
    createOrder(req, res);
  });

  app.get('/api/food/:food_id', function(req, res) {
    getFood(req.params.food_id, res);
  });

  // application -------------------------------------------------------------
  app.get('*', function(req, res) {
    res.redirect('/');
  });
};
