import { injectable, inject } from 'tsyringe';

// import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUsersRepository from '../repositories/IUsersRepository';

// import User from '../infra/typeorm/entities/User';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  private usersRepository: IUsersRepository;

  private emailProvider: IMailProvider;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,
    @inject('MailProvider')
    emailProvider: IMailProvider,
  ) {
    this.usersRepository = usersRepository;
    this.emailProvider = emailProvider;
  }

  public async execute({ email }: IRequest): Promise<void> {
    this.emailProvider.sendMail(
      email,
      'Pedido de recuperação de senha recebido.',
    );
  }
}

export default SendForgotPasswordEmailService;
