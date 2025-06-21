package nexusglobal.controlpanel.service;

import nexusglobal.controlpanel.dao.UserDao;
import nexusglobal.controlpanel.model.entities.User;
import org.apache.shiro.authc.credential.PasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService extends BaseEntityService<User, UserDao> {

    private final PasswordService passwordService;

    @Autowired
    public UserService(final UserDao userDao, final PasswordService passwordService) {
        super(userDao);

        this.passwordService = passwordService;
    }


    @Override
    public User updateEntity(final User user) {
        if (!"".equals(user.getPlainPassword())) {
            user.encryptPassword(this.passwordService);
        }
        return super.updateEntity(user);
    }
}