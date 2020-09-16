import nodemailer, { Transporter } from 'nodemailer';
import sendgrid from 'nodemailer-sendgrid';
import mailConfig from '@config/mail';
import { injectable, inject } from 'tsyringe';

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

@injectable()
export default class SendgridMailProvider implements IMailProvider {
  private client: Transporter;

  private mailTemplateProvider: IMailTemplateProvider;

  constructor(
    @inject('MailTemplateProvider')
    mailTemplateProvider: IMailTemplateProvider,
  ) {
    this.mailTemplateProvider = mailTemplateProvider;

    this.client = nodemailer.createTransport(
      sendgrid({
        apiKey: process.env.SENDGRID_API_KEY || '',
      }),
    );
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const { name, email } = mailConfig.defaults.from;

    await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });
  }
}
