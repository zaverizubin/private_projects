package com.smartlist.model.mocks;

import com.smartlist.config.PropertiesConfig;
import com.smartlist.model.EmailLog;
import org.instancio.Gen;
import org.instancio.Instancio;
import org.instancio.Model;

import static org.instancio.Select.all;
import static org.instancio.Select.field;


public class EmailLogModel extends BaseEntityModel {

    public Model<EmailLog> getModel(final PropertiesConfig propertiesConfig){
        return Instancio.of(EmailLog.class)

                .ignore(field(EmailLog::getId))

                .ignore(field(EmailLog::isDirty))

                .generate(field(EmailLog::getMessage), generators -> generators.string().lowerCase().maxLength(5000))

                .supply(field(EmailLog::getSender), propertiesConfig::getEmailUsername)

                .generate(field(EmailLog::getReceiver), Gen.net().email()).withUnique(field(EmailLog::getReceiver))

                .generate(field(EmailLog::getErrorLog), generators -> generators.string().lowerCase().maxLength(5000))

                .onComplete(all(EmailLog.class), (EmailLog emailLog) -> {
                    if(emailLog.isStatus()){
                        emailLog.setErrorLog(null);
                    }
                })
                .toModel();
    }
}
