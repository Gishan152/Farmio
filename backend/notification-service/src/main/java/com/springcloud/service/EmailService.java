package com.springcloud.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.from:noreply@farmio.com}")
    private String fromEmail;
    
    /**
     * Send simple text email
     */
    public void sendSimpleEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            
            mailSender.send(message);
            log.info("Email sent successfully to: {}", to);
            
        } catch (MailException e) {
            log.error("Failed to send email to: {}", to, e);
            // Fallback to logging for development/testing
            log.info("EMAIL FALLBACK - To: {}, Subject: {}, Body: {}", to, subject, text);
        }
    }
    
    /**
     * Send HTML email using template
     */
    public void sendHtmlEmail(String to, String subject, String templateName, Map<String, Object> variables) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            
            // Simple template processing - replace variables in template
            String htmlContent = processTemplate(templateName, variables);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            log.info("HTML email sent successfully to: {}", to);
            
        } catch (MessagingException | MailException e) {
            log.error("Failed to send HTML email to: {}", to, e);
            // Fallback to logging for development/testing
            log.info("HTML EMAIL FALLBACK - To: {}, Subject: {}, Template: {}, Variables: {}", 
                    to, subject, templateName, variables);
        }
    }
    
    private String processTemplate(String templateName, Map<String, Object> variables) {
        // Simple template processing - in a real system you'd use Thymeleaf or similar
        String template = getTemplateContent(templateName);
        
        if (variables != null) {
            for (Map.Entry<String, Object> entry : variables.entrySet()) {
                String placeholder = "{{" + entry.getKey() + "}}";
                template = template.replace(placeholder, String.valueOf(entry.getValue()));
            }
        }
        
        return template;
    }
    
    private String getTemplateContent(String templateName) {
        // Basic email templates - in production, these would be external template files
        switch (templateName) {
            case "order_confirmation":
                return "<html><body><h2>Order Confirmation</h2><p>Dear {{userName}},</p><p>Your order #{{orderId}} has been confirmed.</p><p>Thank you for using Farmio!</p></body></html>";
            case "payment_success":
                return "<html><body><h2>Payment Successful</h2><p>Dear {{userName}},</p><p>Your payment of ${{amount}} has been processed successfully.</p><p>Thank you for your business!</p></body></html>";
            case "new_message":
                return "<html><body><h2>New Message</h2><p>Dear {{userName}},</p><p>You have received a new message: {{message}}</p><p>Login to Farmio to view details.</p></body></html>";
            default:
                return "<html><body><h2>Notification</h2><p>Dear {{userName}},</p><p>{{message}}</p><p>Best regards,<br>Farmio Team</p></body></html>";
        }
    }
    
    @Async("emailTaskExecutor")
    public CompletableFuture<Boolean> sendEmailAsync(String to, String subject, String templateName, 
                                                    Map<String, Object> variables) {
        try {
            if (templateName != null && !templateName.isEmpty()) {
                sendHtmlEmail(to, subject, templateName, variables);
            } else {
                String message = variables != null ? variables.getOrDefault("message", "").toString() : "";
                sendSimpleEmail(to, subject, message);
            }
            return CompletableFuture.completedFuture(true);
        } catch (Exception e) {
            log.error("Async email sending failed for: {}", to, e);
            return CompletableFuture.completedFuture(false);
        }
    }
    
    @Async("emailTaskExecutor")
    public CompletableFuture<Boolean> sendSimpleEmailAsync(String to, String subject, String text) {
        try {
            sendSimpleEmail(to, subject, text);
            return CompletableFuture.completedFuture(true);
        } catch (Exception e) {
            log.error("Async simple email sending failed for: {}", to, e);
            return CompletableFuture.completedFuture(false);
        }
    }
}