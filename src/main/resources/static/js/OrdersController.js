orders = undefined;

addOrder = function () {
    var insert = {2: {"orderAmountsMap": {"HOTDOG": 10, "HAMBURGUER": 20, "BEER": 40}, "tableNumber": 2}};
    axios.post('/orders', insert)
            .then(function(){
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
}

/*$(document).ready(
    function(){
        loadOrdersList();
    }
 );
 */
