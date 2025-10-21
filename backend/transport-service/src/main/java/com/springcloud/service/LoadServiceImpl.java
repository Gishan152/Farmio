package com.springcloud.service;

import com.springcloud.dto.LoadDetailsDto;
import com.springcloud.model.LoadDetails;
import com.springcloud.repository.LoadRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LoadServiceImpl implements LoadService {
    @Autowired
    private LoadRepository loadRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public LoadDetailsDto saveLoad(LoadDetailsDto loadDetailsDto){
        LoadDetails load = modelMapper.map(loadDetailsDto, LoadDetails.class);
        LoadDetails savedLoad = loadRepository.save(load);
        return modelMapper.map(savedLoad, LoadDetailsDto.class);
    }

    @Override
    public List<LoadDetailsDto> getAllLoads(){
        List<LoadDetails> loads = loadRepository.findAll();
        return loads.stream()
                .map(load -> modelMapper.map(load,LoadDetailsDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public LoadDetailsDto getLoadById(Long id){
        LoadDetails load = loadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Load not found"));
        return modelMapper.map(load, LoadDetailsDto.class);
    }

    @Transactional
    @Override
    public LoadDetailsDto updateLoad(Long id, LoadDetailsDto loadDetailsDto) {
        LoadDetails existing = loadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Load not found with ID: " + id));

        modelMapper.getConfiguration().setSkipNullEnabled(true);
        modelMapper.map(loadDetailsDto, existing); // only overwrite non-null fields

        LoadDetails saved = loadRepository.save(existing);
        return modelMapper.map(saved, LoadDetailsDto.class);
    }


    @Override
    public void deleteLoad(Long id) {
        if (!loadRepository.existsById(id)) {
            throw new RuntimeException("Load not found with ID: " + id);
        }
        loadRepository.deleteById(id);
    }

    @Override
    @Transactional
    public LoadDetailsDto acceptLoadDriver(Long id, Long driverId) {
        LoadDetails load = loadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Load not found with ID: " + id));

        load.setDriverStatus("Accepted");
        load.setDriverId(driverId);
        LoadDetails saved = loadRepository.save(load);
        return modelMapper.map(saved, LoadDetailsDto.class);
    }
    public LoadDetailsDto acceptPickupDriver(Long id, Long driverId) {
        LoadDetails load = loadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Load not found with ID: " + id));

        load.setDriverStatus("inTransport");
        load.setDriverId(driverId);
        LoadDetails saved = loadRepository.save(load);
        return modelMapper.map(saved, LoadDetailsDto.class);
    }

    public LoadDetailsDto acceptDeliveryDriver(Long id, Long driverId) {
        LoadDetails load = loadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Load not found with ID: " + id));

        load.setDriverStatus("Delivered");
        load.setDriverId(driverId);
        LoadDetails saved = loadRepository.save(load);
        return modelMapper.map(saved, LoadDetailsDto.class);
    }

    @Override
    @Transactional
    public LoadDetailsDto acceptLoadBuyer(Long id) {
        LoadDetails load = loadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Load not found with ID: " + id));
        load.setBuyerStatus("Accepted");
        LoadDetails saved = loadRepository.save(load);
        return modelMapper.map(saved, LoadDetailsDto.class);

    }@Override
    @Transactional
    public LoadDetailsDto acceptLoadSeller(Long id) {
        LoadDetails load = loadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Load not found with ID: " + id));
        load.setSellerStatus("Accepted");
        LoadDetails saved = loadRepository.save(load);
        return modelMapper.map(saved, LoadDetailsDto.class);
    }


}
