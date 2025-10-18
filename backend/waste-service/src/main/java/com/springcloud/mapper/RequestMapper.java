package com.springcloud.mapper;

import com.springcloud.dto.RequestDTO;
import com.springcloud.model.Request;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface RequestMapper {

    RequestMapper INSTANCE = Mappers.getMapper(RequestMapper.class);

    // Entity → DTO
    @Mapping(target = "status", source = "status")
    @Mapping(target = "requesterName", source = "requesterName")
    @Mapping(target = "requesterLocation", source = "requesterLocation")
    @Mapping(target = "farmRating", source = "farmRating")
    @Mapping(target = "requesterAvatar", source = "requesterAvatar")
    @Mapping(target = "wasteType", source = "wasteType")
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "preferredPickupTime", source = "preferredPickupTime")
    @Mapping(target = "offeredPrice", source = "offeredPrice")
    @Mapping(target = "totalOffer", source = "totalOffer")
    @Mapping(target = "requestDate", source = "requestDate")
    // DTO does not have 'description' field
    @Mapping(target = "id", source = "id")
    RequestDTO toDTO(Request request);

    // DTO → Entity
    @Mapping(target = "description", ignore = true)
    Request toEntity(RequestDTO dto);
}
