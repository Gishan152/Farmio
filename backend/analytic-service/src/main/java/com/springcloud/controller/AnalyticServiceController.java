public class AnalyticServiceController {
    

 //get the all orders
 @GetMapping("/orders")
 public ResponseEntity<List<Order>> getAllOrders() {
    List<Order> orders = orderService.getAllOrders();
    return ResponseEntity.ok(orders);
 }
 
    
}
