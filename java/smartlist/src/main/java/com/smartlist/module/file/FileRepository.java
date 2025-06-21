package com.smartlist.module.file;

import com.smartlist.model.AssetFile;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FileRepository extends CrudRepository<AssetFile, Integer> {


}
