import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

// import User from '../infra/typeorm/entities/User';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  private usersRepository: IUsersRepository;

  private emailProvider: IMailProvider;

  private userTokensRepository: IUserTokensRepository;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,
    @inject('MailProvider')
    emailProvider: IMailProvider,
    @inject('UserTokensRepository')
    userTokensRepository: IUserTokensRepository,
  ) {
    this.usersRepository = usersRepository;
    this.emailProvider = emailProvider;
    this.userTokensRepository = userTokensRepository;
  }

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exists.');
    }

    await this.userTokensRepository.generate(user.id);

    this.emailProvider.sendMail(
      email,
      'Pedido de recuperação de senha recebido.',
    );
  }
}

export default SendForgotPasswordEmailService;
