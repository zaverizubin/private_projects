package nexusglobal.wordprocessor.config.database.audit;

import nexusglobal.wordprocessor.model.CustomPrincipal;
import org.hibernate.envers.RevisionListener;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CustomRevisionListener implements RevisionListener {

    private void populateUserName(final CustomRevisionInfo revisionEntity) {

        String userName;
        try {
            final Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (!"anonymousUser".equals(principal)) {
                userName = ((CustomPrincipal) principal).getUser().getUserName();
            } else {
                userName = "anonymous";
            }
        } catch (final Exception ex) { // Exception will be thrown if there is no session available
            userName = "anonymous";
        }

        revisionEntity.setUserName(userName);

    }

    @Override
    public void newRevision(final Object revisionEntity) {
        final CustomRevisionInfo customRevisionEntity = (CustomRevisionInfo) revisionEntity;
        populateUserName(customRevisionEntity);
    }

}
