import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException } from '@nestjs/common';

describe('Auth Service', () => {
  let service: AuthService;
  let FakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // create a fake copy of the UsersService
    FakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };
    // creating a DI container for testing (shoet circuiting the DI system)
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthService,
          useValue: FakeUsersService,
        },
      ],
    }).compile();
    //   reaching into the DI system created a bove to get the AuthService
    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted password', async () => {
    const user = await service.signup('asdf@gmail.com', 'asdf');
    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with an email that is in use', async (done) => {
    FakeUsersService.find = () => {
      return Promise.resolve([{ id: 1, email: '@', password: '' } as User]);
    };

    expect(await service.signup('asdf@gmail.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if user sign in with unused email', async () => {
    expect(await service.signin('asdk@gmail.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if an invalid password is provided', async () => {
    FakeUsersService.find = () =>
      Promise.resolve([
        { id: 1, email: 'asdfk@gmail.com', password: 'asdf' } as User,
      ]);
    expect(await service.signin('asdfk@gmail.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });
});
