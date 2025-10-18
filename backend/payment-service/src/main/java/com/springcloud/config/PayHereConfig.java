package com.springcloud.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "payhere")
public class PayHereConfig {
    
    private String merchantId;
    private String merchantSecret;
    private String checkoutUrl;
    private String notifyUrl;
    private boolean sandbox = true;
    
    // Getters and Setters
    public String getMerchantId() {
        return merchantId;
    }
    
    public void setMerchantId(String merchantId) {
        this.merchantId = merchantId;
    }
    
    public String getMerchantSecret() {
        return merchantSecret;
    }
    
    public void setMerchantSecret(String merchantSecret) {
        this.merchantSecret = merchantSecret;
    }
    
    public String getCheckoutUrl() {
        if (sandbox) {
            return "https://sandbox.payhere.lk/pay/checkout";
        }
        return "https://www.payhere.lk/pay/checkout";
    }
    
    public void setCheckoutUrl(String checkoutUrl) {
        this.checkoutUrl = checkoutUrl;
    }
    
    public String getNotifyUrl() {
        return notifyUrl;
    }
    
    public void setNotifyUrl(String notifyUrl) {
        this.notifyUrl = notifyUrl;
    }
    
    public boolean isSandbox() {
        return sandbox;
    }
    
    public void setSandbox(boolean sandbox) {
        this.sandbox = sandbox;
    }
}
