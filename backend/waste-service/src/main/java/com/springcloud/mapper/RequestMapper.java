package com.springcloud.mapper;

import com.springcloud.dto.RequestDTO;
import com.springcloud.model.Request;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface RequestMapper {

    RequestMapper INSTANCE = Mappers.getMapper(RequestMapper.class);

    // Entity → DTO
    RequestDTO toDTO(Request request);

    // DTO → Entity
    Request toEntity(RequestDTO dto);
}
