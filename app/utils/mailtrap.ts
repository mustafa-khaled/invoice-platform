import { MailtrapClient } from "mailtrap";

export const mailClient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN!,
});

export const mailtrapSender = {
  email: "hello@demomailtrap.co",
  name: "Mailtrap Test",
};

export const mailtrapRecipients = [
  {
    email: "mostafakhaled0787314@gmail.com",
  },
];
