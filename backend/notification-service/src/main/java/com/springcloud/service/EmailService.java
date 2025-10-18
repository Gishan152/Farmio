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
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Autowired
    private TemplateEngine templateEngine;
    
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
     * Send HTML email using Thymeleaf template
     */
    public void sendHtmlEmail(String to, String subject, String templateName, Map<String, Object> variables) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            
            // Process template with Thymeleaf
            Context context = new Context();
            if (variables != null) {
                context.setVariables(variables);
            }
            
            // Default template is general-notification
            String template = templateName != null && !templateName.isEmpty() 
                ? templateName 
                : "general-notification";
            
            String htmlContent = templateEngine.process(template, context);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            log.info("HTML email sent successfully to: {} using template: {}", to, template);
            
        } catch (MessagingException | MailException e) {
            log.error("Failed to send HTML email to: {}", to, e);
            // Fallback to logging for development/testing
            log.info("HTML EMAIL FALLBACK - To: {}, Subject: {}, Template: {}, Variables: {}", 
                    to, subject, templateName, variables);
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