import { container } from 'tsyringe';
import mailConfig from '@config/mail';

import IMailProvider from './models/IMailProvider';

import EtherealMailProvider from './implementations/EtherealMailProvider';
import SendgridMailProvider from './implementations/SendgridMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  sendgrid: container.resolve(SendgridMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
