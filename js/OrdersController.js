var OrdersControllerModule = (function () {

  var showOrdersByTable = function () {
    //Todo implement

    var callback = {

        onSuccess: function(ordersList){
            //Todo implement

            },
        onFailed: function(exception){
        //Todo implement
        }
    }
    //RestaurantRestController.getOrders(callback)
  };

  var updateOrder = function () {
    // todo implement
  };

  var deleteOrderItem = function (itemName) {
    // todo implement
  };

  var addItemToOrder = function (orderId, item) {
    // todo implement
  };

  return {
    showOrdersByTable: showOrdersByTable,
    updateOrder: updateOrder,
    deleteOrderItem: deleteOrderItem,
    addItemToOrder: addItemToOrder
  };

})();