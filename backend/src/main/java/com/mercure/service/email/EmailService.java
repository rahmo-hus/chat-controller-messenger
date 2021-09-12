package com.mercure.service.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.File;

@Component
@Service
public class EmailService {

    //@Qualifier("getJavaMailSender")
    @Autowired
    private JavaMailSender emailSender;

    public void sendAttachment(String to, String pathToAttachment) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setSubject("Chat Controller - Verification email");
        helper.setText("Congratulations. You have been successfully registered.\n Please download and save" +
                "this certificate and use it to login.");

        FileSystemResource file
                = new FileSystemResource(new File(pathToAttachment));
        helper.addAttachment("Certificate", file);

        emailSender.send(message);
    }

    public void sendMessage(String to, String token){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Verification token");
        message.setText("Your verification code is shown below:\n"+token);
        emailSender.send(message);
    }
}
