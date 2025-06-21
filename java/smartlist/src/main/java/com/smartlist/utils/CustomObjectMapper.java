package com.smartlist.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import jakarta.persistence.Tuple;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CustomObjectMapper {

    private CustomObjectMapper(){

    }

    public static List<?> convertToEntity(List<Tuple> input, Class<?> dtoClass) {
        List<Object> arrayList = new ArrayList<>();
        input.forEach(tuple -> {
            Map<String, Object> temp = new HashMap<>();
            tuple.getElements().
                    forEach(tupleElement ->
                            temp.put(tupleElement.getAlias().toLowerCase(),
                                    tuple.get(tupleElement.getAlias())));
            ObjectMapper mapper = new ObjectMapper();
            mapper.findAndRegisterModules();
            mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
            try {
                //converting to json
                String mapToString = mapper.writeValueAsString(temp);
                //converting json to entity
                arrayList.add(mapper.readValue(mapToString, dtoClass));
            } catch (IOException e) {
                throw new RuntimeException(e.getMessage());
            }

        });
        return arrayList;
    }

}