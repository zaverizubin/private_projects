package nexusglobal.controlpanel.service;

import nexusglobal.controlpanel.model.entities.DocumentSection;
import nexusglobal.controlpanel.model.entities.DocumentTag;
import nexusglobal.controlpanel.model.entities.ProcessDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DocumentService {

    @Autowired
    public DocumentService() {

    }

    public List<DocumentTag> readDocTags(final ProcessDocument processDocument) {
        return new ArrayList<>(List.of(new DocumentTag("<Test 1>",""), new DocumentTag("<Test 2>",""), new DocumentTag("<Test 3>",""),
                new DocumentTag("<Test 4>","")));
    }

    public List<DocumentSection> readDocSections(final ProcessDocument processDocument) {
        return new ArrayList<>(List.of(new DocumentSection("Finance",true), new DocumentSection("Sales",true), new DocumentSection("Marketing",true),
                new DocumentSection("ERP",true)));
    }

    public void processDocTags(final List<DocumentTag> documentTags, final ProcessDocument processDocument){
        //do nothing
    }

    public void processDocSections(final List<DocumentSection> documentSections, final ProcessDocument processDocument){

    }
}