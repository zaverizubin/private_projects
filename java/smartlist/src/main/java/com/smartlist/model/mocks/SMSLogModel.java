package com.smartlist.model.mocks;

import com.smartlist.model.SMSLog;
import org.instancio.Instancio;
import org.instancio.Model;

import java.time.LocalDateTime;

import static org.instancio.Select.all;
import static org.instancio.Select.field;

public class SMSLogModel extends BaseEntityModel {

    public Model<SMSLog> getModel(){
        return Instancio.of(SMSLog.class)
                .ignore(field(SMSLog::getId))

                .ignore(field(SMSLog::isDirty))

                .generate(field(SMSLog::getSender), generators -> generators.string().lowerCase().maxLength(255))

                .generate(field(SMSLog::getReceiver), generators -> generators.string().lowerCase().maxLength(255))

                .generate(field(SMSLog::getResponse), generators -> generators.text().loremIpsum().words(5000))

                .generate(field(SMSLog::getUid), generators -> generators.text().uuid())

                .generate(all(LocalDateTime.class), generators -> generators.temporal()
                        .localDateTime()
                        .past()
                        .range(LocalDateTime.of(2024,1,1,0,0), LocalDateTime.now()))

                .toModel();
    }
}
