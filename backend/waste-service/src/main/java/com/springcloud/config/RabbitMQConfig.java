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

    public static final String WASTE_PAYMENT_EXCHANGE = "waste.payment.exchange";
    public static final String WASTE_PAYMENT_CONFIRMED_QUEUE = "waste.payment.confirmed.queue";
    public static final String WASTE_PAYMENT_CONFIRMED_ROUTING_KEY = "waste.payment.confirmed";

    @Bean
    public TopicExchange wastePaymentExchange() {
        return new TopicExchange(WASTE_PAYMENT_EXCHANGE);
    }

    @Bean
    public Queue wastePaymentConfirmedQueue() {
        return new Queue(WASTE_PAYMENT_CONFIRMED_QUEUE, true);
    }

    @Bean
    public Binding wastePaymentConfirmedBinding() {
        return BindingBuilder
                .bind(wastePaymentConfirmedQueue())
                .to(wastePaymentExchange())
                .with(WASTE_PAYMENT_CONFIRMED_ROUTING_KEY);
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
