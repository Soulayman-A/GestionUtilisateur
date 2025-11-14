package com.example.security.service;

import io.mailtrap.client.MailtrapClient;
import io.mailtrap.config.MailtrapConfig;
import io.mailtrap.factory.MailtrapClientFactory;
import io.mailtrap.model.request.emails.Address;
import io.mailtrap.model.request.emails.MailtrapMail;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MailtrapEmailService {

    private final MailtrapClient client;

    public MailtrapEmailService(@Value("${mailtrap.api-key}") String mailtrapKey) {
        MailtrapConfig config = new MailtrapConfig.Builder()
                .sandbox(true) //Mode Sandbox
                .inboxId(4178007L) //Id de la boite mail sur Mailtrap
                .token(mailtrapKey) //Clé api de mailtrap
                .build();

        this.client = MailtrapClientFactory.createMailtrapClient(config);
    }

    public void sendEmailTo(String recipientEmail) {
        MailtrapMail mail = MailtrapMail.builder()
                .from(new Address("soulayman.arslane@ynov.com", "Mailtrap Test"))
                .to(List.of(new Address(recipientEmail)))
                .subject("Bienvenue !")
                .text("Merci pour votre inscription.")
                .category("Registration")
                .build();

        try {
            client.send(mail); // envoie de l'email
        } catch (Exception e) {
            System.out.println("Erreur envoi email : " + e.getMessage());
        }
    }
}
