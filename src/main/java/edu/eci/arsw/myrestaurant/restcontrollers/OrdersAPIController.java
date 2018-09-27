/*
 * Copyright (C) 2016 Pivotal Software, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package edu.eci.arsw.myrestaurant.restcontrollers;

import edu.eci.arsw.myrestaurant.model.Order;
import edu.eci.arsw.myrestaurant.services.OrderServicesException;
import edu.eci.arsw.myrestaurant.services.RestaurantOrderServices;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;

/**
 *
 * @author hcadavid
 */
@RestController
@RequestMapping(value = "/orders")
@Service
public class OrdersAPIController {

    @Autowired
    RestaurantOrderServices services;

    Gson g = new Gson();

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<?> getOrders() {
        Map<String, Order> listaord = new HashMap<>();
        Set<Integer> two = services.getTablesWithOrders();
        two.forEach((i) -> {
            try {
                listaord.put(Integer.toString(i), services.getTableOrder(i));
            } catch (OrderServicesException ex) {
                Logger.getLogger(OrdersAPIController.class.getName()).log(Level.SEVERE, null, ex);
            }
        });
        String listord_json = g.toJson(listaord);
        return new ResponseEntity<>(listord_json, HttpStatus.OK);

    }

    @RequestMapping(method = RequestMethod.GET, path = "/{idTable}")
    public ResponseEntity<?> getOrder(@PathVariable String idTable) {
        try {
            Map<String, Order> listaord = new HashMap<>();

            listaord.put(idTable, services.getTableOrder(Integer.parseInt(idTable)));
            String listaord_json = g.toJson(listaord);
            return new ResponseEntity<>(listaord_json, HttpStatus.OK);
        } catch (OrderServicesException e) {
            Logger.getLogger(OrdersAPIController.class.getName()).log(Level.SEVERE, null, e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<?> postOrders(@RequestBody String jsonOrder) {

        try {
            Type listType = new TypeToken<Map<String, Order>>() {
            }.getType();
            Map<String, Order> listaord = g.fromJson(jsonOrder, listType);
            Set<String> keys = listaord.keySet();
            for (String s : keys) {

                services.addNewOrderToTable(listaord.get(s));
            }
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (OrderServicesException e) {
            Logger.getLogger(OrdersAPIController.class.getName()).log(Level.SEVERE, null, e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.METHOD_NOT_ALLOWED);
        }
    }

    @RequestMapping(method = RequestMethod.GET, path = "/{idTable}/total")
    public ResponseEntity<?> getTotalTableBill(@PathVariable String idTable) {
        try {
            return new ResponseEntity<>(services.calculateTableBill(Integer.parseInt(idTable)), HttpStatus.OK);
        } catch (OrderServicesException ex) {
            Logger.getLogger(OrdersAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @RequestMapping(method = RequestMethod.PUT, path = "{idTable}")
    public ResponseEntity<?> updateOrder(@PathVariable String idTable, @RequestBody String plato) {
        Type listType = new TypeToken<Map<String, String>>() {}.getType();
        Map<String, String> listaord = g.fromJson(plato, listType);
        for (String key : listaord.keySet()) {
            try {
                services.getTableOrder(Integer.parseInt(idTable)).addDish(key, Integer.parseInt(listaord.get(key)));
            } catch (OrderServicesException ex) {
                Logger.getLogger(OrdersAPIController.class.getName()).log(Level.SEVERE, null, ex);
                    return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
            }
        }
        return new ResponseEntity<>(HttpStatus.OK);

    }
    @RequestMapping(method = RequestMethod.DELETE, path = "{idTable}")
    public ResponseEntity<?> deleteOrder(@PathVariable String idTable){
        try {
            services.releaseTable(Integer.parseInt(idTable));
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (OrderServicesException ex) {
            Logger.getLogger(OrdersAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    

}
