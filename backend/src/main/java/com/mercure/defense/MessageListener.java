package com.mercure.defense;

import com.mercure.entity.MessageEntity;
import com.mercure.entity.UserEntity;
import com.mercure.exception.DoSException;
import com.mercure.exception.SQLInjectionException;
import com.mercure.exception.XSSException;
import com.mercure.repository.MessageRepository;
import com.mercure.repository.UserRepository;
import com.mercure.utils.ApplicationContextProvider;
import com.mercure.utils.SafeUtil;
import org.springframework.stereotype.Component;

import javax.persistence.PostPersist;
import javax.persistence.PrePersist;
import java.sql.Timestamp;

@Component
public class MessageListener {

    private static final int STRIKE_TIME_MILLIS = 2000;

    private MessageEntity lastMessageByUser;
    private UserEntity currentUser;

    @PrePersist
    public void prePersist(MessageEntity target) throws SQLInjectionException, XSSException {
        UserRepository userRepository = ApplicationContextProvider.getBean(UserRepository.class);
        MessageRepository messageRepository = ApplicationContextProvider.getBean(MessageRepository.class);
        lastMessageByUser = messageRepository.findLastMessageByUserId(target.getUser_id());
        currentUser = userRepository.getOne(target.getUser_id());
        performSQLInjectionDetection(target);
        performXSSDetection(target);
    }

    @PostPersist
    public void postPersist(MessageEntity target) throws DoSException {
        performDOSDetection(target);
    }

    private void performDOSDetection(MessageEntity target) throws DoSException {
        Timestamp currentMessageTimestamp = target.getCreatedAt();
        Timestamp lastMessageTimeStamp = lastMessageByUser != null ? lastMessageByUser.getCreatedAt() : currentMessageTimestamp;
        if ((currentMessageTimestamp.getTime() - lastMessageTimeStamp.getTime()) < STRIKE_TIME_MILLIS) {
            currentUser.incrementStrikes();
            if (currentUser.getStrikes() > 5) {
                throw new DoSException();
            }
        }
    }

    private void performSQLInjectionDetection(MessageEntity target) throws SQLInjectionException {
        String message = target.getMessage();
        boolean isMalicious = !SafeUtil.isSqlInjectionSafe(message);
        if (isMalicious) {
            throw new SQLInjectionException();
        }
    }

    private void performXSSDetection(MessageEntity target) throws XSSException {
        String message = target.getMessage();
        boolean isMalicious = SafeUtil.isXSSSafe(message);
        if (isMalicious) throw new XSSException();
    }
}
