package com.springcloud.repository;

import com.springcloud.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByTransactionId(String transactionId);
    List<Transaction> findByUserId(Long userId);
    List<Transaction> findByUserIdOrderByTimestampDesc(Long userId);
}
