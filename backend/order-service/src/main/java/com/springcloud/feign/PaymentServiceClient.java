package com.springcloud.feign;

import com.springcloud.dto.EscrowRefundRequest;
import com.springcloud.dto.EscrowReleaseRequest;
import com.springcloud.dto.PaymentInitiationRequest;
import com.springcloud.dto.PayHerePaymentResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "payment-service")
public interface PaymentServiceClient {
    @PostMapping("/api/payment/refund-escrow")
    void refundEscrow(@RequestBody EscrowRefundRequest request);
    
    @PostMapping("/api/payment/release-escrow")
    void releaseEscrow(@RequestBody EscrowReleaseRequest request);
    
    @PostMapping("/api/payment/payhere/initiate")
    PayHerePaymentResponse initiatePayment(@RequestBody PaymentInitiationRequest request);

    @GetMapping("/api/payment/status/{reference}")
    ResponseEntity<String> getPaymentStatusByReference(@PathVariable("reference") String reference);
}
