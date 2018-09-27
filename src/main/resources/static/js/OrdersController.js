/*orders = undefined;
 
 addOrder = function () {
 var insert = {2: {"orderAmountsMap": {"HOTDOG": 10, "HAMBURGUER": 20, "BEER": 40}, "tableNumber": 2}};
 axios.post('/orders', insert)
 .then(function () {
 $("#actualT").append("<p id='tag" + 2 + "'>Orden 2</p>");
 $("#actualT").append("<table id='Order" + 2 + " 'class='table'><thead class='thead - dark'><tr><th scope='col'>PRODUCTO</th><th scope='col'>CANTIDAD</th></tr></thead>");
 for (map in insert[2].orderAmountsMap) {
 $("#Order" + 2).append("<tbody> <tr> <td>" + map + "</td> <td>" + insert[2].orderAmountsMap[map] + "</td> </tr> </tbody>");
 }
 $("#actualT").append("</table>");
 
 })
 .catch(function (error) {
 console.log(error);
 errorMessage();
 });
 }
 
 removeOrderById = function (id) {
 axios.delete('/orders/' + id)
 .then(function () {
 document.getElementById("tag" + id).remove();
 document.getElementById("Order" + id).remove();
 })
 .catch(function (error) {
 console.log(error);
 errorMessage();
 });
 }
 
 loadOrdersList = function () {
 orders = [];
 axios.get('/orders')
 .then(function (result) {
 orders = result.data;
 $("#actualT").empty();
 for (key in orders) {
 $("#actualT").append("<p id='tag" + key + "'>Orden # " + key + "</p>");
 $("#actualT").append("<table id='Order" + key + " 'class='table'><thead class='thead - dark'><tr><th scope='col'>PRODUCTO</th><th scope='col'>CANTIDAD</th></tr></thead>");
 for (map in orders[key].orderAmountsMap) {
 $("#Order" + key).append("<tbody> <tr> <td>" + map + "</td> <td>" + orders[key].orderAmountsMap[map] + "</td> </tr> </tbody>");
 }
 $("#actualT").append("</table>");
 }
 //console.log(orders);
 })
 .catch(function (error) {
 console.log(error);
 errorMessage();
 });
 }
 errorMessage = function () {
 alert("Hay un problema con nuestros servidores. Pedimos disculpas por la inconveniencia, intente de nuevo más tarde");
 }*/

var OrdersControllerModule = (function () {

    var selectedOrder;

    var errorMessage = function () {
        alert("Hay un problema con nuestros servidores. Pedimos disculpas por la inconveniencia, intente de nuevo más tarde");
    }

    var showOrdersByTable = function () {
        var callback = {

            onSuccess: function (ordersList) {
                $("#actualT").empty();
                for (key in ordersList) {
                    $("#actualT").append("<p id='tag" + key + "'>Table # " + key + "</p>");
                    $("#actualT").append("<table id='Table" + key + " 'class='table'><thead class='thead - dark'><tr><th scope='col'>PRODUCTO</th><th scope='col'>CANTIDAD</th></tr></thead>");
                    for (map in ordersList[key].orderAmountsMap) {
                        $("#Table" + key).append("<tbody> <tr> <td>" + map + "</td> <td>" + orders[key].orderAmountsMap[map] + "</td> </tr> </tbody>");
                    }
                    //$("#actualT").append("</table>");
                }

            },
            onFailed: function (exception) {
                console.log(exception);
                errorMessage();
            }
        }
        RestaurantRestController.getOrders(callback)
    };

    var updateOrder = function () {
        var callback = {
            onSuccess: function () {
                showSelectedOrder();
            },
            onFailed: function (reason) {
                console.log(reason);
                errorMessage();
            }
        }
        RestControllerModule.updateOrder(selectedOrder[orderId], callback);
    };

    var deleteOrderItem = function (itemName) {
        // todo implement
    };

    var addItemToOrder = function (orderId, item) {
        var name = item[0];
        var quantity = item[1];
        if(Object.keys(selectedOrder[orderId].orderAmountsMap).includes(name)){
            selectedOrder[orderId].orderAmountsMap[name] += parseInt(quantity);
        } else {
            selectedOrder[orderId].orderAmountsMap[item[0]] = parseInt(item[1]);
        }
        var callback = {
            onSuccess: function () {
                showSelectedOrder();
            },
            onFailed: function (reason) {
                console.log(reason);
                errorMessage();
            }
        }
        RestControllerModule.updateOrder(selectedOrder[orderId], callback);
    };

    var loadSelectOrdersData = function () {
        var callback = {
            onSuccess: function (ordersList) {
                $("#orders").empty();
                for (order in ordersList) {
                    $("#orders").append("<option value='" + order + "'>Table " + order);
                }
            },
            onFailed: function (exception) {
                console.log(exception);
                errorMessage();
            }
        }
        RestControllerModule.getOrders(callback);
    };

    var showSelectedOrder = function () {
        var s = document.getElementById("orders");
        var selected = s.options[s.selectedIndex].value;

        var callback = {
            onSuccess: function (order) {
                selectedOrder = order;
                $("#actualOrder").empty();
                $("#actualOrder").append("<thead> <tr>  <th scope='col'>Item</th> <th scope='col'>Quantity</th> <th scope='col'></th> <th scope='col'></th>  </tr> </thead>");
                for (dish in order[selected].orderAmountsMap) {
                    $("#actualOrder").append("<tbody> <tr> <td> <input id='item' type='text' value='"+dish+"'></td> <td> <input id='item' type='text' value='"+order[selected].orderAmountsMap[dish]+"'> </td> <td><button type='button' class='btn'>Update</button></td> <td><button type='button' class='btn'>Delete</button></td></tr> </tbody>");
                }
            },
            onFailed: function (exception) {
                console.log(exception);
                errorMessage();
            }

             
        }
        RestControllerModule.getOrderById(selected, callback);
    }


    return {
        showOrdersByTable: showOrdersByTable,
        updateOrder: updateOrder,
        deleteOrderItem: deleteOrderItem,
        addItemToOrder: addItemToOrder,
        loadSelectOrdersData: loadSelectOrdersData,
        showSelectedOrder: showSelectedOrder
    };

})();
