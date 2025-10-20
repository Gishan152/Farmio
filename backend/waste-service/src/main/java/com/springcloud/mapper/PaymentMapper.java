package com.springcloud.mapper;

import com.springcloud.dto.PaymentDTO;
import com.springcloud.model.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public PaymentDTO toDTO(Payment payment) {
        if (payment == null) return null;

        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setWasteListingId(payment.getWasteListingId());
        dto.setRequesterId(payment.getRequesterId());
        dto.setAgentId(payment.getAgentId());
        dto.setQuantity(payment.getQuantity());
        dto.setUnit(payment.getUnit());
        dto.setPricePerUnit(payment.getPricePerUnit());
        dto.setGrossAmount(payment.getGrossAmount());
        dto.setStatus(payment.getStatus());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setTransactionRef(payment.getTransactionRef());
        dto.setCreatedAt(payment.getCreatedAt());
        dto.setUpdatedAt(payment.getUpdatedAt());
        return dto;
    }
}
