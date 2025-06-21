package com.smartlist.module.file;

import com.smartlist.module.file.dto.response.FileRespDTO;
import com.smartlist.utils.AppResponseCodes;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@Tag(name = "File", description = "File API")
@RequestMapping(value ="/file/", produces = { "application/json" })
@ResponseStatus(HttpStatus.OK)
@Validated
@Secured({"USER","ADMIN","CANDIDATE","SUPERADMIN"})
public class FileController {

    private final FileService fileService;

    FileController(final FileService fileService){
        this.fileService = fileService;
    }

    @Operation(summary = "Get file url by id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = FileRespDTO.class))  }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "404", description = FileResponseCodes.INVALID_FILE_ID_DESCRIPTION, content = @Content)
    })
    @GetMapping("{id}")
    public FileRespDTO findOne(@PathVariable("id") @Positive Integer id) {
        return this.fileService.findById(id);
    }

    @Operation(summary = "Upload a file")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = FileRespDTO.class))  }),
            @ApiResponse(responseCode = "400", description = AppResponseCodes.BAD_REQUEST_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = FileResponseCodes.FILE_UNSUPPORTED_DESCRIPTION, content = @Content),
            @ApiResponse(responseCode = "400", description = FileResponseCodes.FILE_EMPTY_DESCRIPTION, content = @Content)
    })
    @PostMapping("upload")
    @ResponseStatus(HttpStatus.CREATED)
    public FileRespDTO uploadFile(@RequestParam("file") MultipartFile file) {
        return this.fileService.handleFileUpload(file);
    }


    @Operation(summary = "Download a file")
    @GetMapping("download/*")
    public void viewfile() {


    };

}
