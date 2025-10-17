package com.springcloud.repository;

import com.springcloud.model.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {

    // Find all requests by status (e.g. Pending, Accepted, Rejected)
    List<Request> findByStatus(String status);

    // Find all requests by requester name (optional helper)
    List<Request> findByRequesterNameContainingIgnoreCase(String requesterName);

    // Find all requests by location
    List<Request> findByRequesterLocationContainingIgnoreCase(String location);
}
