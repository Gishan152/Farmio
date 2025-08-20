package com.springcloud.util;

import com.springcloud.config.PayHereConfig;
import com.springcloud.dto.PayHerePaymentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PayHereFormGenerator {
    
    @Autowired
    private PayHereConfig payHereConfig;
    
    /**
     * Generate HTML form for PayHere payment
     */
    public String generatePaymentForm(PayHerePaymentRequest request, String hash) {
        StringBuilder form = new StringBuilder();
        
        form.append("<!DOCTYPE html>");
        form.append("<html><head><title>PayHere Payment</title></head><body>");
        form.append("<h3>Redirecting to PayHere...</h3>");
        form.append("<form id='payHereForm' method='post' action='").append(payHereConfig.getCheckoutUrl()).append("'>");
        
        // Required fields
        form.append("<input type='hidden' name='merchant_id' value='").append(payHereConfig.getMerchantId()).append("'>");
        form.append("<input type='hidden' name='return_url' value='").append(request.returnUrl()).append("'>");
        form.append("<input type='hidden' name='cancel_url' value='").append(request.cancelUrl()).append("'>");
        form.append("<input type='hidden' name='notify_url' value='").append(payHereConfig.getNotifyUrl()).append("'>");
        form.append("<input type='hidden' name='order_id' value='").append(request.orderId()).append("'>");
        form.append("<input type='hidden' name='items' value='").append(request.items()).append("'>");
        form.append("<input type='hidden' name='currency' value='").append(request.currency()).append("'>");
        form.append("<input type='hidden' name='amount' value='").append(request.amount()).append("'>");
        form.append("<input type='hidden' name='first_name' value='").append(request.firstName()).append("'>");
        form.append("<input type='hidden' name='last_name' value='").append(request.lastName()).append("'>");
        form.append("<input type='hidden' name='email' value='").append(request.email()).append("'>");
        form.append("<input type='hidden' name='phone' value='").append(request.phone()).append("'>");
        form.append("<input type='hidden' name='address' value='").append(request.address()).append("'>");
        form.append("<input type='hidden' name='city' value='").append(request.city()).append("'>");
        form.append("<input type='hidden' name='country' value='").append(request.country()).append("'>");
        form.append("<input type='hidden' name='hash' value='").append(hash).append("'>");
        
        // Optional fields
        if (request.custom1() != null) {
            form.append("<input type='hidden' name='custom_1' value='").append(request.custom1()).append("'>");
        }
        if (request.custom2() != null) {
            form.append("<input type='hidden' name='custom_2' value='").append(request.custom2()).append("'>");
        }
        
        form.append("<input type='submit' value='Pay Now' style='display:none;'>");
        form.append("</form>");
        
        // Auto-submit form
        form.append("<script>");
        form.append("document.getElementById('payHereForm').submit();");
        form.append("</script>");
        
        form.append("</body></html>");
        
        return form.toString();
    }
}
