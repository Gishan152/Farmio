package com.springcloud.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableRabbit
public class RabbitMQConfig {
    
    public static final String PAYMENT_EXCHANGE = "payment.exchange";
    public static final String PAYMENT_CONFIRMED_QUEUE = "payment.confirmed.queue";
    public static final String PAYMENT_CONFIRMED_ROUTING_KEY = "payment.confirmed";
    
    @Bean
    public TopicExchange paymentExchange() {
        return new TopicExchange(PAYMENT_EXCHANGE);
    }
    
    @Bean
    public Queue paymentConfirmedQueue() {
        return new Queue(PAYMENT_CONFIRMED_QUEUE, true);
    }
    
    @Bean
    public Binding paymentConfirmedBinding() {
        return BindingBuilder
                .bind(paymentConfirmedQueue())
                .to(paymentExchange())
                .with(PAYMENT_CONFIRMED_ROUTING_KEY);
    }
    
    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }
    
    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
            ConnectionFactory connectionFactory) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(messageConverter());
        return factory;
    }
}