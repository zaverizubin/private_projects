package com.smartlist.module.file;

import com.smartlist.model.AssetFile;
import com.smartlist.module.file.dto.response.FileRespDTO;
import com.smartlist.services.CryptoService;
import com.smartlist.utils.RegexPatterns;
import org.apache.commons.io.FileUtils;
import org.apache.tomcat.util.codec.binary.Base64;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.xhtmlrenderer.layout.SharedContext;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

@Service
public class FileService {

    public static final Path ROOT_ASSET_FOLDER = Path.of(System.getProperty("user.home"), "smartlist");

    //Autowired
    private final FileRepository fileRepository;
    private final CryptoService cryptoService;
    private final ModelMapper modelMapper;

    public FileService(final FileRepository fileRepository, final CryptoService cryptoService, final ModelMapper modelMapper){
        this.fileRepository = fileRepository;
        this.cryptoService = cryptoService;
        this.modelMapper = modelMapper;
    }

    public FileRespDTO findById(final Integer id) {
        Optional<AssetFile> optionalAssetFile  = this.fileRepository.findById(id);
        if (optionalAssetFile.isEmpty()) {
            throw FileResponseCodes.INVALID_FILE_ID;
        }
        return this.modelMapper.map(optionalAssetFile.get(), FileRespDTO.class);
    }

    public FileRespDTO handleFileUpload(final MultipartFile uploadedFile) {
        if (uploadedFile == null) {
            throw FileResponseCodes.FILE_EMPTY;
        }
        if(uploadedFile.getContentType() == null){
            throw FileResponseCodes.FILE_UNSUPPORTED;
        }

        String destinationFolder = getAssetFolder(uploadedFile.getContentType());

        AssetFile assetFile  = new AssetFile(uploadedFile, destinationFolder);
        copyFileToDestination(uploadedFile, destinationFolder);
        assetFile = this.fileRepository.save(assetFile);

        return this.modelMapper.map(assetFile, FileRespDTO.class);
    }

    public AssetFile copyAndSaveFile(final AssetFile assetFile) {
        String copyFileName = this.cryptoService.generateToken(15);
        String destinationFolder = getAssetFolder(assetFile.getMimetype());

        AssetFile assetFileCopy = new AssetFile();
        assetFileCopy.setId(null);
        assetFileCopy.setVersion(null);
        assetFileCopy.setName(copyFileName);
        assetFileCopy.setOriginalName(assetFile.getOriginalName());
        assetFileCopy.setSize(assetFile.getSize());
        assetFileCopy.setMimetype(assetFile.getMimetype());
        assetFileCopy.setUrl(String.join("/", destinationFolder, assetFileCopy.getName() + "." + assetFile.getOriginalName().split("\\.")[1]));

        try{
            Files.copy(ROOT_ASSET_FOLDER.resolve(Path.of(assetFile.getUrl())), ROOT_ASSET_FOLDER.resolve(Path.of(assetFileCopy.getUrl())));
        }catch (IOException e){
            e.printStackTrace();
        }
        this.fileRepository.save(assetFileCopy);

        return assetFile;
    }

    public byte[] readFile(final AssetFile assetFile){
        try{
            return Files.readAllBytes(ROOT_ASSET_FOLDER.resolve(Path.of(assetFile.getUrl())));
        }catch (IOException e){
            e.printStackTrace();
        }
        return new byte[]{};
    }

    public String getBase64EncodedFileData(final byte[] bytes){
        return Base64.encodeBase64String(bytes);
    }

    private String getAssetFolder(final String mimeType) {
        String rootFolder = "assets/";
        if(mimeType != null){
            if (RegexPatterns.ALLOWED_IMAGE_FILE_EXTENSIONS.contains(mimeType.toLowerCase().replace("image/",""))) {
                return rootFolder + "images";
            } else if (RegexPatterns.ALLOWED_VIDEO_FILE_EXTENSIONS.contains(mimeType.toLowerCase().replace("video/",""))) {
                return rootFolder + "videos";
            } else {
                return rootFolder + "file";
            }
        }else{
            return "";
        }
    }

    private void copyFileToDestination(final MultipartFile uploadedFile, final String destinationFolder) {
        Path path = ROOT_ASSET_FOLDER.resolve(Path.of(destinationFolder, uploadedFile.getOriginalFilename()));
        try {
           File file = new File(path.toString());
           if(file.exists()) {
               Files.delete(path);
           }
           FileUtils.writeByteArrayToFile(new File(path.toString()), uploadedFile.getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public byte[] htmlToPDF(final String inputHTML){
        Document document = Jsoup.parse(inputHTML, "UTF-8");
        document.outputSettings().syntax(Document.OutputSettings.Syntax.xml);

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            ITextRenderer renderer = new ITextRenderer();
            SharedContext sharedContext = renderer.getSharedContext();
            sharedContext.setPrint(true);
            sharedContext.setInteractive(false);
            renderer.setDocumentFromString(document.html());
            renderer.layout();
            renderer.createPDF(outputStream);
            return outputStream.toByteArray();
        } catch (IOException exception) {
            exception.printStackTrace();
        }
        return new byte[0];
    }

    public ResponseEntity<byte[]> getPDFResponseEntity(final String filename, final byte[] reportBytes) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData(filename, filename);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        return new ResponseEntity<>(reportBytes, headers, HttpStatus.OK);
    }
}
