package com.springcloud.service;

import com.springcloud.model.Request;
import com.springcloud.repository.RequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RequestService {

    private final RequestRepository requestRepository;

    public RequestService(RequestRepository requestRepository) {
        this.requestRepository = requestRepository;
    }

    // Get all requests
    public List<Request> getAllRequests() {
        return requestRepository.findAll();
    }

    // Get requests by status (Pending, Accepted, Rejected)
    public List<Request> getRequestsByStatus(String status) {
        return requestRepository.findByStatus(status);
    }

    // Get a single request by ID
    public Request getRequestById(Long id) {
        return requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found with id " + id));
    }

    // Create a new request
    public Request createRequest(Request request) {
        request.setStatus("Pending"); // default status
        return requestRepository.save(request);
    }

    // Update request status (accept/reject)
    public Request updateRequestStatus(Long id, String newStatus) {
        Request request = getRequestById(id);
        request.setStatus(newStatus);
        return requestRepository.save(request);
    }

    // Delete a request
    public void deleteRequest(Long id) {
        requestRepository.deleteById(id);
    }

}
