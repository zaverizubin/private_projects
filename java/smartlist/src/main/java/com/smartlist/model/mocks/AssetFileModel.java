package com.smartlist.model.mocks;

import com.smartlist.enums.Disk;
import com.smartlist.model.AssetFile;
import org.instancio.Instancio;
import org.instancio.Model;

import java.time.LocalDateTime;
import java.util.List;

import static org.instancio.Select.all;
import static org.instancio.Select.field;

public class AssetFileModel extends BaseEntityModel {

    private final List<String> mimeTypes = List.of("image/jpeg", "image/png", "video/x-msvideo", "application/pdf");
    private final List<String> urls = List.of("assets/images/", "assets/videos/", "assets/file/");
    private final List<String> fileExtensions = List.of(".mov", ".pdf", ".png", ".jpg", ".avi");

    public Model<AssetFile> getModel(){
        return Instancio.of(AssetFile.class)
                .ignore(field(AssetFile::getId))

                .ignore(field(AssetFile::getMimetype))

                .ignore(field(AssetFile::isDirty))

                .set(field(AssetFile::getDisk), Disk.LOCAL)

                .generate(field(AssetFile::getName), generators -> generators.string().lowerCase().maxLength(10))

                .generate(field(AssetFile::getOriginalName), generators -> generators.string().lowerCase().maxLength(15))

                .supply(field(AssetFile::getSize), random -> random.longRange(3000,450000))

                .generate(all(LocalDateTime.class), generators -> generators.temporal()
                        .localDateTime()
                        .past()
                        .range(LocalDateTime.of(2024,1,1,0,0), LocalDateTime.now()))

                .generate(field(AssetFile::getUrl), generators -> generators.string().lowerCase())

                .onComplete(all(AssetFile.class), (AssetFile assetFile) -> {
                    String extn = this.fileExtensions.get(this.randomGenerator.nextInt(this.fileExtensions.size()));
                    String mimeType = "";
                    String prefix = "";
                    switch (extn) {
                        case ".jpg" -> {
                            prefix = this.urls.get(0);
                            mimeType = this.mimeTypes.get(0);
                        }
                        case ".png" -> {
                            prefix = this.urls.get(0);
                            mimeType = this.mimeTypes.get(1);
                        }
                        case ".mov", ".avi" -> {
                            prefix = this.urls.get(1);
                            mimeType = this.mimeTypes.get(2);
                        }
                        case ".pdf" -> {
                            prefix = this.urls.get(2);
                            mimeType = this.mimeTypes.get(3);
                        }
                        default -> {}
                    }
                    assetFile.setUrl(prefix + assetFile.getUrl() + extn);
                    assetFile.setOriginalName(assetFile.getOriginalName() + extn);
                    assetFile.setMimetype(mimeType);
                })
                .toModel();
    }
}
