import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";
dotenv.config();

interface Sender {
  email: string;
  name: string;
}

export const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_API_TOKEN || "",
});

export const sender: Sender = {
  email: "hello@vedanshjain.me",
  name: "Vedansh Jain",
};
