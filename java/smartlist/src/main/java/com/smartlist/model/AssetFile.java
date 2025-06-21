package com.smartlist.model;

import com.smartlist.enums.Disk;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Entity
@Table(name = "\"files\"")
@Getter
@Setter
public class AssetFile extends BaseEntity {

    @Column(length=255, name = "\"original_name\"")
    String originalName;

    @Column(length=255)
    String name;

    Long size;

    @Enumerated(EnumType.STRING)
    Disk disk = Disk.LOCAL;

    @Column(length=1000)
    String url;

    @Column(length=255, name = "\"mime_type\"")
    String mimetype;

    public AssetFile(final MultipartFile uploadedFile, final String destinationFolder){
        this.originalName = uploadedFile.getOriginalFilename();
        this.name = uploadedFile.getName();
        this.size = uploadedFile.getSize();
        this.url = String.join("/", destinationFolder, uploadedFile.getOriginalFilename());
        this.mimetype = uploadedFile.getContentType();
    }

    public AssetFile() {

    }
}
