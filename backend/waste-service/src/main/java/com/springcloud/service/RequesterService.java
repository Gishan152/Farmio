package com.springcloud.service;

import com.springcloud.model.Requester;
import com.springcloud.repository.RequesterRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RequesterService {

    private final RequesterRepository requesterRepository;

    public RequesterService(RequesterRepository requesterRepository) {
        this.requesterRepository = requesterRepository;
    }

    public List<Requester> getAllRequesters() {
        return requesterRepository.findAll();
    }

    public Requester getRequesterById(Long id) {
        return requesterRepository.findById(id).orElse(null);
    }
}
