package com.springcloud.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableRabbit
public class RabbitMQConfig {
    
    // Exchange names
    public static final String NOTIFICATION_EXCHANGE = "farmio.notification.exchange";
    
    // Queue names
    public static final String ORDER_NOTIFICATION_QUEUE = "farmio.order.notification.queue";
    public static final String PAYMENT_NOTIFICATION_QUEUE = "farmio.payment.notification.queue";
    public static final String TRANSPORT_NOTIFICATION_QUEUE = "farmio.transport.notification.queue";
    public static final String USER_NOTIFICATION_QUEUE = "farmio.user.notification.queue";
    public static final String SYSTEM_NOTIFICATION_QUEUE = "farmio.system.notification.queue";
    
    // Routing keys
    public static final String ORDER_ROUTING_KEY = "notification.order";
    public static final String PAYMENT_ROUTING_KEY = "notification.payment";
    public static final String TRANSPORT_ROUTING_KEY = "notification.transport";
    public static final String USER_ROUTING_KEY = "notification.user";
    public static final String SYSTEM_ROUTING_KEY = "notification.system";
    
    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }
    
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }
    
    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(ConnectionFactory connectionFactory) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(messageConverter());
        return factory;
    }
    
    // Exchange
    @Bean
    public TopicExchange notificationExchange() {
        return new TopicExchange(NOTIFICATION_EXCHANGE, true, false);
    }
    
    // Queues
    @Bean
    public Queue orderNotificationQueue() {
        return QueueBuilder.durable(ORDER_NOTIFICATION_QUEUE).build();
    }
    
    @Bean
    public Queue paymentNotificationQueue() {
        return QueueBuilder.durable(PAYMENT_NOTIFICATION_QUEUE).build();
    }
    
    @Bean
    public Queue transportNotificationQueue() {
        return QueueBuilder.durable(TRANSPORT_NOTIFICATION_QUEUE).build();
    }
    
    @Bean
    public Queue userNotificationQueue() {
        return QueueBuilder.durable(USER_NOTIFICATION_QUEUE).build();
    }
    
    @Bean
    public Queue systemNotificationQueue() {
        return QueueBuilder.durable(SYSTEM_NOTIFICATION_QUEUE).build();
    }
    
    // Bindings
    @Bean
    public Binding orderNotificationBinding() {
        return BindingBuilder
                .bind(orderNotificationQueue())
                .to(notificationExchange())
                .with(ORDER_ROUTING_KEY);
    }
    
    @Bean
    public Binding paymentNotificationBinding() {
        return BindingBuilder
                .bind(paymentNotificationQueue())
                .to(notificationExchange())
                .with(PAYMENT_ROUTING_KEY);
    }
    
    @Bean
    public Binding transportNotificationBinding() {
        return BindingBuilder
                .bind(transportNotificationQueue())
                .to(notificationExchange())
                .with(TRANSPORT_ROUTING_KEY);
    }
    
    @Bean
    public Binding userNotificationBinding() {
        return BindingBuilder
                .bind(userNotificationQueue())
                .to(notificationExchange())
                .with(USER_ROUTING_KEY);
    }
    
    @Bean
    public Binding systemNotificationBinding() {
        return BindingBuilder
                .bind(systemNotificationQueue())
                .to(notificationExchange())
                .with(SYSTEM_ROUTING_KEY);
    }
}