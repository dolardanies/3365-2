

var OrdersControllerModule = (function () {

    var selectedOrder;
    var selectedOrderId;

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
        var longitud = Object.keys(selectedOrder[selectedOrderId].orderAmountsMap).length;
        selectedOrder[selectedOrderId].orderAmountsMap = {};
        for (var k = 0; k < longitud; k++) {
            if (Object.keys(selectedOrder[selectedOrderId].orderAmountsMap).includes($('#dish' + k).val())) {
                selectedOrder[selectedOrderId].orderAmountsMap[$('#dish' + k).val()] += parseInt($('#quantity' + k).val());
            } else {
                selectedOrder[selectedOrderId].orderAmountsMap[$('#dish' + k).val()] = parseInt($('#quantity' + k).val());
            }
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
        RestControllerModule.updateOrder(selectedOrder[selectedOrderId], callback);
    };

    var deleteOrderItem = function (itemName) {
        delete selectedOrder[selectedOrderId].orderAmountsMap[itemName];
        var callback = {
            onSuccess: function () {
                showSelectedOrder();
            },
            onFailed: function (reason) {
                console.log(reason);
                errorMessage();
            }
        }
        RestControllerModule.updateOrder(selectedOrder[selectedOrderId], callback);
    };

    var addItemToOrder = function (orderId, item) {
        var name = item[0];
        var quantity = item[1];
        if (Object.keys(selectedOrder[orderId].orderAmountsMap).includes(name)) {
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
                var isTheFirst = true;
                for (order in ordersList) {
                    if (isTheFirst) {
                        $("#orders").append("<option value='" + order + "' selected='selected'>Table " + order);
                        isTheFirst = false;
                    } else {
                        $("#orders").append("<option value='" + order + "'>Table " + order);
                    }
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
                selectedOrderId = selected;
                $("#actualOrder").empty();
                $("#actualOrder").append("<thead> <tr>  <th scope='col'>Item</th> <th scope='col'>Quantity</th> <th scope='col'></th> <th scope='col'></th>  </tr> </thead>");
                var cont = 0;
                for (dish in order[selected].orderAmountsMap) {
                    $("#actualOrder").append("<tbody> <tr> <td> <input id='dish" + cont + "' type='text' value='" + dish + "'></td> <td> <input id='quantity" + cont + "' type='text' value='" + order[selected].orderAmountsMap[dish] + "'> </td> <td><button type='button' class='btn' onclick='OrdersControllerModule.updateOrder()'>Update</button></td> <td><button id='button" + cont + "' type='button' class='btn'>Delete</button></td></tr> </tbody>");
                    document.getElementById("button" + cont).setAttribute("onClick", "OrdersControllerModule.deleteOrderItem('" + $('#dish' + cont).val() + "');");
                    cont++;
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
