package com.springcloud.mapper;

import com.springcloud.dto.WasteListingDTO;
import com.springcloud.model.WasteListing;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface WasteListingMapper {

    @Mapping(target = "requesterName", expression = "java(entity.getRequester() != null ? entity.getRequester().getName() : null)")
    @Mapping(target = "requesterLocation", expression = "java(entity.getRequester() != null ? entity.getRequester().getLocation() : null)")
    @Mapping(target = "requesterRating", expression = "java(entity.getRequester() != null ? entity.getRequester().getRating() : null)")
    @Mapping(target = "acceptedBy", source = "acceptedBy")
    WasteListingDTO toDTO(WasteListing entity);

    @Mapping(target = "requester", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    WasteListing toEntity(WasteListingDTO dto);
}
