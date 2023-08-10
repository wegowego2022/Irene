import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'your-smtp-server.com',
      port: 587,
      secure: false,
      auth: {
        user: 'username',
        pass: 'password',
      },
    });
  }

  async sendEmail(email: string, subject: string, text: string): Promise<void> {
    const mailOptions = {
      from: 'your-email@example.com',
      to: email,
      subject: subject,
      text: text,
    };

    const info = await this.transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);
  }
}
