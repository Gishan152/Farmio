package com.springcloud.repository;


import com.springcloud.model.Requester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RequesterRepository extends JpaRepository<Requester, Long> {
    // You can add custom queries later, e.g. find by role
    // List<Requester> findByRole(Requester.Role role);
}
